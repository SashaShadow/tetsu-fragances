import { logger, loggerError } from "../utils/logger.js";
import ProductRepository from "../repository/productRepository.js";
import ProductsService from "../services/productsService.js";

export const productsStorage = new ProductRepository();
export const productService = new ProductsService(productsStorage);

export const getProducts = async (req, res) => {
    return productService.getProducts()
    .then(productos => {
        return res.status(200).json({productos})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}

export const getProduct = async (req, res) => {
    const prodId = req.params.id;
    return productService.getProduct(prodId)
    .then(producto => {
        return res.status(200).json({producto})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(404).json({error: 'No se ha encontrado dicho producto'}); 
    });
}

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    return productService.getProductsByCategory(category)
    .then(productos => {
        if (productos.length) {
            return res.status(200).json({productos});
        } else {
            throw new Error;
        }
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(404).json({error: 'No se han encontrado productos con dicha categoria'});
    });
}

export const createProduct = async (req, res) => {
    const newProd = req.body;
    return productService.createProduct(newProd)
    .then(product => {
        logger.info('Producto creado')
        return res.status(201).json({product})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}

export const changeProduct = async (req, res) => {
    const prodMod = req.body;
    const prodId = req.params.id;
    return productService.changeProduct(prodId, prodMod)
    .then(product => {
        logger.info('Producto modificado')
        return res.status(201).json({product})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}

export const deleteProduct = async (req, res) => {
    const prodId = req.params.id;
    return productService.deleteProduct(prodId)
    .then(_ => {
        logger.info('Producto eliminado')
        return res.status(200).json({mensaje: 'Producto eliminado'})
    })
    .catch(err => {
        loggerError.error(err.toString());
        res.status(500).json({error: err.toString()}) 
    });
}