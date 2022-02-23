const fs = require('fs-extra');
const fetch = require('node-fetch');
const { small } = require('rc-adapter-fixtures');

const PORT = 4756;

let serverInstance;

const generateMockServer = (dbPath, data) => {
    fs.writeJsonSync(dbPath, data, { spaces: 4 });

    const jsonServer = require('json-server');
    const server = jsonServer.create();
    const router = jsonServer.router(dbPath);
    const middlewares = jsonServer.defaults();

    server.use(middlewares);
    server.use(router);
    serverInstance = server.listen(PORT, () => {
        console.log(`JSON Server is running on port ${PORT}`);
    });
};

const closeMockServer = () => {
    serverInstance.close();
};

generateMockServer('./db.json', small);
