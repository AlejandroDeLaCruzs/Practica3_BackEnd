import { Router } from "express";
import { User } from "../types/user";
import { getDb } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/JwtPayload"
import dotenv from "dotenv";


const router = Router();

const coleccion = () => getDb().collection<User>("Users");

dotenv.config();
const SECRET = process.env.SECRET;

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body as User;

        const userRegistrado = await coleccion().findOne({ email });
        if (userRegistrado) return res.send(400).send({ message: "Usuario ya registrado" });

        const passwordEncriptada = await bcrypt.hash(password, 10);

        await coleccion().insertOne({ email, password: passwordEncriptada });

        res.status(201).send({ message: "Usuario creado con éxito" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body as User;

        const user = await coleccion().findOne({ email });
        if (!user) return res.status(400).send({ message: "Usuario no registrado" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(404).send({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id?.toString(), email: user.email } as JwtPayload, SECRET as string, {
            expiresIn: "1h"
        });

        res.status(200).json({ message: "Login correcto", token })
    } catch (error) {
        res.status(500).json({ message: error })
    }

})




