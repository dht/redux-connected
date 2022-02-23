require('dotenv-flow').config();
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.SERVERLESS_USERNAME}:${process.env.SERVERLESS_PASSWORD}@cluster0.bnai4.mongodb.net/db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect(async (_err: any) => {
    console.log('_err ->', _err);

    const collection = client.db('test').collection('products ');
    const result = await collection.find({}).toArray();
    console.log('result ->', result);

    // perform actions on the collection object
    client.close();
});
