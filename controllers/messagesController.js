import { logger, loggerError } from "../utils/logger.js";
import MessageRepository from "../repository/messageRepository.js";
import MessageService from "../services/messageService.js";

export const messagesStorage = new MessageRepository();
export const messageService = new MessageService(messagesStorage);

export const getMessages = async (req, res) => {
    return messageService.getMsgs()
    .then(msgs => {
        res.status(200).json(msgs);
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    })
}

export const getOwnMessages = async (req, res) => {
    const alias = req.params.alias;
    return messageService.getOwnMsgs(alias)
    .then(msgs => {
        msgs.length ? res.status(200).json(msgs) : 
        res.status(404).json({mensaje: "No han sido encontrados mensajes para este usuario"});
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    })
}

export const createMessage = async (req, res) => {
    const newMsg = req.body;
    return messageService.createMsgs(newMsg)
    .then(msg => {
        logger.info('Mensaje creado')
        return res.status(201).json({msg})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}