export const allData = {
    singles: {
        appState: {
            isLoading: true,
            isLoggedIn: false,
        },
        currentIds: {
            chatId: '1',
        },
    },
    chats: {
        '1': {
            id: '1',
            name: 'chat 1',
        },
        '2': {
            id: '2',
            name: 'chat 2',
        },
    },
    chatsItems: {
        '1': {
            id: '1',
            name: 'message 1',
            parentId: '1',
        },
        '2': {
            id: '2',
            name: 'message 2',
            parentId: '1',
        },
        '3': {
            id: '3',
            name: 'message 1',
            parentId: '2',
        },
    },
};
