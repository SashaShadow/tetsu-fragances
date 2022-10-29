import { logger, loggerError } from "../utils/logger.js";
import MessageToRepository from "../repository/messageToRepository.js";
import MessageToService from "../services/messageToService.js";

export const messageToStorage = new MessageToRepository();
export const messageToService = new MessageToService(messageToStorage);

export const getMessages = async (req, res) => {
    return messageToService.getMsgs()
    .then(msgs => {
        if (!msgs.length) {
            return res.status(404).json({mensaje: "No hay mensajes todavia"})
        }
        res.status(200).json(msgs);
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    })
}

export const getOwnMessages = async (req, res) => {
    const alias = req.params.alias;
    return messageToService.getOwnMsgs(alias)
    .then(msgs => {
        msgs.length ? res.status(200).json(msgs) : 
        res.status(404).json({mensaje: "No han sido encontrados mensajes relacionados a este usuario"});
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    })
}

const getConversation = async (req, res) => {
    const username = req.user.username;
    const toWho = req.params.to;
    return //armar servicio que filtre por dos posibles condiciones: username es el propio o el del admin, toWho es el propio usuario o el del admin.
    //luego ordenar por fecha para renderizar en correcto orden.
}

export const createMessage = async (req, res) => {
    const newMsg = req.body;
    return messageToService.createMsgs(newMsg)
    .then(msg => {
        logger.info('Mensaje creado')
        return res.status(201).json({msg})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}