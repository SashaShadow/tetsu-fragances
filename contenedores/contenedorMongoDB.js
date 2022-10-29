
class contenedorMongo {
    constructor(db, model) {
        this.db = db;
        this.model = model;
    }

    async getElems() {
        return this.db
        .then(_ => this.model.find({}))
        .then(data => {
            return data
        })
    }

    async getElem(id) {
        return this.db
        .then(_ => this.model.find({_id: id}))
        .then(data => {
            return data
        })
    }

    async postElem(elem) {
        const elemNuevo = new this.model(elem);
        return this.db
        .then(_ => elemNuevo.save())
        .then(_ => {
            return elemNuevo;
        });
    }

    async putElem(elemId, elemMod) {
        return this.db
        .then(_ => this.model.updateOne({_id: elemId}, {$set: elemMod }))
        .then(_ => {
            return elemMod
        })
    }

    async deleteElem(id) { 
        return this.db
        .then(_ => this.model.findOne({_id: id}))
        .then(elem => {
            return elem.remove()
        })
    }
}

export default contenedorMongo;