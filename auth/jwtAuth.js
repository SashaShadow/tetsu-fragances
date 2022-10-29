import jwt from "jsonwebtoken";
import twilio from 'twilio';
import passport from "passport";
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { User, cartModel } from '../dbmodels/dbsConfig.js';
import { createHash, isValidPassword } from '../utils/crypt.js';
import { createTransport } from 'nodemailer';
import { loggerError } from "../utils/logger.js";
import "dotenv/config.js";

const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_MAIL = process.env.ADMIN_MAIL; 
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

const client = twilio(accountSid, authToken) 

const generateToken = user => {
    const token = jwt.sign({data: user}, SECRET_KEY, {expiresIn: '24h'});
    return token
}

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILACC
    }
});
  
export const register = async (req, res) => {

    let { username, password, phone, email } = req.body;
    const userExists = await User.findOne({username: username})
    const emailExists = await User.findOne({email});
    const phoneExists = await User.findOne({phone});

    const admin = req.body.admin || undefined;

    if (admin) {
        req.body.admin = undefined;
    }

    if (userExists) {
        return res.json({ error: 'El nombre de usuario ya esta en uso' })
    }
    if (emailExists) {
        return res.json({ error: 'El email ya esta usado por otra cuenta' })
    }
    if (phoneExists) {
        return res.json({ error: 'El telefono ya esta usado por otra cuenta' })
    }

    client.lookups.v1.phoneNumbers(phone)
      .fetch({type: ['carrier']})
      .then(_ => {
        phoneError = false;
      })
      .catch(err => loggerError.error(err))
      .finally(_ => {
          if (phoneError) {
            return res.status(400).json({ error: 'Formato de telefono inválido'})
          } 
        })
    
    const hashedPassword = createHash(password);
    req.body.password = hashedPassword;
    const user = { email: email, password: hashedPassword };

    const newUser = new User(req.body)
    const newCart = new cartModel();
    newUser.cart = newCart;
    newUser.save();

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
    
    const access_token = `Bearer ${generateToken(user)}`;
    return res.json({ user, access_token })
}

export const login = async (req, res) => {
    
    const { email, password } = req.body;

    const authUser = await User.findOne({email: email})

    if (!authUser) {
        return res.status(404).json({error: 'Usuario inexistente'})
    } 

    const passwordIsOk = isValidPassword(authUser.password, password);

    if (!passwordIsOk) {
        return res.status(400).json({ error: 'Contraseña incorrecta'})
    } else {
        const access_token = `Bearer ${generateToken(authUser)}`;
        res.json({ authUser, access_token })
    }
}

export const jwtLogic = () => {
    return passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}
