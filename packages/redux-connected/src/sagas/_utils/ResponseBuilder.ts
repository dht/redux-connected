import { generateMeta } from './meta';
import { ApiResponse, ApiRequest, ApiErrorType } from '../../types/types';
import { AxiosResponse } from 'axios';

let sequence = 1;

type Transformer = (items: any) => any;

export class ResponseBuilder {
    private output = {} as ApiResponse;
    private response = {} as AxiosResponse;
    private transformers = [] as Transformer[];

    constructor(request: ApiRequest) {
        this.output.meta = generateMeta(sequence++);
        this.output.request = request;
    }

    withAxiosResponse(axiosResponse: AxiosResponse) {
        this.response = axiosResponse;
        return this;
    }

    withData(data: any) {
        this.output.data = data;
        return this;
    }

    withIsSuccess(isSuccess: boolean) {
        this.output.isSuccess = isSuccess;
        return this;
    }

    withIsError(isError: boolean) {
        this.output.isError = isError;
        return this;
    }

    withErrorType(errorType: ApiErrorType) {
        this.output.errorType = errorType;
        return this;
    }

    withErrorMessage(errorMessage: string) {
        this.output.errorMessage = errorMessage;
        return this;
    }

    withStatus(status: number) {
        this.output.status = status;
        return this;
    }

    withTransformer(transformer: Transformer) {
        this.transformers.push(transformer);
        return this;
    }

    build(): ApiResponse {
        this.transformers.forEach((transformer) => {
            if (Array.isArray(this.output.data)) {
                this.output.data = this.output.data.map((item) =>
                    transformer(item)
                );
            }
        });

        if (!this.response) {
            return this.output;
        } else {
            this.output.status = this.response.status;
            this.output.statusText = this.response.statusText;
            this.output.headers = this.response.headers;

            return this.output;
        }
    }
}
