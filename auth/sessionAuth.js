import passport from 'passport';
import process from 'process';
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from '../utils/crypt.js';
import { User, cartModel } from '../dbmodels/dbsConfig.js';
import { loggerError } from "../utils/logger.js";
import "dotenv/config.js";
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILACC
  }
});

const ADMIN_MAIL = process.env.ADMIN_MAIL;

export const login = () => {
  passport.use('login', new LocalStrategy( 
    {usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
      return User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Usuario inexistente' })
          }
    
          if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: 'Contraseña incorrecta' })
          }
          
          return done(null, user)
        })
        .catch(err => done(err))
    }))
}


export const signup = () => {
    passport.use('signup', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
      }, async (req, email, password, done) => {
        let errMsg = '';
        return User.findOne({$or: [{username: req.body.username}, {email: email}, {phone: req.body.phone}]})
          .then(user => {

            if (user) {
              errMsg = 'El nombre de usuario, email o el numero teléfonico ya se encuentran registrados en otra cuenta'
              return null;
            }

            if (password !== req.body.rpassword) {
              errMsg = 'Las contraseñas deben ser iguales';
              return null;
            }
            
            if (req.session.phoneError) { //ERROR QUE SUCEDE SI EL NÚMERO ESTÁ EN UN FORMATO INVÁLIDO
              errMsg = req.session.phoneError;
              return null;
            }
      
            const newUser = new User()
            const newCart = new cartModel();

            newUser.username = req.body.username
            newUser.password = createHash(password)
            newUser.email = email
            newUser.name = req.body.name
            newUser.address = req.body.address
            newUser.phone = req.body.phone
            newUser.photo = `${req.session.img}`
            newUser.cart = newCart; //SE CREA UN CARRITO VACIO AL CREARSE EL USUARIO.
    
            req.session.user = newUser;

              const mailOptions = {
                from: 'Tetsu Fragancias Admin',
                to: ADMIN_MAIL,
                subject: 'Nuevo usuario registrado',
                html: `
                <h1>Nuevo usuario registrado</h1>
                <h2>Detalles de la cuenta</h2>
                <ul>
                  <li>Nombre de usuario: ${newUser.username}</li>
                  <li>Nombre: ${newUser.name}</li>
                  <li>Email: ${newUser.email}</li>
                  <li>Teléfono: ${newUser.phone}</li>
                </ul>
                `
              }

                try {
                  transporter.sendMail(mailOptions)
                } catch (err) {
                  loggerError.error(err)
                }
      
            return newUser.save();
          })
          .then(user => {
            if (!user && errMsg !== '') {
              return done(null, false, {message: errMsg})
              }
              return done(null, user)
          })
          .catch(err => {
            return done(err)
          })
       }))
}

export const serialize = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
}

export const deSerialize = () => {
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })
}

