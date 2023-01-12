const {Router} = require('express');
const ProductManager = require('../ProductManager')
const manager= new ProductManager('./productos.json')

const router = Router();

router.get('/', async (req, res) => {
	const products = await manager.getProducts()
	res.render('home', { products: products })
})

router.get('/realtimeproducts', async (req, res) => {
	 const products = await manager.getProducts()
	res.render('realTimeProducts', { products: products })
});

module.exports = router