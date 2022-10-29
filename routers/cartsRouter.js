import express from "express";
import { getCarts, getCartProducts, newCart, addToCart, deleteCart, deleteProdCart } from "../controllers/cartController.js";
import { validateAddToCart, jwt } from "../middlewares/middlewares.js";

const { Router } = express;
const cartRouter = Router()

export default cartRouter;

cartRouter.get('', jwt, getCarts);
cartRouter.get('/:id/products', jwt, getCartProducts);
cartRouter.post('', jwt, newCart);
cartRouter.post('/:id/products', validateAddToCart(), addToCart);
cartRouter.delete('/:id', jwt, deleteCart);
cartRouter.delete('/:id/products/:id_prod', deleteProdCart);