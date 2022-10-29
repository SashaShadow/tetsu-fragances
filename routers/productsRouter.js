import { validatePost, validatePut } from "../middlewares/middlewares.js";
import { getProducts, getProduct, createProduct, changeProduct, deleteProduct, getProductsByCategory } from "../controllers/productsController.js";
import express from "express";
const { Router } = express;
const productsRouter = Router()

export default productsRouter;

productsRouter.get('', getProducts)
productsRouter.get('/:id', getProduct)
productsRouter.get('/category/:category', getProductsByCategory);
productsRouter.post('', validatePost(), createProduct)
productsRouter.put('/:id', validatePut(), changeProduct)
productsRouter.delete('/:id', deleteProduct)