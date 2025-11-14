import { Db, MongoClient } from "mongodb";

let mongoCLient: MongoClient;
let db: Db;
const dbname = "Practica_3";

export const connectMongoDB = async (): Promise<void> => {
    try {
        const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5scmzzh.mongodb.net/?appName=Cluster0`;
        mongoCLient = new MongoClient(url);
        await mongoCLient.connect();
        db = mongoCLient.db(dbname);
        console.log("Te has conectado a la BBDD" + dbname);

    } catch (error) {
        console.log("No se ha podio conectar a la BBDD");
        process.exit(1);
    }
}

export const getDb = (): Db => db;