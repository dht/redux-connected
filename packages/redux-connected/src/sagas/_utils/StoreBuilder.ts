import { startSaga } from './../process-manager';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { Json } from 'redux-store-generator';
import createSagaMiddleware from 'redux-saga';
import { StoreOptions, StoreDefinition, Sagas } from './../../types/types';
import ProcessManager from './../process-manager';
import { composeWithDevTools } from 'redux-devtools-extension';

export class StoreBuilder {
    private definition: StoreDefinition = {
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
        this.definition.name = name;
    }

    withInitialState(initialState: Json) {
        this.definition.initialState = {
            ...this.definition.initialState,
            ...initialState,
        };
        return this;
    }

    withReducers(reducers: any) {
        this.definition.reducers = {
            ...this.definition.reducers,
            ...reducers,
        };
        return this;
    }

    withMiddlewares(...middlewares: any) {
        this.definition.middlewares = [
            ...middlewares,
            ...this.definition.middlewares,
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
        this.definition.sagas = [...this.definition.sagas, ...sagas];
        return this;
    }
    withOptions(options: Partial<StoreOptions>) {
        this.definition.options = options;
        return this;
    }

    get options(): StoreOptions {
        return {
            ...this.definition.options,
        } as StoreOptions;
    }

    fireSagas = (store: any) => {
        this.definition.sagas.forEach((sagaId: keyof Sagas) => {
            const action = startSaga({ sagaId });
            store.dispatch(action);
        });
    };

    build(): any {
        const { devTools } = this.options;

        // add the saga middleware
        if (this.definition.sagas.length > 0) {
            this.sagaMiddleware = createSagaMiddleware();
            this.withMiddlewares(this.sagaMiddleware);
        }

        const initialState = this.definition.initialState;

        const rootReducer = combineReducers(this.definition.reducers);

        const middlewareEnhancer = applyMiddleware(
            ...this.preMiddlewares,
            ...this.definition.middlewares,
            ...this.postMiddlewares
        );

        const composeMethod = devTools ? composeWithDevTools : (compose as any);
        const composedEnhancers = composeMethod(middlewareEnhancer);

        const store = createStore(
            rootReducer,
            initialState,
            composedEnhancers
        ) as any;

        const processManager = new ProcessManager();
        if (this.definition.sagas.length > 0) {
            this.sagaMiddleware.run(processManager.run);
            setTimeout(() => this.fireSagas(store));
        }

        return store;
    }
}
