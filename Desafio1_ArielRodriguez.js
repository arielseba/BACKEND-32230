
class ProductManager {
    constructor() {
        this.products=[]
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {
        let validationCode = this.products.find((element)=>element.code === code)
        if (!validationCode) {
            const obj = {
                id: this.products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
            return this.products.push(obj)
        }
        return console.log(`No se pudo agregar el producto ${title}, ya que el codido se encuentra repetido`)
    }

    getProducts() {
        return console.log( this.products)
    }

    getProductById(id) {
        let searchProductId= this.products.find(element =>  element.id === id )
        return console.log(searchProductId ? searchProductId:'Not Found')
    }
    
}

const ProductManagerFirst = new ProductManager()
ProductManagerFirst.getProducts()
ProductManagerFirst.addProduct('producto prueba', 'Este es un producto de prueba', 200, 'Sin imagen', 'abc123', 25)
ProductManagerFirst.getProducts()
ProductManagerFirst.addProduct('producto prueba', 'Este es un producto de prueba', 200, 'Sin imagen', 'abc123', 25)
ProductManagerFirst.getProductById(2)

