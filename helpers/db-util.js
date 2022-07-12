import { MongoClient } from "mongodb";

export async function connectDataBase() {
  const client = await MongoClient.connect(
    "mongodb+srv://amir:1234@cluster0.hafnu.mongodb.net/events?retryWrites=true&w=majority"
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db("events");
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client, collection, sort) {
  const db = client.db("events");
  const documents = await db.collection(collection).find().sort(sort).toArray();
  return documents;
}
