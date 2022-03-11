import { ApiRequest } from '../../types/types';
import { ResponseBuilder } from '../../utils/ResponseBuilder';
import { AxiosResponse } from 'axios';

const $i = (_request: ApiRequest, res: AxiosResponse) => res.data;

export const handleAxiosRequest = (
    axiosPromise: Promise<AxiosResponse>,
    request: ApiRequest,
    parseReturnedData = $i
) => {
    const response = new ResponseBuilder(request);

    axiosPromise
        .then((res: AxiosResponse) => {
            response.withIsSuccess(true).withAxiosResponse(res);
            const data = parseReturnedData(request, res);
            response.withData(data);
        })
        .catch(function (error: any) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const { status } = error.response;

                const errorType = status === 401 ? 'authorization' : 'server';

                response
                    .withErrorType(errorType)
                    .withAxiosResponse(error.response);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                response.withErrorType('timeout');
            } else {
                // Something happened in setting up the request that triggered an Error
                response
                    .withErrorType('javascript')
                    .withErrorMessage(error.message);
            }
        })
        .finally(() => {
            return response.build();
        });
};
