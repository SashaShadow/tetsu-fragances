import contenedorMongo from "../contenedores/contenedorMongoDB.js";
import { db, msgToModel } from "../dbmodels/dbsConfig.js";

class MessageToDAOMongoDB extends contenedorMongo {
    constructor() {
        super(db, msgToModel);
    }

    async getOwnMsgs(alias) {
        return this.db
        .then(_ => this.model.find({$or: [{author: alias}, {to: alias}]}))
        .then(msgs => {
            return msgs;
        })
    }
} 

export default MessageToDAOMongoDB;
