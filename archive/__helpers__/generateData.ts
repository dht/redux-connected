// import { generateMockData as generateMockDataFirestore } from './adapters/client/firestore/mockDataGenerator';
// import { generateMockData as generateMockDataRealtimeData } from './adapters/client/realtimeData/mockDataGenerator';
// import { generateMockData as generateMockDataFs } from './adapters/server/fs/mockDataGenerator';
// import { generateMockData as generateMockDataFsDirectories } from './adapters/server/fsDirectories/mockDataGenerator';
// import { generateMockData as generateMockDataJsonServer } from './adapters/client/jsonServer/mockDataGenerator';
import { generateMockData as generateMockDataMongoDb } from './adapters/server/mongoDb/mockDataGenerator';
// import { generateMockData as generateMockDataMySql } from './adapters/server/mysql/mockDataGenerator';

const run = async () => {
    // await generateMockDataFirestore();
    // await generateMockDataRealtimeData();
    // generateMockDataFs();
    // generateMockDataFsDirectories();
    generateMockDataMongoDb();
};

run();
