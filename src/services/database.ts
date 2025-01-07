import { MongoClient, Db, Collection } from 'mongodb';

const uri = ''; //connection string
let db: Db;

export const connectDB = async () => {
    if (!db) {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(''); //dbname
        console.log('Connected to MongoDB');
    }
    return db;
};

export const getUserCollection = async (): Promise<Collection> => {
    const database = await connectDB();
    return database.collection(''); //collection
};