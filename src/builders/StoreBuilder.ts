import createSagaMiddleware from 'redux-saga';
import { Json } from 'redux-store-generator';
import { StoreDefinition } from '../types';
import {
    applyMiddleware,
    combineReducers,
    createStore,
    compose,
    Middleware,
} from 'redux';
import { merge as _merge } from 'lodash';
import { composeWithDevTools } from '@redux-devtools/extension';

type Callback = (data: any) => void;

export class StoreBuilder {
    private definition: StoreDefinition = {
        name: '',
        initialState: {},
        reducers: {},
        middlewares: [],
        enhancers: [],
        sagas: [],
        enableDevtoolsExtension: false,
    };
    private preMiddlewares: any[] = [];
    private postMiddlewares: any[] = [];
    private sagaMiddleware: any;
    private preBuildHooks: Callback[] = [];
    private postBuildHooks: Callback[] = [];

    constructor(name: string) {
        this.definition.name = name;
    }

    withInitialState(initialState: Json | undefined) {
        this.definition.initialState = _merge(
            this.definition.initialState,
            initialState
        );
        return this;
    }

    withPreBuildHook(callback: Callback) {
        this.preBuildHooks.push(callback);
        return this;
    }

    withPostBuildHook(callback: Callback) {
        this.postBuildHooks.push(callback);
        return this;
    }

    withReducers(reducers: any) {
        this.definition.reducers = {
            ...this.definition.reducers,
            ...reducers,
        };
        return this;
    }

    withMiddlewares(middlewares: Middleware | Middleware[]) {
        const extraMiddlewares = Array.isArray(middlewares)
            ? middlewares
            : [middlewares];

        this.definition.middlewares = [
            ...this.definition.middlewares,
            ...extraMiddlewares,
        ];

        return this;
    }

    withEnhancers(enhancers: any | any[]) {
        const extraEnhancers = Array.isArray(enhancers)
            ? enhancers
            : [enhancers];

        this.definition.enhancers = [
            ...this.definition.enhancers,
            ...extraEnhancers,
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

    clearSagas() {
        this.definition.sagas = [];
        return this;
    }

    withDevtoolsExtensions(enable?: boolean) {
        this.definition.enableDevtoolsExtension = enable === true;
        return this;
    }

    build<T = any>(): T {
        // add the saga middleware
        this.preBuildHooks.forEach((callback: Callback) => {
            callback(store);
        });

        if (this.definition.sagas.length > 0) {
            this.sagaMiddleware = createSagaMiddleware();
            this.withMiddlewares(this.sagaMiddleware);
        }

        const rootReducer = combineReducers({
            ...this.definition.reducers,
        });

        const middlewareEnhancer = applyMiddleware(
            ...this.preMiddlewares,
            ...this.definition.middlewares,
            ...this.postMiddlewares
        );

        const composeMethod = this.definition.enableDevtoolsExtension
            ? composeWithDevTools
            : compose;

        const composedEnhancers = composeMethod(
            middlewareEnhancer,
            ...this.definition.enhancers
        );

        const store = createStore(
            rootReducer,
            this.definition.initialState,
            composedEnhancers
        ) as any;

        this.postBuildHooks.forEach((callback: Callback) => {
            callback(store);
        });

        // running sagas
        this.definition.sagas.forEach((saga: any) => {
            this.sagaMiddleware.run(saga);
        });

        return store;
    }
}
