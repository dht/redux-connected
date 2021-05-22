import { socketRoot } from '../sockets/socketRoot';
import { middlewareSockets } from '../middlewares/midSocketsBroadcast';

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

export const configureSockets = (app: any) => {
    app.use(middlewareSockets());
    socketRoot(io);
};
