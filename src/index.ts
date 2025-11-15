import express from "express";
import denotev from "dotenv"
import { connectMongoDB } from "../src/config/db"
import routerComic from "../src/routers/comic"
import routerAuth from "../src/routers/auth";
import cors from "cors"

denotev.config();

connectMongoDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/auth", routerAuth);
app.use("/comics", routerComic);

app.use((req ,res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(3000, () =>
    console.log("Servidor en http://localhost:3000"));