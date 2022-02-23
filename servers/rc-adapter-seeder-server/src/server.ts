import { getIps } from './utils/ip';
const express = require('express');
const jsonServer = require('json-server');
const router = jsonServer.router('./data/data.json');
const middlewares = jsonServer.defaults();
const app = express();
const cors = require('cors');
const chalk = require('chalk');
const port = 3505;
const bodyParser = require('body-parser');

const selfUrl = `http://${getIps()[0]}:${port}`;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', middlewares);
app.use('/api', router);

app.listen(port, () => {
    console.log(
        `redux-connected-ui-server listening at ${chalk.yellow(selfUrl)}`
    );
});
