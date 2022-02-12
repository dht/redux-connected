import socketIO from 'socket.io-client';
const chalk = require('chalk');

console.log(`${chalk.cyan('checking server sockets')}`);

const io = socketIO('http://localhost:3507');

io.on('connect', () => {
    io.emit('action', {
        type: 'PATCH_APPSTATE',
        payload: {
            good: 2,
        },
        isRemote: true,
        storeId: 'client',
    });
});
