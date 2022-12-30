const { Router } = require('express')
const cartsRoutes = require('./carts/carts.routes')
const productsRoutes=require('./products/products.routes')
const router=Router()

router.use('/products',productsRoutes)
router.use('/carts',cartsRoutes)

module.exports=router