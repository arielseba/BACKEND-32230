const fs = require('fs/promises')
const { existsSync } = require('fs');

class ProductManager {
    constructor(path){
        this.path = path
    }

    async addProduct(product) {
        try {
            const addNewProduct = await this.getProducts()
            const newId = addNewProduct.length > 0 ? addNewProduct[addNewProduct.length -1 ].id + 1 : 1
            const newProduct = {
                id: newId, 
                ...product
            }
            addNewProduct.push(newProduct)
            const productListString = JSON.stringify(addNewProduct, null, '\t')
            await fs.writeFile(this.path, productListString)
        }
        catch(error){
            console.log(error.message)
        }
    }
    
    async getProducts() {
        try{
            if (existsSync(this.path)){
                const listProducts = await fs.readFile(this.path, 'utf-8')
                if(listProducts.length > 0){
                    return JSON.parse(listProducts)
                }
                else return []
            }
            else return []
        }
        catch(error){
            console.log(error.message)
        }
    }

    async getProductById(id) {
        try{
            const listProducts = await this.getProducts();
            const isExistProduct = listProducts.find(prod => prod.id === id)
            return isExistProduct
        }
        catch(error){
            console.log(error.message)
        }
    }

    async updateProduct(id, product) {
        try{
            const listProducts = await this.getProducts()
            const productUpdate = await this.getProductById(id)
            if(productUpdate){
                const updatedProduct = {...productUpdate, ...product}
                const updatedList = listProducts.map(prod =>{
                    if(prod.id === id){
                        return updatedProduct
                    }else{
                        return prod
                    }
                })
                const productListString = JSON.stringify(updatedList, null, '\t')
                await fs.writeFile(this.path, productListString)
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    async deleteProduct(id) {
        try {
                const savedProducts = await this.getProducts();
                const filteredList = savedProducts.filter(prod => prod.id !== id)
                const productListString = JSON.stringify(filteredList, null, '\t')
                await fs.writeFile(this.path, productListString)
        }
        catch(error){
            console.log(error.message)
        }
    }
}
module.exports=ProductManager