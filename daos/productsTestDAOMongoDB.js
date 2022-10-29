import contenedorMongoDB from "../contenedores/contenedorMongoDB.js";
import { db, productsTestModel} from "../dbmodels/dbsConfig.js";

class ProductsTestDAOMongoDB extends contenedorMongoDB {
    constructor() {
      super(db, productsTestModel)
    }

    getProductsByCategory(category) {
      return this.db
      .then(_ => this.model.find({category}))
      .then(products => {
        return products;
      })
    }
  }

export default ProductsTestDAOMongoDB;