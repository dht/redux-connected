import { StoreNodeTypes, NodeType } from 'redux-store-generator';
import {
    MockUser,
    MockLog,
    MockProduct,
    MockChat,
    MockChatMessage,
} from 'redux-connected-types';
import {
    splitDeepStructure,
    generateFromMap,
    ParentAndChildren,
} from './faker';

const userMap = {
    firstName: 'name.firstName',
    lastName: 'name.lastName',
    username: 'internet.userName',
    email: 'internet.email',
    phone: 'phone.phoneNumber',
    avatar: 'image.avatar',
};

const logMap = {
    id: 'datatype.uuid',
    date: 'date.past',
    priority: 'datatype.number',
};

const productMap = {
    id: 'datatype.uuid',
    dateAdded: 'date.past',
    price: 'commerce.price',
    department: 'commerce.department',
    color: 'commerce.color',
    name: 'commerce.productName',
    description: 'commerce.productDescription',
    thumbnail: 'image.avatar',
    imageUrl: 'image.imageUrl',
    shippingDate: 'date.recent',
};

const chatMessageMap = {
    id: 'datatype.uuid',
    chatId: ':parentId',
    timestamp: 'date.soon',
    content: 'lorem.sentence',
    isMe: 'datatype.boolean',
};

const chatMap = {
    id: 'datatype.uuid',
    title: 'name.firstName',
    items: [chatMessageMap, chatMessageMap, chatMessageMap],
};

export const generateCollection = (productsCount, logsCount, chatsCount) => {
    const chats = splitDeepStructure(generateFromMap(chatMap, chatsCount));
    const data = {
        user: generateFromMap(userMap),
        products: generateFromMap(productMap, productsCount),
        logs: generateFromMap(logMap, logsCount),
        chats: chats.rootItems,
        chatItems: chats.children,
    };

    const index = `import { user } from './user';
import { products } from './products';
import { logs } from './logs';
import { chats } from './chats';
import { chatItems } from './chatItems';

export default {
    user,
    products,
    logs,
    chats,
    chatItems
}
    `;

    return {
        data,
        index,
    };
};

export const randomUser = (): MockUser => generateFromMap(userMap);

export const randomLog = (): MockLog => generateFromMap(logMap);
export const randomProduct = (): MockProduct => generateFromMap(productMap);

export const randomLogs = (count): MockLog[] => generateFromMap(logMap, count);
export const randomProducts = (count): MockProduct[] =>
    generateFromMap(productMap, count);

export const randomChat = (): MockChat => generateFromMap(chatMap);
export const randomChatMessage = (chatId: string): MockChatMessage => ({
    ...generateFromMap(chatMessageMap),
    chatId,
});

export const randomChats = (
    count
): ParentAndChildren<MockChat, MockChatMessage> =>
    splitDeepStructure(generateFromMap(chatMap, count));

export const mockStoreStructure: StoreNodeTypes = {
    user: NodeType.SINGLE_NODE,
    logs: NodeType.QUEUE_NODE,
    products: NodeType.COLLECTION_NODE,
    chats: NodeType.GROUPED_LIST_NODE,
};
