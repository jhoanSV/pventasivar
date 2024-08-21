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
        "IdSubCategoria": 1,
        "PCosto": 500,
        "PVenta": 1000,
        'PrecioUM': '', //*Precio unitario de medida
        "Inventario": 10
        "InvMinimo": 1,
        "InvMaximo": 10,
        "Ubicacion": "A1",
        "Detalle": "Es una prueba de ingreso de nuevo producto al inventario",
        "Medida": "", //* Numero de la medida
        "UMedida" 1, //*Unidad de medida. Metros, Kilos, Unidad de paquete
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
        "Apellido": "Sierra vargas arreglado",
        "Barrio": "La fortaleza",
        "Consecutivo": 1
        "Correo": "correodeprueba@gmail.com",
        "Direccion": "calle 71 sur N° 14 B-78",
        "FormaDePago": 0,
        "IdFerreteria": 242,
        "LimiteDeCredito": 0,
        "NitCC": "123456789",
        "Nombre": "Jhoan Sebastian arreglado",
        "Nota": "Es una prueba para actualizar el cliente nuevo del pos",
        "Telefono1": "3227804602",
        "Telefono2": "987654321",
        "Tipo": 0,
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
//*All related to purchases %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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

export const PurchaseDetail = async(purchasedetail) => {
    /*return the detail of the purchase
    you have to send a json of the form:
    {
        "IdFerreteria": 242,
        "NPrefactura": 10725
    }
    */
    try {
        const res = await fetch(`${API_POS}/purchasedetail`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(purchasedetail)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const AddPurchase = async(addpurchase) => {
    /*create a new purchase
    you have to send a json of the form:
    {
        "IdFerreteria": 242,
        "Fecha": "2024-04-07 11:49:35",
        "CodResponsable": ,
        "Responsable": ,
        "Consecutivo": ,//*Consecutivo de la compra
        "Order": {[
            {
                "ConsecutivoProd" : //* Consecutivo del producto
                "Cantidad": 5,
                "Cod": "bla",
                "Descripcion": "Producto de prueba para el pos2",
                "PCosto": 500,
                "PCostoLP": //*Precio anterior a la factura (PCosto)
                "Iva": 
            },
            ...
        ]}
    }
    */
    try {
        const res = await fetch(`${API_POS}/addpurchase`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(addpurchase)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const UpdateVefiedPurchase = async(updatevefied) => {
    /*create a new purchase
    you have to send a json of the form:
    {
        "Verificado": true,
        "IdFerreteria": 242,
        "NPreFactura": 10725,
        "Cod" : "bla"
    }
    */
    try {
        const res = await fetch(`${API_POS}/updatevefied`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(updatevefied)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const ModifyPurchaseProduct = async(modifypurchaseproduct) => {
    /*create a new purchase
    you have to send a json of the form:
    {
        "ConsecutivoProd": data.ConsecutivoProd,
        "Cod" : data.Cod,
        "IdFerreteria": usD.Cod,
        "NPreFactura" : someData.NPreFactura,
        "PCosto": data.PCosto,
        "PVenta": data.PVenta,
    }
    */
    try {
        const res = await fetch(`${API_POS}/modifypurchaseproduct`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(modifypurchaseproduct)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}
//*All related to sales %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export const SalesPerDay = async(salesperday) => {
    /*return the list of sales per day
    you have to send a json of the form:
    {
        "IdFerreteria": 242,
        "Fecha": "2024-04-07"
    }
    */
    try {
        const res = await fetch(`${API_POS}/salesperday`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(salesperday)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const NewSale = async(newsale) => {
    /*Send the data to the databse to register the new sale
    you have to send a json of the form:
    {
        "IdFerreteria": "242",
        "Folio": 1,
        "IdCliente": 1,
        "Fecha": "2024-04-07 11:49:35",
        "CodResponsable": "242",
        "Responsable": "Ferreteria marly",
        "Order": [{
            "ConsecutivoProd": 8,
            "Cantidad": 5,
            "Cod": "bla",
            "Descripcion": "Producto de prueba para el pos",
            "VrCosto": 500.00,
            "VrUnitario": 1000.00,
            "Iva": 19.0,
            "Motivo": "Venta por caja"
            },
            {
            "ConsecutivoProd": 9,
            "Cantidad": 10,
            "Cod": "bla",
            "Descripcion": "Segundo producto de prueba para el pos",
            "VrCosto": 500.00,
            "VrUnitario": 1000.00,
            "Iva": 19.0,
            "Motivo": "Venta por caja"
            }]
    }
    */
    try {
        const res = await fetch(`${API_POS}/newsale`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(newsale)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const CashFlow = async(cashflow) => {
    /*return the list of sales per day
    you have to send a json of the form:
    {
        "IdFerreteria": 242,
        "Fecha": "2024-04-07"
        "TipoDeFlujo" : false // if is false then is an entry and if is true then it is an output
    }
    */
    try {
        const res = await fetch(`${API_POS}/cashflow`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(cashflow)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const NewMoneyFlow = async(newmoneyflow) => {
    /*return the list of sales per day
    you have to send a json of the form:
    {
        ConsecutivoCV: 0,
        IdFerreteria: usD.Cod,
        Fecha: date + ' ' + time,
        Referencia: 0,
        Efectivo: cantidad,
        Transferencia: 0,
        Motivo: 'Ingreso por caja',
        Comentarios: comentario,
        TipoDeFlujo: true
    }
    */
    try {
        const res = await fetch(`${API_POS}/newmoneyflow`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(newmoneyflow)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const RemoveFlow = async(removeflow) => {
    /*return the list of sales per day
    you have to send a json of the form:
    {
        IdFerreteria: usD.Cod,
        ConsecutivoCV: 0
    }
    */
    try {
        const res = await fetch(`${API_POS}/removeflow`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(removeflow)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}

export const NewOutput = async(newoutput) => {
    /*return the list of sales per day
    you have to send a json of the form:
    {
        CodInterno:,
        IdFerreteria:,
        ConsecutivoProd:,
        Cantidad:,
        Cod:,
        Descripcion:,
        PCosto:,
        PCostoLP:,
        Fecha:,
        Iva:,
        CodResponsable:,
        Responsable:,
        Motivo:,
        ConsecutivoCompra:
    }
    */
    try {
        const res = await fetch(`${API_POS}/newoutput`,{
            method: 'POST',
            headers: { Accept: 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify(newoutput)
        })
        return await res.json()
    }catch(error) {
        console.log('TheError: '+ error)
    }
}
