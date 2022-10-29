import minimist from "minimist";
import ProductsDAOMongoDB from "../daos/productsDAOMongoDB.js";
import ProductsTestDAOMongoDB from "../daos/productsTestDAOMongoDB.js";
import cartsDAOMongoDB from "../daos/cartsDAOMongoDB.js";
import OrderDAOMongoDB from "../daos/orderDAOMongoDB.js"
import MessageDAOMongoDB from "../daos/messagesDAOMongoDB.js";
import MessageToDAOMongoDB from "../daos/messageToDAOMongoDB.js";
import "dotenv/config.js";

const options = {
    alias: {
      t: 'TEST'
    }
  }

const myArgs = minimist(process.argv.slice(2), options)

let prodInstance = null;
let msgInstance = null;
let orderInstance = null;
let cartInstance = null;
let msgToInstance = null;

class DAOFactory {
    constructor() {
        this.db = myArgs.TEST || process.env.TEST || 'si';
    }

    getProdDAO() {
        if (!prodInstance) {
            if (this.db === 'no') {
                prodInstance = new ProductsDAOMongoDB();
            } else if (this.db === 'si') {
                prodInstance = new ProductsTestDAOMongoDB();
            }
        }
        return prodInstance
    }

    getCartDAO() {
        if (!cartInstance) {
            if (this.db === 'no') {
                cartInstance = new cartsDAOMongoDB();
            } else {
                cartInstance = new cartsDAOMongoDB(); //simbólico, ya que solo hay tests de productos
            }
        }
        return cartInstance;
    }

    getMsgDAO() {
        if (!msgInstance) {
            if (this.db === 'no') {
                msgInstance = new MessageDAOMongoDB();
            } else {
                msgInstance = new MessageDAOMongoDB(); //simbólico, ya que solo hay tests de productos
            }
        } 
        return msgInstance;
    }

    getMsgToDAO() {
        if (!msgToInstance) {
            if (this.db === 'no') {
                msgToInstance = new MessageToDAOMongoDB();
            } else {
                msgInstance = new MessageToDAOMongoDB(); //simbólico, ya que solo hay tests de productos
            }
        } 
        return msgToInstance;
    }

    getOrderDAO() {
        if (!orderInstance) {
            if (this.db === 'no') {
                orderInstance = new OrderDAOMongoDB();
            } else {
                orderInstance = new OrderDAOMongoDB(); //simbólico, ya que solo hay tests de productos
            }
        }
        return orderInstance  
    }

}

export default DAOFactory;