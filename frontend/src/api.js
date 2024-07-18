// const API_POS = process.env.REACT_APP_SIVARPOS;
// const API = process.env.REACT_APP_API;
const API_POS = 'http://192.168.1.110:3000/pos';
const API = 'http://192.168.1.110:3000/tasks';

export const validateUser = async(validateValueUser) => {
    /*Validate the user information and if it's correct return the data of the user
    you have to send a json of the form:
    {
        "EmailUser": "Pruebausuario1@gmail.com",
        "Password": "123456789"
    }
    Dikyanid
    06032023
    */
    try {
        const res = await fetch(`${API}/login`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(validateValueUser)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

//*All related to products %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export const NuevoProducto = async(NewproductValues) => {
    /*Create a new product but only for the specified client
    you have to send a json of the form:
    {
        "IdFerreteria": "242",
        "Cod": "bla",
        "Descripcion": "Producto de prueba para el pos",
        "Cantidad": 400,
        "SubCategoria": 1,
        "PCosto": 500,
        "PVenta": 1000,
        "Inventario": 10
        "InvMinimo": 1,
        "InvMaximo": 10,
        "Ubicacion": "A1",
        "Detalle": "Es una prueba de ingreso de nuevo producto al inventario",
        "Clase": false,
        "Iva": 19,
        "Fecha": "2024-04-07 11:49:35",
        "CodResponsable": "242",
        "Responsable": "Ferreteria de prueba",
        "Motivo": "Nuevo producto al inventario"
    }
    */   
    try {
        const res = await fetch(`${API_POS}/newproduct`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(NewproductValues)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const ProductList = async(ProductListValues) => {
    /*Return the list of products adding the products by client
    you have to send a json of the form:
    {
        "IdFerreteria": "242"
    }
    */
    try {
        const res = await fetch(`${API_POS}/productList`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(ProductListValues)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const UpdateProduct = async(updateproduct) => {
    /*Return the list of products adding the products by client
    you have to send a json of the form:
    {
        "IdFerreteria": "242",
        "ConsecutivoProd": 8,
        "Cod": "bla",
        "Descripcion": "Producto de prueba para el pos",
        "Clase": 0,
        "SubCategoria": 1,
        "Detalle": "Producto de prueba para actualizar",
        "Iva": 19,
        "PCosto": 600,
        "PVenta": 1500,
        "Ubicacion": "A2",
        "InvMinimo": 1,
        "InvMaximo": 5,
        "Medida": "Metros",
        "UMedida": 6,
        "PrecioUM": 300
    }
    */
    try {
        const res = await fetch(`${API_POS}/updateproduct`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateproduct)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const Inventory = async(InventoryValues) => {
    /*Return the inventory deppending to the client
    you have to send a json of the form:
    {
        "IdFerreteria": "242"
    }
    */
    try {
        const res = await fetch(`${API_POS}/inventory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(InventoryValues)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}


export const postUpdateInventory = async(postupdateinventory) => {
    /*send the new amount to the server to adjust the inventry
    you have to send a json of the form:
    {
        "IdFerreteria": 242,
        "CodResponsable": "242",
        "Responsable": "Ferreteria marly",
        "ConsecutivoProd": "8",
        "Cantidad": 200,
        "Fecha": "2024-04-07 11:49:35",
        "Motivo": "Ajuste de inventario"
    }
    */
    try {
        const res = await fetch(`${API_POS}/postupdateinventory`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(postupdateinventory)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const SubCategories = async() => {
    /* Return the list of subcategories and categories
    */
    try {
        const res = await fetch(`${API_POS}/subcategories`)
        return await res.json()
    }catch(error) {
        console.log(error)
    }
}

//*All related to clients %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export const Clientlist = async(ClientlistValues) => {
    /*get the list of clientes deppending on the hardware store
    you have to send a json of the form:
    {
        "IdFerreteria": "242"
    }
    */
    try {
        const res = await fetch(`${API_POS}/clientlist`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(ClientlistValues)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const Newclient = async(NewclientValues) => {
    /*add a new client but only for the hardware store 
    you have to send a json of the form:
    {
        "IdFerreteria": "242",
        "Tipo": 0, //it's 0 if the client is a natural person and 1 if the client is a company
        "NitCC": "123456789",
        "Nombre": "Jhoan Sebastian",
        "Apellido": "Sierra Vargas",
        "Telefono1": "3227804602",
        "Telefono2": "",
        "Correo": "correodeprueba@gmail.com",
        "Direccion": "calle 71 sur N° 14 B-78",
        "Barrio": "La fortaleza",
        "FormaDePago": 0,
        "LimiteDeCredito": 0, //In this stage this have to be always 0
        "Nota": "Es una prueba para el cliente nuevo del pos",
        "Fecha": "2024-07-20 13:00:00" //Format is AAAA-MM-DD hh:mm:ss
    }
    */
    try {
        const res = await fetch(`${API_POS}/newclient`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(NewclientValues)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const UpdateClient = async(updateclient) => {
    /*add a new client but only for the hardware store 
    you have to send a json of the form:
    {
        "Tipo": 0,
        "NitCC": "123456789",
        "Nombre": "Jhoan Sebastian arreglado",
        "Apellido": "Sierra vargas arreglado",
        "Telefono1": "3227804602",
        "Telefono2": "987654321",
        "Correo": "correodeprueba@gmail.com",
        "Direccion": "calle 71 sur N° 14 B-78",
        "Barrio": "La fortaleza",
        "FormaDePago": 0,
        "LimiteDeCredito": 0,
        "Nota": "Es una prueba para actualizar el cliente nuevo del pos",
        "Consecutivo": 1,
        "IdFerreteria": 242
    }
    */
    try {
        const res = await fetch(`${API_POS}/updateclient`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updateclient)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

//* All about purchases
export const PurchaseList = async(purchaselist) => {
    /*return the list of purchases
    you have to send a json of the form:
    {
        "IdFerreteria": 242
    }
    */
    try {
        const res = await fetch(`${API_POS}/purchaseList`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(purchaselist)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}