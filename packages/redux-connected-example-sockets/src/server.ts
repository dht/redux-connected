export type EmitOptions = {
    namespace?: string;
    rooms?: string[];
    roomId?: string;
    recipientId?: string;
    includeSender: boolean;
    toAll: boolean;
};

export type EmitType =
    | 'none'
    | 'toAll'
    | 'recipientId'
    | 'includeSender'
    | 'includeSenderWithRooms'
    | 'excludeSender'
    | 'excludeSenderWithRooms';

export class EmitterBuilder {
    private options: EmitOptions = {
        includeSender: false,
        toAll: false,
    };
    private _type: EmitType = 'none';

    withOptions(options: Partial<EmitOptions> = {}) {
        this.options = { ...this.options, ...options };
        return this;
    }

    withToAll(toAll: boolean) {
        this.options.toAll = toAll;
        return this;
    }

    withNameSpace(path: string) {
        this.options.namespace = path;
        return this;
    }

    withRooms(rooms: string[]) {
        this.options.rooms = rooms;
        return this;
    }

    withIncludeSender(includeSender: boolean) {
        this.options.includeSender = includeSender;
        return this;
    }

    withRecipientId(recipientId: string) {
        this.options.recipientId = recipientId;
        return this;
    }

    set type(type: EmitType) {
        console.log('type ->', type);
        this._type = type;
    }

    get type() {
        return this._type;
    }

    get rooms() {
        const { rooms = [], roomId } = this.options;
        const output = [...rooms];

        if (roomId) {
            output.push(roomId);
        }

        return output;
    }

    build(socket: any, io: any) {
        const { toAll, recipientId, namespace, includeSender } = this.options;

        let emitter;

        const rooms = this.rooms;

        if (toAll) {
            emitter = io;
            this.type = 'toAll';
            return emitter;
        }

        if (recipientId) {
            emitter = io.to(recipientId);
            this.type = 'recipientId';
            return emitter;
        }

        if (!namespace && rooms.length === 0) {
            if (includeSender) {
                this.type = 'includeSender';
                return socket;
            } else {
                this.type = 'excludeSender';
                return socket.broadcast;
            }
        }

        if (!includeSender) {
            emitter = socket;
            rooms.forEach((roomId: string) => {
                emitter = emitter.to(roomId);
            });
            this.type = 'excludeSenderWithRooms';
            return emitter;
        } else {
            emitter = io;
            let method = 'in';
            this.type = 'includeSenderWithRooms';

            if (namespace) {
                emitter = emitter.of(namespace);
                method = 'to';
            }

            rooms.forEach((roomId: string) => {
                emitter = emitter[method](roomId);
            });

            return emitter;
        }
    }
}

export class Emitter {
    constructor(private socket: any, private io: any) {}

    get(options?: Partial<EmitOptions>) {
        const emitterBuilder = new EmitterBuilder().withOptions(options);
        return emitterBuilder.build(this.socket, this.io);
    }
}
