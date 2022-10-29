import twilio from 'twilio';
import { createTransport } from 'nodemailer';
import { cartModel} from "../dbmodels/dbsConfig.js";
import { logger, loggerError } from "../utils/logger.js";
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = twilio(accountSid, authToken);
const ADMIN_NUMBER = 'whatsapp:+5491130931945';
const ADMIN_MAIL = process.env.ADMIN_MAIL

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILACC
    }
  });

class OrderService {
    constructor(repository) {
        this.repository = repository;
    }

    async getOrders() {
        return this.repository.getElems()
    }

    async getOwnOrders(userId) {
      return this.repository.getOwnOrders(userId)
    }

    async createOrder(orderData) {
        const prodsHtml = orderData.order.products.map(prod => {
            return (`<li>${prod.name} Precio por unidad: ${prod.price} Cantidad ${prod.quantity} Total: ${prod.quantity * prod.price}</li>`)
          }).join(" ")

        return this.repository.createOrder(orderData)
        .then(async (_) => {
             logger.info('Orden creada');
             const mailOptions = {
                from: 'Tetsu Fragancias Admin',
                to: ADMIN_MAIL,
                subject: `Nuevo pedido de ${orderData.client.name} ${orderData.client.email}`,
                html: `
                <h1>Nuevo pedido</h1>
                <h2>Detalles de la orden y el usuario</h2>
                <h3>Usuario</h3>
                <ul>
                  <li>Nombre de usuario: ${orderData.client.username}</li>
                  <li>Nombre: ${orderData.client.name}</li>
                  <li>Email: ${orderData.client.email}</li>
                  <li>Teléfono: ${orderData.client.phone}</li>
                  <li>Direccion: ${orderData.client.address}</li>
                </ul>
                <h3>Orden de compra ${orderData.order.orderNo}</h3>
                <ul>
                  <h4>Productos:</h4>
                    ${prodsHtml}
                  <h4>Total a pagar: ${orderData.order.total}</h4>
                </ul>
                `
              }

            const mailToUser = {
              from: 'Tetsu Fragancias Admin',
                to: orderData.client.email,
                subject: `Confirmacion de tu pedido, ${orderData.client.name} `,
                html: `
                <h1>Nuevo pedido</h1>
                <h2>Detalles de la orden</h2>
                <ul>
                  <li>Direccion de entrega: ${orderData.client.address}</li>
                </ul>
                <h3>Orden de compra ${orderData.order.orderNo}</h3>
                <ul>
                  <h4>Productos:</h4>
                    ${prodsHtml}
                  <h4>Total a pagar: ${orderData.order.total}</h4>
                </ul>
                `
            }

            try {
              await client.messages.create({
                  body: `Nuevo pedido de ${orderData.client.name} ${orderData.client.email}. Orden de compra ${orderData.order.orderNo}`,
                  from: 'whatsapp:+14155238886',
                  to: `${ADMIN_NUMBER}`,
              }).then(_ => logger.info('Nueva orden de compra'))
            } catch (error) {
              loggerError.error(error)
            }

            // try {
            //   const message = await client.messages.create({
            //       body: `${orderData.client.name}, 
            //        tu orden de compra se ha concretado. Cuando termine de procesarse se te contactará.
            //        El número de orden es ${orderData.order.orderNo}.`,
            //       from: '+15704634279',
            //       to: `+541130931945`, //acá debería ser orderData.client.phone, mis usuarios son de prueba asi que pongo mi numero
            //   }).then(_ => logger.info('Mensaje al cliente enviado'))
            // } catch (error) {
            //   loggerError.error(error)
            // }

            try {
                transporter.sendMail(mailOptions)
                // transporter.sendMail(mailToUser)
            } catch (err) {
                loggerError.error(err)
            }

            return cartModel.deleteOne({owner: orderData.owner})
            .then(_ => {
                logger.info('OK')
            })
            .catch(err => loggerError.error(err));
        })
    }
}

export default OrderService;