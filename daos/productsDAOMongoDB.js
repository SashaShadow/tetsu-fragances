import contenedorMongoDB from "../contenedores/contenedorMongoDB.js";
import { db, productsModel} from "../dbmodels/dbsConfig.js";

class ProductsDAOMongoDB extends contenedorMongoDB {
    constructor() {
      super(db, productsModel)
    }

    getProductsByCategory(category) {
      return this.db
      .then(_ => this.model.find({category}))
      .then(products => {
        return products;
      })
    }
  }

export default ProductsDAOMongoDB;