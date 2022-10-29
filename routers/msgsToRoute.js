import express from "express";
import { getMessages, getOwnMessages, createMessage } from "../controllers/messagesToController.js";
import { jwt } from "../middlewares/middlewares.js";

const { Router } = express;
const messagesToRouter = Router()

export default messagesToRouter;

messagesToRouter.get('/', getMessages);
messagesToRouter.get('/:alias', getOwnMessages);
messagesToRouter.post('/', createMessage);