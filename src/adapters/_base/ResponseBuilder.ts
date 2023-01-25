import { generateIds } from '../../utils/ids';
import { ApiResponse, ApiRequest, ApiErrorType } from '../../types';
import { AxiosResponse } from 'axios';
import { QuerySnapshot } from 'firebase/firestore/lite';
import { FirestoreResponse } from '../firestore/adapterFirestore';

let sequence = 1;

type Transformer = (items: any) => any;

export class ResponseBuilder {
    private output = {} as ApiResponse;
    private response = {} as AxiosResponse;
    private transformers = [] as Transformer[];
    private firestoreResponse?: FirestoreResponse;

    constructor(request: ApiRequest) {
        this.output = {
            ...generateIds(sequence++),
        } as ApiResponse;

        this.output.request = request;
    }

    withAxiosResponse(axiosResponse: AxiosResponse) {
        this.response = axiosResponse;
        return this;
    }

    withFirestoreResponse(firestoreResponse: FirestoreResponse) {
        this.firestoreResponse = firestoreResponse;
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

    withStopPropagation(value: boolean) {
        this.output.stopPropagation = value;
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
