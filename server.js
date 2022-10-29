import express from "express";
import session from 'express-session';
const { Router } = express;
import { logger200, logger404, validateNumber, jwt } from "./middlewares/middlewares.js";
import { logger, loggerError } from "./utils/logger.js";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import productsRouter from "./routers/productsRouter.js";
import cartRouter from "./routers/cartsRouter.js";
import orderRouter from "./routers/orderRouter.js";
import messagesRouter from "./routers/msgsRoute.js";
import messagesToRouter from "./routers/msgsToRoute.js";
import authRouter from "./auth/jwtRoutes.js";
import { jwtLogic } from "./auth/jwtAuth.js";
import { cart, home, profile, info, numCpus, orders, messages, chatToAdmin } from "./controllers/mvcController.js";
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cluster from 'cluster';
import cors from 'cors';
import passport from 'passport';
import { login, signup, serialize, deSerialize } from './auth/sessionAuth.js';
import { loginRoute, loginPost, signupRoute, signupPost, logout } from './auth/sessionRoutes.js';
import { ioSockets } from './sockets/sockets.js';
import minimist from "minimist";
import "dotenv/config.js";

const options = {
  alias: {
    p: 'PORT',
    m: 'MODO',
    t: 'TEST'
  }
}

const myArgs = minimist(process.argv.slice(2), options)

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const router = Router();

const PORT = process.env.PORT || myArgs.PORT || 8080;

const serverUp = () => {
  const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
  })
  server.on("error", error => loggerError.error(`Error en servidor ${error}`));
}

if (myArgs.MODO === 'cluster') {
  if (cluster.isPrimary) {
    logger.info(`El master con pid numero ${process.pid} esta funcionando`);

    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`el worker ${worker.process.pid} murió`)
    });

  } else {
    serverUp();
  }
} else if (myArgs.MODO === 'fork' || !myArgs.MODO) {
  serverUp();
} 

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(compression()); 
app.use("/shop/", express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB,
    mongoOptions: advancedOptions,
    ttl: process.env.EXPTIME
  }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//PASSPORT STRATEGIES
login();
signup();
serialize();
deSerialize();
jwtLogic();

//SOCKETS
ioSockets(io);

//HOME, PROFILE AND CART (EJS RENDERS)
router.get("/", home);
router.get("/products/:category?", home);
router.get("/profile", profile);
router.get("/orders", orders);
router.get("/messages", messages);
router.get("/mp", chatToAdmin);
router.get('/mycart/:id', cart);
router.get('/info', info);

// RUTAS AUTH
router.get('/login', loginRoute())
router.post('/login', loginPost())
router.get('/signup', signupRoute())
router.post('/signup', validateNumber(), signupPost())
router.get('/logout', logout())

app.use('/shop', logger200(), router);
app.use('/api', authRouter);
app.use('/api/products', jwt, logger200(), productsRouter); 
app.use('/api/cart', cartRouter); 
app.use('/api/orders', orderRouter);
app.use('/api/mensajes', messagesRouter);
app.use('/api/msgsto', messagesToRouter);
app.use(logger404());
