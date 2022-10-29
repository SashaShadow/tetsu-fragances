class ProductsService {
    constructor(repository) {
        this.repository = repository;
    }

    async getProducts() {
        return this.repository.getProducts();
    }

    async getProduct(id) {
        return this.repository.getProduct(id);
    }

    async getProductsByCategory(category) {
        return this.repository.getProductsByCategory(category);
    }

    async createProduct(product) {
        return this.repository.createProduct(product);
    }

    async changeProduct(prodId, prodMod) {
        return this.repository.updateProduct(prodId, prodMod);
    }

    async deleteProduct(prodId) {
        return this.repository.deleteProduct(prodId);
    }
}

export default ProductsService;