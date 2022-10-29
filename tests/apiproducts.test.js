import request from 'supertest';
import "dotenv/config.js";
const myReq = request(`http://localhost:${process.env.PORT}`);
import { expect } from 'chai';

//ASEGURARSE ANTES DE INICIAR LOS TESTS DE INICIAR EL SERVER CON EL COMANDO --t si (-TEST si) PARA UTILIZAR EL DAO PARA TESTING.
//LA COLECCIÓN TEST ESTÁ VACIA AL INICIO Y SOLO SE MANEJA UN PRODUCTO QUE SE AGREGA Y ELIMINA CON LOS MISMOS TESTS.

describe('Tests a los metodos CRUD de los productos', function() {

    it('should list all products (GET /api/products)', async function() {
        let response = await myReq.get('/api/products')
        expect(response.status).to.eql(200);
        expect(response.body.productos.length).to.eql(0);
    })

    it('should add a product (POST /api/products)', async function() {
        const product = {
            name: "prueba",
            price: 1,
            stock: 5,
            photo: "no hay",
            code: "prb1",
            desc: "producto de prueba",
            category: "man"
        }

        let response = await myReq.post('/api/products').send(product);
        expect(response.status).to.be.equal(201);

        const newProduct = response.body.product;
        expect(newProduct).to.include.keys('name', 'price', 'stock', 'photo', 'code', 'desc', 'category');
        expect(newProduct.name).to.eql(product.name);
        expect(newProduct.price).to.eql(product.price);
        expect(newProduct.stock).to.eql(product.stock);
        expect(newProduct.photo).to.eql(product.photo);
        expect(newProduct.code).to.eql(product.code);
        expect(newProduct.desc).to.eql(product.desc);

        let allProducts = await myReq.get('/api/products')
        expect(allProducts.body.productos.length).to.eql(1);
    })

    it('should return an status 400 if product format is wrong (POST /api/products)', async () => {
        const product = {
            nombre: "prueba",
            price: 1,
            stock: 5,
            photo: "no hay",
            code: "prb1",
            desc: "producto de prueba",
            category: "man"
        }

        let response = await myReq.post('/api/products').send(product);
        expect(response.status).to.be.equal(400);
    })

    it('shoud list product with given id (GET /api/products/:id)', async function() {
        let allProducts = await myReq.get('/api/products')
        let prodId = allProducts.body.productos[0].id;

        let productResponse = await myReq.get(`/api/products/${prodId}`)
        let product = productResponse.body.producto;
        expect(productResponse.status).to.eql(200);
        expect(product.id).to.eql(prodId);
    })

    it('should return an status 404 if product with given id does not exist (GET /api/products/:id)', async () => {
        let prodId = '6320cdfnoexia86897262ac8'

        let productResponse = await myReq.get(`/api/products/${prodId}`)
        expect(productResponse.status).to.eql(404);
    })

    it('should update product with given id (PUT /api/products/:id)', async function() {
        let allProducts = await myReq.get('/api/products')
        let prodId = allProducts.body.productos[0].id;

        const updatedProduct = {
            name: "prueba2",
            price: 1,
            stock: 5,
            photo: "no hay",
            code: "prb1",
            desc: "producto de prueba",
            category: "man"
        }

        let response = await myReq.put(`/api/products/${prodId}`).send(updatedProduct);
        expect(response.status).to.eql(201);
        expect(response.body.product).to.eql(updatedProduct);
    })

    it('should delete product with given id (DELETE /api/products/:id)', async function() {
        let allProducts = await myReq.get('/api/products');
        let prodId = allProducts.body.productos[0].id;

        let response = await myReq.delete(`/api/products/${prodId}`);
        allProducts = await myReq.get('/api/products');

        expect(response.status).to.eql(200); 
        expect(allProducts.body.productos.length).to.eql(0);
    })

    before(function() {
        console.log('\n ------------------------COMIENZO TOTAL DEL TEST----------------------------')
    })

    after(function() {
        console.log('\n ------------------------FIN TOTAL DEL TEST----------------------------')
    }) 
})