
class CartService {
    constructor(repository) {
        this.repository = repository;
    }

    async getCarts() {
        return this.repository.getElems();
    }

    async getCartProducts(id) {
        return this.repository.getCartProds(id);
    }

    async getOwnCart(id) {
        return this.repository.getCart(id);
    }

    async newCart(cart) {
        return this.repository.postElem(cart);
    }

    async addToCart(product, ownerId) {
        return this.repository.addToCart(product, ownerId);
    }

    async deleteCart(id) {
        return this.repository.deleteElem(id);
    }

    async deleteProd(id, id_prod) {
        return this.repository.deleteCartProd(id, id_prod);
    }
}

export default CartService;