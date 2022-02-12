export type Json = Record<string, any>;

export interface StoreDefinition {
    name: string;
    initialState: Json;
    reducers: any;
    middlewares: any;
    enhancers: any;
    sagas: any;
    enableDevtoolsExtension: boolean;
}
