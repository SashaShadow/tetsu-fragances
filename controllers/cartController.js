import { logger, loggerError } from "../utils/logger.js";
import CartService from "../services/cartService.js";
import DAOFactory from "../factory/DAOfactory.js";
const myDAO = new DAOFactory();
export const cartStorage = myDAO.getCartDAO();
export const cartService = new CartService(cartStorage);

export const getCarts = async (req, res) => {
        return cartService.getCarts()
        .then(carritos => {
            return res.status(200).json({carritos})
        })
        .catch(err => {
            loggerError.error(err.toString());
            res.status(500).json({error: err.toString()}) 
        })
    }

export const getCartProducts = async (req, res) => {
        const cartId = req.params.id;
        return cartService.getCartProducts(cartId)
        .then(data => {
            return res.status(200).json({Productos: [data.products]})
        })
        .catch(err => {
            loggerError.error(err.toString());
            res.status(500).json({error: err.toString()}) 
        })
    }

export const newCart = async (req, res) => {
        const cart = req.body;
        return cartService.postElem(cart)
        .then(_ => {
            logger.info('carrito guardado')
        })
        .catch(err => {
            loggerError.error(`Error: ${err.message}`)
            res.status(500).json({error: err.toString()})
        })
    }

export const addToCart = async (req, res) => {
        const product = req.body;
        const ownerId = req.params.id;

        console.log(product);
        return cartService.addToCart(product, ownerId)
        .then(_ => {
            logger.info('Producto agregado al carrito')
            res.redirect(`/mycart/${req.user._id}`)
        })
        .catch(err => {
            loggerError.error(err.toString());
            res.status(500).json({error: err.toString()}) 
        })    
    }

export const deleteCart = async (req, res) => {
        const cartId = req.params.id;
        return cartService.deleteElem(cartId)
        .then(_ => logger.info('Carrito eliminado'))
        .catch(err => {
            loggerError.error(err.toString());
            res.status(500).json({error: err.toString()}) 
        })    
    }

export const deleteProdCart = async (req, res) => {
        const {id, id_prod} = req.params;
        return cartService.deleteProd(id, id_prod)
        .then(_ => {
            logger.info('Producto eliminado del carrito')
            res.redirect(`/mycart/${req.user._id}`)
        })
        .catch(err => {
            loggerError.error("No se encontró el producto con dicha id", err);
            res.status(500).json({error: err.toString()}) 
        });
    }
