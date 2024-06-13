import Config from "../config.js";

export const ApiComunicator = async (ruta, options) => {
    try {
        let url = Config.endpoint + ruta;
        const res = await fetch(url, options)
        return res;
    }
    catch (e) { throw e }
};
