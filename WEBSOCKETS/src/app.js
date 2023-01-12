const express = require('express');
const { Server}=require('socket.io')
const handlebars = require('express-handlebars');
const routes = require('./routes/index.routes');
const PORT = 8080;
const app = express();
const ProductManager = require('./ProductManager')
const manager= new ProductManager('./productos.json')
app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(routes);

const httpServer = app.listen(PORT, () => {
  console.log("Server is up and running on Port => ", PORT);
});

const io = new Server(httpServer) 

io.on('connection', async (socket) => {
  socket.emit('upload-products',await manager.getProducts())

  socket.on('upload-refresh-products', async(data) => {
    await manager.addProduct(data)
    const products = await manager.getProducts()
    socket.emit('update-products',products)
  })

  socket.on('delete-product',async (id) => {
    await manager.deleteProduct(id)
    const products = await manager.getProducts()
    socket.emit('update-delete-products',products)
  })
})
 





