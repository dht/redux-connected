const socketPingCallback = (socket: any, io: any) => {
    console.log('ping: a user connected');

    socket.on('disconnect', () => {
        console.log('ping: user disconnected');
    });
};

export const socketPing = (io: any) => {
    io.on('connection', (socket: any) => socketPingCallback(socket, io));
};
