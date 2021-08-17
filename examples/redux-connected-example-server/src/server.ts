import { connectedStore } from './redux/store';
import { middlewareApi } from './middlewares/midApi';
import { middlewareAuthorization } from './middlewares/midAuthorization';
import { middlewarePing } from './middlewares/midPing';
import { middlewareSimulateError } from './middlewares/midSimulateError';

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./src/data/data.json');
const middlewares = jsonServer.defaults();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);

const cors = require('cors');

export const startServer = (port: number, dbFilePath: string) => {
    app.use(cors());
    app.use(middlewareAuthorization());
    // app.use(middlewareSimulateError(500));
    app.use(bodyParser.json());

    app.get('/ping', middlewarePing());
    app.use('/api', middlewares);
    app.use('/api', router);
    // app.use('/api', middlewareApi());

    http.listen(port, () => {
        console.log(`JSON Server is running on port ${port}`);
    });
};

startServer(3001, './src/data/data.json');
