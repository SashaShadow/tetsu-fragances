import { logger, loggerWarn, loggerError } from "../utils/logger.js";
import twilio from 'twilio';
import passport from 'passport';
import minimist from "minimist";
import "dotenv/config.js";

const options = {
    alias: {
      t: 'TEST'
    }
  }  

const myArgs = minimist(process.argv.slice(2), options)
const TEST = myArgs.TEST || process.env.TEST || undefined;
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const client = twilio(accountSid, authToken)

const mockMiddleware = () => {
    return (req, res, next) => {
        next();
    }
}

export const jwt = TEST !== 'si' ? passport.authenticate('jwt', {session: false}) : mockMiddleware();

export const validateNumber = () => {
    return (req, res, next) => {
    console.log({user: req.body});
      const newPhone = req.body.phone;
      let phoneError = true;
  
     client.lookups.v1.phoneNumbers(newPhone)
      .fetch({type: ['carrier']})
      .then(_ => {
        phoneError = false;
        req.session.phoneError = '';
      })
      .catch(err => loggerError.error(err))
      .finally(_ => {
          if (phoneError) {
            req.session.phoneError = 'Numero invalido'
          } 
          next()
        })
     }
  }

export const validatePost = () => {
    return (req, res, next) => {
        const productoNuevo = req.body;
        if (productoNuevo.name && productoNuevo.price && productoNuevo.photo && 
            productoNuevo.desc && productoNuevo.code && productoNuevo.stock && productoNuevo.category &&
            Object.keys(productoNuevo).length === 7) {
                next();
        } else {
            return res.status(400).send({ error: "parametros incorrectos" });
        }
    }
}

export const validatePut = () => {
    return (req, res, next) => {
        const prodMod = req.body;
        const format = prodMod.name && prodMod.price && prodMod.photo && 
        prodMod.desc && prodMod.code && prodMod.stock && prodMod.category &&
        Object.keys(prodMod).length === 7 ? true : null;

        if (format) {
            next();
        } else {
            res.status(400).json({error: "El formato del producto no es correcto"})
        }
    }
}

export const validateAddToCart = () => {
    return (req, res, next) => {
        const product = req.body;
        if (product.name && product.price && product.photo && 
            product.desc && product.code && product.stock && product.category) {
                next();
        } else {
            return res.status(400).json({error: "parametros incorrectos"})
        }
    }
}

export const validateNewOrder = () => {
    return (req, res, next) => {
        const order = req.body; 
        if (order.client && order.order && order.owner) {
            next();
        } else {
            return res.status(400).json({error: "parametros de orden incorrectos"})
        }
    }
}

export const logger200 = () => {
    return (req, res, next) => {
        logger.info(`ruta ${req.originalUrl} método ${req.method}`);
        next();
    }
}

export const logger404 = () => {
    return (req, res, next) => {
        loggerWarn.warn(`ruta ${req.originalUrl} método ${req.method} no implementada`);
        res.status(404).json({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
      };
}