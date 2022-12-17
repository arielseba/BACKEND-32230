const express = require('express')
const ProductManager = require('./ProductoManager')

const manager=new ProductManager('products.json')

const server = express()

server.get('/products',async (req, res) => {
    const products = await manager.getProducts()
    if (req.query.limit) {
        const newProducs = products.filter((product,index) => index<req.query.limit)
    return res.status(200).send(newProducs)
    }
    res.status(200).send(products)
})

server.get('/products/:pid', async (req, res) => {
    const products = await manager.getProducts()
    const searchProduct = products.find(product => product.id === Number(req.params.pid))
    if (!searchProduct) {
        return res.status(404).send('No se encontro producto')
    }
    res.status(200).send(searchProduct)
})


server.listen(8080, () => {
    console.log('Server is up and running on port 8080')
})