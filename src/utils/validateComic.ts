import { Comic } from "../types/comic";

export { Comic } from "../types/comic"

const validateCantidadParams = (data: any): string | null => {
    const { title, author, year, userId } = data;
    if (!title || !author || !year || !userId) return "Faltan campos en el body";
    return null;
}

type validateComic = {
    succes: boolean,
    message: string,
}

export const validateComicData = (data: any): validateComic => {
    if (!data) return { succes: false, message: "no hay body" };

    const missing = validateCantidadParams(data);
    if (missing) return { succes: false, message: missing };

    const { title, author, year, publisher, userId } = data;

    //comprobar userID
    if (typeof title !== "string") return { succes: false, message: "El title debe ser un string" };
    if (typeof author !== "string") return { succes: false, message: "El author debe ser un string" };
    if (typeof year !== "number" || year < 1990) return { succes: false, message: "year debe ser un número positivo" }
    if (publisher && typeof publisher !== "string") return {succes: false, message:"publisher debe ser un string"};

    return {succes: true, message: "Body Correcto"};
}
