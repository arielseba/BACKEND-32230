const {Router}=require('express')
const CartManager = require('../../managers/CartManager')

const managerCart= new CartManager('./data/carrito.json')
const router = Router()

router.post('/', (req, res) => {
        managerCart.addCart()
        res.status(200).send({
            data: 'success',
            message:'Carrito agregado correctamente'
        })
})

router.get('/:cid', async (req, res) => {
    const carts = await managerCart.getCartById(req.params.cid)
    if (carts) {
        res.status(200).send({
            status:'success',
            data:carts
        })
    } else {
        res.status(400).send({
            status:'error',
            error: 'No se encontro el id ingresado'
        })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
      let cid = +req.params.cid
    let pid = +req.params.pid
    let quantity = req.query.q
    !quantity ? quantity = 1 : quantity = quantity
    const cartExist = await managerCart.getCartById(cid)
         const productExist = cartExist.product.find(product => product.product === Number(pid))

    if (cartExist && !productExist) {
        managerCart.addProductToCart(cid,pid,quantity)
        res.status(200).send({status:'success',message:"Se agrego el producto de forma correcta"})

    } else {
         res.status(400).send({
            status:'error',
            error: 'Verificar que el carrito exita y que el producto ya no haya sido ingresado'
        })
    }
           
})

//export
module.exports=router