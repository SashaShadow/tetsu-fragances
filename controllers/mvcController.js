import { loggerError } from "../utils/logger.js";
import { productService } from "./productsController.js";
import { cartService } from "./cartController.js";
import { messageService } from "./messagesController.js";
import { User, msgToModel } from "../dbmodels/dbsConfig.js";
import os from 'os';
import { orderService } from "./orderController.js";
export const numCpus = os.cpus().length

export const home = async (req, res) => {
    const category = req.params.category || undefined;
    const dbQuery = category ? productService.getProductsByCategory(category) : productService.getProducts();

    if (req.user) {
        req.session.user = req.user;
        return dbQuery
      .then(products => {
        res.render("pages/index.ejs", {user: req.user, username: req.user.name, products: JSON.parse(JSON.stringify(products))});
      })
      .catch(err => {
        loggerError.error(err); 
        res.render("pages/error.ejs", {error: err.toString()}); 
      })
    } else {
        res.redirect('/shop/login')
    }
}

export const profile = (req, res) => {
    if (req.user) {
      res.render("pages/profile.ejs", {user: req.user});
    } else {
      res.redirect('/shop/login')
    }
}

export const cart = async (req, res) => {
    if (req.user) {
      const userId = req.params.id;
      return cartService.getOwnCart(userId)
      .then(carts=> {
          res.render("pages/cart.ejs", {user: JSON.stringify(req.user), carts: carts});
      })
      .catch(err => {
        loggerError.error(err);
        res.render("pages/error.ejs", {error: err.toString()}); 
      })
    } else {
      res.redirect('/shop/login')
    }
}

export const orders = async (req, res) => {
  if (req.user) {
    const userId = req.user.id;
    return orderService.getOwnOrders(userId)
    .then(orders => {
      res.render("pages/orders.ejs", {user: JSON.stringify(req.user), orders: orders})
    })
    .catch(err => {
      loggerError.error(err);
      res.render("pages/error.ejs", {error: err.toString()}); 
    })
  } else {
    res.redirect('/shop/login')
  }
}

export const messages = async (req, res) => {
  if (req.user) {
    const alias = req.user.username;
    return messageService.getOwnMsgs(alias)
    .then(msgs => {
      res.render("pages/ownmsgs.ejs", {user: JSON.stringify(req.user), messages: msgs})
    })
    .catch(err => {
      loggerError.error(err);
      res.render("pages/error.ejs", {error: err.toString()}); 
    })
  } else {
    res.redirect('/shop/login')
  }
}

export const chatToAdmin = async (req, res) => {
  if (req.user) {
    const users = req.user.admin ? await User.find({admin: {$ne: true}}) : await User.find({admin: {$eq: true}});
    const msgs = await msgToModel.find({$or: [{author: req.user.username}, {to: req.user.username}]})
    console.log(msgs);
    res.render("pages/msgto.ejs", {user: req.user, users: users, msgs: msgs})
  } else {
    res.redirect('/shop/login')
  }
}

export const info = (req, res) => {
  return res.render('pages/info.ejs', {info: process, cpus: numCpus, port: process.env.PORT})
}