import * as sockets from '../utils/sockets';

export const middlewareMirror = (_store) => (next) => (action) => {
    if (sockets.isSocketServer || !action.isRemote) {
        sockets.remoteAction(action);
    }

    return next(action);
};
