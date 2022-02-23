import { getIps } from './utils/ip';
import { initStore } from './store/store';
require('dotenv-flow').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const start = async (port: number) => {
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/', (req: any, res: any) => {
        res.send('pong');
    });

    const server = app.listen(port, () => {
        const ips = getIps();
        const domain = `http://${ips[0]}:${port}`;
        console.log(`Server running on ${chalk.cyan(domain)}\n\n`);
    });

    // 1st tier
    initStore(server);
};

start(3507);
