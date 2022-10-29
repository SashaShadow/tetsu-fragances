import { loggerError } from "../utils/logger.js";
import OrderService from "../services/orderService.js";
import DAOFactory from "../factory/DAOfactory.js";
const myDAO = new DAOFactory();
export const orderStorage = myDAO.getOrderDAO();
export const orderService = new OrderService(orderStorage);

export const getOrders = async (req, res) => {
    return orderService.getOrders()
    .then(ordenes => {
        return res.status(200).json({ordenes})
    })
    .catch(err => {
        res.status(500).json(err.toString()); 
        loggerError.error(err.toString());
    })
}

export const createOrder = async (req, res) => {
    const orderData = req.body;
    orderData.order.products = JSON.parse(orderData.order.products);

    return orderService.createOrder(orderData)
    .then(() => {
        return res.redirect('/api/')
    })
    .catch(err => {
        res.status(500).json(err.toString()); 
        loggerError.error(err.toString());
    })
}