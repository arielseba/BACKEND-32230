
const { Router } = require('express')
const multer = require("multer");
const ProductManager = require('../../managers/ProductManager')
const manager= new ProductManager('./data/productos.json')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
const router = Router()

router.get('/', async (req, res) => {
    const products = await manager.getProducts()
    if (req.query.limit) {
    const newProducs = products.filter((product,index) => index<req.query.limit)
    return res.status(200).send(newProducs)
    }
    res.status(200).send(products)
})

router.get('/:pid', async (req, res) => {
    const products = await manager.getProducts()
    const searchProduct = products.find(product => product.id === Number(req.params.pid))
    if (!searchProduct) return res.status(404).send({
        status:'error',
        error:'No se encontro producto'})
    res.status(200).send({
        status:'success',
        data:searchProduct
    })
})

router.post('/', upload.single('file'), async(req, res) => {
    let product = req.body
    const addNewProduct = await manager.getProducts() ??[]
    const isExistProduct = addNewProduct.find(item => item.code == product.code)
    if (product?.title && product?.description && product.price && product.code && product.stock && !isExistProduct) {
        const obj = {
            title: product?.title,
            description: product?.description,
            thumbnail: req.file?.path ?? 'Sin imagen',
            price: product?.price,
            code: product?.code,
            stock: product?.stock,
            status: product?.status ?? true
        }
    
        manager.addProduct(obj)
        res.status(200).send({
            status: 'success',
            message: 'Producto agregado correctamente'
        })
    } else {
        res.status(400).send({
            status: 'error',
            error:'Revisar que esten los datos completos del producto y que el codigo del producto no este repetido'
        })
    }
})

router.put('/:pid',async (req, res) => {
    const id = Number(req.params.pid)
    const product = req.body
    const productUpdate = await manager.getProductById(id)
  
    if ((product?.title || product?.description || product.thumbnail || product.price || product.code || product.stock) && productUpdate) {
        manager.updateProduct(id, product)
        res.status(200).send({
            data: 'success',
            message: 'Producto actualizado correctamente'
        })
    } else {
           res.status(400).send({
            data: 'error',
            message: 'Revisar campos invalidos o que el producto ya exista en la base de datos'
        })
    }
})


router.delete('/:pid', async(req, res) => {
    const id = Number(req.params.pid)
    const targetProduct =await manager.getProductById(id)
    if (targetProduct) {
        manager.deleteProduct(id)
        res.status(200).send({
            data: 'success',
            message: 'Producto eliminado correctamente'
        })
    } else {
         res.status(400).send({
            data: 'error',
            message: 'No se encontro el id que se intenta eliminar'
        })
    }
})

//export
module.exports=router