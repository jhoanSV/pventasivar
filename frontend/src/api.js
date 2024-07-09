const API_POS = process.env.SIVARPOS_APP_API;
const API = process.env.REACT_APP_API;

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

export const Newproduct = async(NewproductValues) => {
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
        "InvMinimo": 1,
        "InvMaximo": 5,
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
        "NitCC": 123456789,
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

