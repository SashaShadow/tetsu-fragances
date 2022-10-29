import contenedorMongo from "../contenedores/contenedorMongoDB.js";
import { db, msgsModel } from "../dbmodels/dbsConfig.js";

class MessageDAOMongoDB extends contenedorMongo {
    constructor() {
        super(db, msgsModel);
    }

    async getOwnMsgs(alias) {
        return this.db
        .then(_ => this.model.find({'author.alias': alias}))
        .then(msgs => {
            return msgs;
        })
    }
} 

export default MessageDAOMongoDB;
