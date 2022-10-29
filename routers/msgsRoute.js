import express from "express";
import { getMessages, getOwnMessages, createMessage } from "../controllers/messagesController.js";
import { jwt } from "../middlewares/middlewares.js";

const { Router } = express;
const messagesRouter = Router()

export default messagesRouter;

messagesRouter.get('/', jwt, getMessages);
messagesRouter.get('/:alias', jwt, getOwnMessages);
messagesRouter.post('/', createMessage);