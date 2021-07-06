import { startSaga } from '../process-manager';
import {
    applyMiddleware,
    combineReducers,
    createStore,
    compose,
    Middleware,
} from 'redux';
import {
    clearNodes,
    Json,
} from 'redux-store-generator';
import createSagaMiddleware from 'redux-saga';
import { StoreOptions, StoreDefinition, Sagas } from '../../types/types';
import ProcessManager from '../process-manager';
import { composeWithDevTools } from 'redux-devtools-extension';

export class StoreBuilder {
    private output: StoreDefinition = {
        name: '',
        initialState: {},
        reducers: {},
        middlewares: [],
        sagas: [],
        options: {},
    };
    private preMiddlewares: any[] = [];
    private postMiddlewares: any[] = [];
    private sagaMiddleware: any;

    constructor(name: string) {
        this.output.name = name;
    }

    withInitialState(initialState: Json | undefined) {
        this.output.initialState = {
            ...this.output.initialState,
            ...initialState,
        };
        return this;
    }

    withReducers(reducers: any) {
        this.output.reducers = {
            ...this.output.reducers,
            ...reducers,
        };
        return this;
    }

    withMiddlewares(middlewares: Middleware | Middleware[]) {
        const extraMiddlewares = Array.isArray(middlewares)
            ? middlewares
            : [middlewares];

        this.output.middlewares = [
            ...this.output.middlewares,
            ...extraMiddlewares,
        ];

        return this;
    }

    withPreMiddlewares(...middlewares: any) {
        this.preMiddlewares = middlewares;
        return this;
    }

    withPostMiddlewares(...middlewares: any) {
        this.postMiddlewares = middlewares;
        return this;
    }

    withSagas(...sagas: any) {
        this.output.sagas = [...this.output.sagas, ...sagas];
        return this;
    }
    withOptions(options: Partial<StoreOptions>) {
        this.output.options = options;
        return this;
    }

    get options(): StoreOptions {
        return {
            ...this.output.options,
        } as StoreOptions;
    }

    fireSagas = (store: any) => {
        this.output.sagas.forEach((sagaId: keyof Sagas) => {
            const action = startSaga({ sagaId });
            store.dispatch(action);
        });
    };

    build(): any {
        const { devTools } = this.options;

        // add the saga middleware
        if (this.output.sagas.length > 0) {
            this.sagaMiddleware = createSagaMiddleware();
            this.withMiddlewares(this.sagaMiddleware);
        }

        const initialState = clearNodes(
            this.output.initialState,
            this.options.clearNodes || []
        );

        const rootReducer = combineReducers({ ...this.output.reducers });

        const middlewareEnhancer = applyMiddleware(
            ...this.preMiddlewares,
            ...this.output.middlewares,
            ...this.postMiddlewares
        );

        const composeMethod = devTools?.enable
            ? composeWithDevTools
            : (compose as any);
        const composedEnhancers = composeMethod(middlewareEnhancer);

        const store = createStore(
            rootReducer,
            initialState,
            composedEnhancers
        ) as any;

        const processManager = new ProcessManager();
        if (this.output.sagas.length > 0) {
            this.sagaMiddleware.run(processManager.run);
            setTimeout(() => this.fireSagas(store));
        }

        return store;
    }
}
