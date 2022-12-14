const fs = require('fs/promises')
const { existsSync } = require('fs');

class ProductManager {
    constructor(path){
        this.path = path
    }

    async addProduct(product) {
        try {
            const addNewProduct = await this.getProducts()
            const isExistProduct = addNewProduct.find(item => item.code == product.code)
            if (isExistProduct){
                throw new Error(`ERROR: No se pudo añadir. El siguiente código ya se encuentra registrado: ${product.code}`)
            }
            if (Object.keys(product).length < 6) {
                throw new Error(`ERROR: No se pudo añadir. Deben incluirse todos los campos`)
            }
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
            if(!isExistProduct){
                throw new Error('ERROR: ningún producto coincide con la id especificada')
            }
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
            const targetProduct =await this.getProductById(id)
             if(!targetProduct){
                throw new Error('ERROR: No se encuentra la id especificada')
             }
             else {
                const savedProducts = await this.getProducts();
                const filteredList = savedProducts.filter(prod => prod.id !== id)
                const productListString = JSON.stringify(filteredList, null, '\t')
                await fs.writeFile(this.path, productListString)
            }
        }
        catch(error){
            console.log(error.message)
        }
    }
}


const testing = new ProductManager('./products.json')
// Se agrega producto
testing.addProduct({ title: 'titulo', description: 'descripcion', price: 22, thumbnail: '', code: 22, stock: 5 })
// Se agrega producto con codigo repetido repetido
testing.addProduct({ title: 'titulo', description: 'descripcion', price: 22, thumbnail: '', code: 33, stock: 5 })
// Se busca todos los productos
testing.getProducts()
// Se busca producto por id
testing.getProductById(1)
// Se modifica producto
testing.updateProduct(2, { title: 'nuevo' })
// Se elimina producto por id
testing.deleteProduct(1)

