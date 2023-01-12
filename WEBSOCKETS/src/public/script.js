const socket = io() 

const submitData = document.getElementById('button-submit')
const title = document.getElementById('input-title')
const description = document.getElementById('input-description')
const price = document.getElementById('input-price')
const code=document.getElementById('input-code')
const stock = document.getElementById('input-stock')
const containerTable = document.getElementById('container-table')

submitData.addEventListener('click', (event) => {
    const obj = {
        title:title?.value,
        description:description.value,
        price:price.value,
        code: code.value,
        stock:stock.value
    }
        title.value=''
        description.value=''
        price.value=''
        code.value=''
        stock.value=''
         socket.emit('upload-refresh-products', obj)

    socket.on('update-products', (data) => {
        containerTable.innerHTML =''
           uploadData(data)
    
    })
})

 socket.on('upload-products', (data) => {
        const containerTable = document.getElementById('container-table')
        containerTable.innerHTML =''
        uploadData(data)
})

function uploadData(data) {
    data.forEach(p => {
            containerTable.innerHTML += `
            <tr>
                <td>${p.title}</td>
                <td>${p.description}</td>
                <td>${p.price}</td>
                <td>${p.code}</td>
                <td>${p.stock}</td>
                <td onClick={deleteItem(${p.id})} class="delete">Eliminar</td>
            </tr>`
        })
}

function deleteItem(id) {
    socket.emit('delete-product', id)
       socket.on('update-delete-products', (data) => {
        containerTable.innerHTML =''
           uploadData(data)
    })
  }