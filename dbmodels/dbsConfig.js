import mongoose from "mongoose";
import "dotenv/config.js";

//MONGODB CONFIG

const dbUri = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined ? 
process.env.MONGODB : process.env.NODE_ENV === 'development' ? process.env.MONGODBDES : null;

export const db = mongoose.connect(dbUri, 
{ useNewUrlParser: true })

const chatSchema = new mongoose.Schema({
    author: {type: Object, required: true},
    text: {type: String, required: true},
    time: {type: String, required: true}
}, {
    versionKey: false 
})

export const msgsModel = mongoose.model("Msgs", chatSchema);

const msgToSchema = new mongoose.Schema({
    author: {type: String, required: true},
    text: {type: String, required: true},
    time: {type: String, required: true},
    to: {type: String, required: true}
}, {
    versionKey: false
})

export const msgToModel = mongoose.model("MsgTo", msgToSchema);

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, max: 25},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    photo: {type: String, required: true},
    code: {type: String, required: true, max: 10},
    desc: {type: String, required: true, max: 100},
    category: {type: String, required: true}
})

export const productsModel = mongoose.model("Products", productSchema);
export const productsTestModel = mongoose.model("ProductsTest", productSchema);

const cartSchema = new mongoose.Schema({
    products: {type: [{
        name: {type: String, required: true, max: 25},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        photo: {type: String, required: true},
        code: {type: String, required: true, max: 10},
        desc: {type: String, required: true, max: 100},
        quantity: {type: Number, required: true}
    }]},
    owner: {type: String, required: true},
}, { timestamps: true })

export const cartModel = mongoose.model("Carts", cartSchema);

const orderSchema = new mongoose.Schema({
    client: {type: {
        username: {type: String, required: true, max: 30},
        email: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: Number, required: true}, 
        address: {type: String, required: true, max: 40},
    }},
    order: {type: {
        products: {type: Array, required: true},
        total: {type: Number, required: true},
        orderNo: {type: String, required: true}
    }},
    owner: {type: String, required: true}
})

export const Order = mongoose.model("Order", orderSchema);

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, max: 30, unique: true},
    password: {type: String, required: true, max: 20},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    address: {type: String, required: true, max: 40},
    phone: {type: Number, required: true, unique: true}, 
    admin: {type: Boolean} //puede estar pero se agrega manualmente, no se puede realizar un registro con este campo
})

export const User = mongoose.model('Users', userSchema);
