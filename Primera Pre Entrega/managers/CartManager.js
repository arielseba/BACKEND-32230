const fs = require('fs/promises')
const { existsSync } = require('fs');
const ProductManager = require('./ProductManager')

const managerProduct= new ProductManager('./data/products.json')
class CartManager {
    constructor(path){
        this.path = path
    }

    async addCart() {
        try {
            const addNewCart = await this.getCarts()
            const newId = addNewCart.length > 0 ? addNewCart[addNewCart.length - 1].id + 1 : 1
            const newCart = {
                id: newId, 
                product:[]
            }
            addNewCart.push(newCart)
            const productListString = JSON.stringify(addNewCart, null, '\t')
            await fs.writeFile(this.path, productListString)
        }
        catch(error){
            console.log(error.message)
        }
    }
    
    async getCarts() {
        try{
            if (existsSync(this.path)){
                const listCarts = await fs.readFile(this.path, 'utf-8')
                if(listCarts.length > 0){
                    return JSON.parse(listCarts)
                }
                else return []
            }
            else return []
        }
        catch(error){
            console.log(error.message)
        }
    }

    async getCartById(id) {
        try{
            const listCarts = await this.getCarts();
            const isExistCart = listCarts.find(cart => cart.id === Number(id))

            return isExistCart
        }
        catch(error){
            console.log(error.message)
        }
    }



async addProductToCart(cid, pid, quantity) {
    try {
            const cartExist = await this.getCartById(cid)
            const listCarts=await this.getCarts()
           cartExist.product.push({ product: pid, quantity: quantity ?? 1 })
            const updatedList = listCarts.map(cart => {
                console.log(cart)
                    if(cart.id === Number(cid)){
                        return cartExist
                    }else{
                        return cart
                    }
                })

            const cartListString = JSON.stringify(updatedList, null, '\t')
                await fs.writeFile(this.path, cartListString)
                return 'Producto agregado exitosamente'
        }
        catch (error) {
            return error.message
        }
    }
}
module.exports=CartManager