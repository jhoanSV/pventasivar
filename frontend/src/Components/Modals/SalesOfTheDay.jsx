import React, {useState, useEffect, useRef} from 'react';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist, TheAlert } from '../../Components';
import './_SalesOfTheDay.scss';
import jsonTest from '../../sales_per_day.json';
import { SalesPerDay, CancelTheSale, valTokenColtek } from '../../api';
import { ReturnProduct } from './ReturnProduct';
import { UserConfirm } from './UserConfirm';
import { TokenV } from '../../App';
import { Formater } from '../../App';
import ReactDOMServer from 'react-dom/server';
import { TicketPrint } from '../TickerPrint';


export const SalesOfTheDay = ({show, orderslist, width='90%', height='90%'}) => {
    const [ paga, setPaga] = useState(0);
    const [ cambio, setCambio] = useState(0);
    const [ total, setTotal] = useState(0);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ selectedfilaOrder, setSelectedfilaOrder] = useState(0);
    const [ selectedOrder, setSelectedOrder] = useState(null);
    const [ orders, setOrders ] = useState([]);
    const [ headerSales, setHeaderSales ] = useState(null);
    const [ dateSearch, setDateSearch ] = useState(new Date());
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ allowedButtons, setAllowedButtons ] = useState(false);
    const { setSection, setSomeData, usD, setUsD, setLogged } = useTheContext();
    // for the tables of the order and the selected order
    const isEditingRef = useRef(false);
    const ordersRef = useRef([]);
    const selectedfilaRef = useRef(0);
    const selectedOrderRef = useRef([]);
    const selectedfilaOrderRef = useRef(0);
    const allOrdersRef = useRef([]);
    // For the search function
    const [searchText, setSearchText ] = useState('');
    // for modals
    const [showReturnModal, setShowReturnModal] = useState(false);


    const searchOrder = (text) => {
        const data = allOrdersRef.current
        const filtro = data.filter((order) => {
            const filterByHead = order.Consecutivo.toString().toLowerCase().includes(text.toString().toLowerCase()) || order.Nombre.toString().toLowerCase().includes(text.toString().toLowerCase());
            const filterByBody = order.Orden.some(item => item.Cod.toString().toLowerCase().includes(text.toString().toLowerCase()) || item.Descripcion.toString().toLowerCase().includes(text.toString().toLowerCase()));
            return filterByHead || filterByBody;
        });
        console.log('filtro: ', filtro)
        if (filtro.length > 0){
            setOrders(filtro);
            setSelectedfila(0);
            ChangueSelectedOrder(filtro[0]);
            setSelectedfilaOrder(0);
            //console.log('entro al filtro: ', filtro[0]);
        }
        setSearchText(text)
    }

    const handleKeyDown = (event) => {
        if (!isEditingRef.current) { // is edditing only the order
            const maxIndex = ordersRef.current.length;
            if (event.key === 'ArrowDown') {
                if (selectedfilaRef.current + 1 < maxIndex) {
                    setSelectedfila(prevFila => prevFila + 1);
                    ChangueSelectedOrder(ordersRef.current[selectedfilaRef.current + 1]);
                }
            } else if (event.key === 'ArrowUp') {
                if (selectedfilaRef.current - 1 > -1) {
                    setSelectedfila(prevFila => prevFila - 1);
                    ChangueSelectedOrder(ordersRef.current[selectedfilaRef.current - 1]);
                }
            }
        } else {
            const maxIndex = selectedOrderRef.current.length;
            console.log('entra a editar el detalle del pedido')
            if (event.key === 'ArrowDown') {
                if (selectedfilaOrderRef.current + 1 < maxIndex) {
                    setSelectedfilaOrder(prevFila => prevFila + 1);
                }
            } else if (event.key === 'ArrowUp') {
                if (selectedfilaOrderRef.current - 1 > -1) {
                    setSelectedfilaOrder(prevFila => prevFila - 1);
                }
            }
        }
    };
    

    const getOrdersPerday = async() => {
        TokenV({ IdFerreteria: usD.Cod }, usD.token, setLogged)
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        const response = await SalesPerDay({
            'IdFerreteria' : usD.Cod,
            'Fecha': dateSearch.toISOString().split('T')[0]
        });
        const sortedSelectedOrder  = response.sort((a,b)=> (b.Consecutivo-a.Consecutivo))
        console.log('sortedSelectedOrder', sortedSelectedOrder)
        setOrders(response);
        setSelectedOrder(null);
        setHeaderSales(null)
        allOrdersRef.current = response;
        ordersRef.current = response;
    }

    useEffect(() => {
        if (paga >= total) {
            setCambio(paga - total)
        } else {
            setCambio(0)
        }
    }, [paga])

    useEffect(() => {
        getOrdersPerday()
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [])

    useEffect(() => {
        getOrdersPerday()
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dateSearch]);

    useEffect(() => {
        sumarTotal()
    }, [selectedOrder])

    useEffect(() => {
        selectedfilaRef.current = selectedfila
    }, [selectedfila])

    useEffect(() => {
        selectedOrderRef.current = selectedOrder
    }, [selectedOrder])

    useEffect(() => {
        selectedfilaOrderRef.current = selectedfilaOrder
    }, [selectedfilaOrder])

    const ChangueSelectedOrder = (item) => {
        setHeaderSales(item);
        setSelectedOrder(item.Orden)
    }

    const sumarTotal = () => {
        let suma = 0;
        if (selectedOrder && selectedOrder.length > 0) {selectedOrder.forEach((item, index) => (
            suma += item.VrUnitario * (item.CantidadSa - item.CantidadEn)
        ))}
        setTotal(suma)
    };

    const ctHeaders = [
        {
            header: 'Consecutivo',
            key: 'Consecutivo',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Folio',
            key: 'Folio',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Cliente',
            key: 'Nombre',
            defaultWidth: 131,
            type: 'text',
        }
        ,
        {
            header: 'Hora',
            key: 'Fecha',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Total',
            key: 'Total',
            defaultWidth: 50,
            type: 'text',
        }
    ];

    const HeadersOrderSelected = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'U/M',
            key: 'Medida',
            defaultWidth: 50,
            type: 'text',
        }
        ,
        {
            header: 'Vr.Unitario',
            key: 'vrUnitario',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Total',
            key: 'Total',
            defaultWidth: 50,
            type: 'text',
        }
    ];


    const RowOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        let suma = 0
        item.Orden.forEach(valor => {
            suma += valor.VrUnitario * (valor.CantidadSa - valor.CantidadEn);
        });
        const styles = {
            textDecoration: suma === 0 ? 'line-through' : 'none',
            color: suma === 0 ? '#999999' : '#000000',
        };
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}} onClick={()=>{ChangueSelectedOrder(item); isEditingRef.current = false}}>
                        <label>{item.Consecutivo}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}} onClick={()=>{ChangueSelectedOrder(item); isEditingRef.current = false}}>
                        <label>{item.Folio}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[2]}} onClick={()=>{ChangueSelectedOrder(item); isEditingRef.current = false}}>
                        <label>{item.Nombre}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[3]}} onClick={()=>{ChangueSelectedOrder(item); isEditingRef.current = false}}>
                        <label>{item.Fecha.split('T')[1].split('.')[0]}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[4]}} onClick={()=>{ChangueSelectedOrder(item); isEditingRef.current = false}}>
                        <label>${Formater(suma)}</label>
                    </td>
                </>
        );
    };

    const RowOfSelectedOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        const remainingAmount = item.CantidadSa - item.CantidadEn;
        const rowIndex = index;
        const styles = {
            textDecoration: remainingAmount === 0 ? 'line-through' : 'none',
            color: item.CantidadSa - item.CantidadEn === 0 ? '#999999' : '#000000',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
        };
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}} onClick={()=>isEditingRef.current = true}>
                        <label>{(remainingAmount) !== 0 ? remainingAmount: item.CantidadSa}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}} onClick={()=>isEditingRef.current = true}>
                        <label>{item.Cod}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[2]}} onClick={()=>isEditingRef.current = true}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[3]}} onClick={()=>isEditingRef.current = true}>
                        <label>{item.Medida === '' ? 'Unidad': item.Medida}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[4]}} onClick={()=>isEditingRef.current = true}>
                        <label>${Formater(item.VrUnitario)}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[5]}} onClick={()=>isEditingRef.current = true}>
                        <label>${Formater((item.CantidadSa - item.CantidadEn) !== 0 ? (item.CantidadSa - item.CantidadEn) * item.VrUnitario: item.CantidadSa * item.VrUnitario)}</label>
                    </td>
                </>
        );
    };

    const returnProductM = () => {
        const fila = orders[selectedfila].Orden[selectedfilaOrder]
        //console.log(fila);
        if (fila.CantidadSa - fila.CantidadEn === 0) {
            TheAlert('No se puede devolver un producto que ya ha sido vendido completamente.')
        } else {
            setShowReturnModal(true)
        }
    }

    const returnTheOrder = async(TipoReclamo) => {
        const confirmCacelTheSale = await TheAlert('¿Esta seguro que desea' + ( TipoReclamo === 1 ? 'devolver el producto':'cancelar la venta') + '?, esta acción es irreversible', 1)
        if (confirmCacelTheSale) {
            const now = new Date();
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.toISOString().split('T')[0];
            // Obtener la hora en formato HH:MM:SS
            const time = now.toTimeString().split(' ')[0];
            const fila = {...orders[selectedfila]}
            let suma = 0
            console.log("TipoReclamo: ", TipoReclamo)
            if (TipoReclamo === 1){
                fila.TipoReclamo = 1
                fila.Descripcion_Reclamo = "Devolución parcial de los bienes y/o no aceptación parcial del servicio"
            } else if (TipoReclamo === 2){
                fila.Tipo_Reclamo = 2
                fila.Descripcion_Reclamo = "Anulacion de Factura electrónica"
            }
            const Customer= {
                TipoPersona: fila.Tipo === 0 ? 2 : 1,
                NombreTipoPersona: fila.Tipo === 0 ? 'Persona Natural' : 'Persona Jurídica',
                TipoDocumento: fila.Tipo === 0 ? 13 : 31,
                NombreTipoDocumento: fila.Tipo === 0 ? 'Cédula de ciudadanía ': 'NIT',
                Documento: usD.Nit,
                Dv: usD.Dv,
                NombreComercial: usD.Ferreteria,
                RazonSocial: usD.Ferreteria,
                Telefono: usD.Telefono,
                Correo: usD.Email,
                Departamento: {
                    Codigo: 11,
                    Nombre: "Bogota"
                },
                Ciudad: {
                    Codigo: 11001,
                    Nombre: "Bogota, DC."
                },
                Direccion: usD.Dirección,
                ResponsabilidadFiscal: "R-99-PN",
                DetallesTributario: {
                    Codigo: "01",
                    Nombre: "IVA"
                }
            }
            fila.Orden.forEach(valor => {
                suma += valor.VrUnitario * (valor.CantidadSa - valor.CantidadEn);
            });
            fila.FechaActual = date + ' ' + time
            fila.Total = suma
            fila.IdFerreteria = usD.Cod
            fila.Responsable = usD.Contacto
            fila.Customer = Customer
            if (fila.Cufe !== '') {
                const tokencheck = await valTokenColtek(usD.resColtek.token, usD.token)
                if (tokencheck.status){
                    //If status is true then only put the token on the orderlist
                    fila.tokenColtek = usD.resColtek.token
                } else if (!tokencheck.status){
                    //If status is false then restart the token to the new one
                    const newUsD = {...usD, resColtek: tokencheck.resColtek}
                    fila.tokenColtek = tokencheck.resColtek.token
                    setUsD(newUsD)
                }
            }
            console.log("fila: ", fila)
            await CancelTheSale(fila)
            //const today = formatDate(new Date());
            //TheAlert('Se cancelo la venta con exito')
            //getOrdersPerday()
        }
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };

    const askToPrint =() => {
        if (orders[selectedfila].FacturaElectronica === '') {
            let toElectronic = TheAlert('¿Deseas convertir la remision en factura electronica?',1)
            if (toElectronic) {
                console.log('se pasa a factura electronica');
            }
        } else {
            rePrint()
        }
    };

    const rePrint = () => {
        const print = true;
        for (const orden of selectedOrder){
            orden.Cantidad = Number(orden.CantidadSa) - Number(orden.CantidadEn)
            orden.PVenta = orden.VrUnitario
        }
        const originalDate = orders[selectedfila].Fecha;
        const day = originalDate.split('T')[0];
        const hour = originalDate.split('T')[1].split('.')[0];
        let medioDePago = ''
        if (orders[selectedfila].Efectico !== 0 && orders[selectedfila].Transferencia === 0) {
            medioDePago = 'Efectivo'
        } else if (orders[selectedfila].Efectico === 0 && orders[selectedfila].Transferencia !== 0) {
            medioDePago = 'Transferencia'
        } else if (orders[selectedfila].Efectico !== 0 && orders[selectedfila].Transferencia !== 0) {
            medioDePago = 'Mixto'
        }
        const electronic = headerSales.FacturaElectronica === ''? false: true;
        const sendedOrden = {
            Customer: {
                Apellido: orders[selectedfila].Apellido,
                Barrio: orders[selectedfila].Barrio,
                Consecutivo: orders[selectedfila].Consecutivo,
                Correo: orders[selectedfila].Correo !== '' ? orders[selectedfila].Correo :usD.Email,
                Direccion: orders[selectedfila].Direccion,
                Fecha: day + ' ' + hour,
                FormaDePago: 0,
                IdFerreteria: usD.Cod,
                LimiteDeCredito: 0,
                NitCC: orders[selectedfila].NitCC,
                Nombre: orders[selectedfila].Nombre,
                Nota: "",
                Telefono1: orders[selectedfila].Telefono1,
                Telefono2: orders[selectedfila].Telefono2,
                Tipo: orders[selectedfila].Tipo
            },
            Electronic: electronic,
            Order: selectedOrder,
            RCData: {
                Activo: true,
                CodResponsable: usD.Cod,
                Comentarios: "",
                Efectivo: orders[selectedfila].Efectivo,
                Fecha: day + ' ' + hour,
                Folio: orders[selectedfila].Folio,
                IdFerreteria: usD.Cod,
                MedioDePago: medioDePago,
                Motivo: "Venta por caja",
                Referencia: "",
                Responsable: usD.Contacto,
                Transferencia: orders[selectedfila].Transferencia
            },
            Result: {
                Codigo: orders[selectedfila].FacturaElectronica,
                CufeCude: orders[selectedfila].Cufe,
                Errores: "",
                IsValid: "true",
                StatusCode: "00",
                StatusDescription: "Procesado Correctamente.",
                Url_Pdf: "http://empresa.example.com/Facturacion/empresa/Facturas/18760000001/SETP990000001/SETP990000001.pdf"
            }
        }
        /*Customer: {
            Apellido: "",
            Barrio: "",
            Consecutivo: 0,
            Correo: "gersonlvargas.na@gmail.com",
            Direccion: "",
            Fecha: "2024-10-10 14:43:22",
            FormaDePago: 0,
            IdFerreteria: 242,
            LimiteDeCredito: 0,
            NitCC: 222222222222,
            Nombre: "Consumidor final",
            Nota: "",
            Telefono1: 0,
            Telefono2: 0,
            Tipo: 0
        }
        Electronic: true,
        Order: [{
            Cantidad: 2,
            Categoria: "EBANISTERIA",
            Clase: 1,
            Cod: "GLV1",
            Consecutivo: 20,
            Descripcion: "ENtertaiment",
            Detalle: "bones",
            IdCategoria: 1,
            IdFerreteria: 242,
            IdSubCategoria: 1,
            InvMaximo: 10,
            InvMinimo: 2,
            Inventario: 4.571429,
            Iva: 19,
            Medida: "Paquete",
            Medidas: [
                PCosto: 14000,
                PVenta: 7000,
                ]
            SubCategoria: "AMARRES PLASTICOS",
            UMedida: 1,
            Ubicacion: "ayaya"
        }],
        RCData: { 
            Activo: true,
            CodResponsable: 242,
            Comentarios: "",
            Efectivo: 14000,
            Fecha: "2024-10-10 14:43:22",
            Folio: 6,
            IdFerreteria: 242,
            MedioDePago: "Efectivo",
            Motivo: "Venta por caja",
            Referencia: "",
            Responsable: "Gerson Loaiza",
            Transferencia: 0
        },
        Result: {
            Codigo: "SETP990000001",
            CufeCude: "665bf3f7f7a148f6d3e9c4816f7683562d204f53a7c578008fd5467daec87593a64ad83580874d9ba105f0fc0f2de63e",
            Errores: ""
            IsValid: "true"
            StatusCode: "00"
            StatusDescription: "Procesado Correctamente."
            Url_Pdf: "http://empresa.example.com/Facturacion/empresa/Facturas/18760000001/SETP990000001/SETP990000001.pdf"
        }
        */
        
        if (print) {
            const usDdata = usD
            //console.log('Sended orden: ', sendedOrden)
            // Render the component as HTML
            const ticketHTML = ReactDOMServer.renderToString(<TicketPrint data={sendedOrden} usD={usDdata} Electronic={electronic}/>);
            //Send the HTML to Electron for printing
            window.electron.send('print-ticket', ticketHTML);
            //setShowTicket(true);
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    <div className='header_Sales_Of_the_Day'>
                        <h2>Ventas del dia</h2>
                    </div>
                    <div className='twoColumnsContainer'>
                        <div>
                            <div>
                                <label><strong>Buscar: </strong></label>
                                <input
                                    type='text'
                                    placeholder='Buscar ventas del dia'
                                    value={searchText}
                                    onChange={(text)=>searchOrder(text.target.value)}
                                    style={{width: '80%'}}>
                                </input>
                            </div>
                            <div className='Table'>               
                                <Flatlist
                                    data={orders}
                                    row={RowOrder}
                                    headers={ctHeaders}
                                    selectedRow={selectedfila}
                                    setSelectedRow={setSelectedfila}
                                    Height='600px'
                                />
                            </div>
                            <div>
                                <label><strong>Fecha seleccionada: </strong></label>
                                <input
                                    type="date"
                                    value={formatDate(dateSearch)}
                                    onChange={(e)=>{
                                        const selectedDate = e.target.value;
                                        const dateParts = selectedDate.split('-');
                                        const correctedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                                        setDateSearch(correctedDate)
                                    }}
                                    max={(() => {
                                        // Obtener la fecha actual en la zona horaria local
                                        const today = new Date();
                                        const year = today.getFullYear();
                                        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
                                        const day = String(today.getDate()).padStart(2, '0');
                            
                                        // Formatear la fecha como 'YYYY-MM-DD' en la zona horaria local
                                        return `${year}-${month}-${day}`;
                                    })()}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='twoColumnsContainer'>
                                <div className='data_of_sale'>
                                    <div className='Col'>
                                        <label><strong>Tipo de venta:</strong></label>
                                        <label><strong>Venta:</strong></label>
                                        <label><strong>Cliente:</strong></label>
                                        <label><strong>Hora:</strong></label>
                                    </div>
                                    <div className='Col'>
                                        {headerSales !== null ? (
                                            <>
                                                <label>{headerSales.FacturaElectronica === ''? 'Remisión': 'Factura electronica'}</label>
                                                <label>{headerSales.Consecutivo}</label>
                                                <label>{headerSales.Nombre + ' ' + headerSales.Apellido}</label>
                                                <label>{headerSales.Fecha.split('T')[1].split('.')[0]}</label>
                                            </>
                                        ) : (
                                            <label>Seleccione una venta</label> // Mostrar un mensaje por defecto o dejar el espacio vacío
                                        )}
                                    </div>
                                </div>
                                <div className='data_of_sale'>
                                    <div className='Col'>
                                        <label><strong>Forma de pago:</strong></label>
                                    </div>
                                    <div className='Col'>
                                        {headerSales !== null ? (
                                            <>
                                                <label>{(()=>{
                                                    let medioDePago = ''
                                                    if (orders[selectedfila].Efectico !== 0 && orders[selectedfila].Transferencia === 0) {
                                                        medioDePago = 'Efectivo'
                                                    } else if (orders[selectedfila].Efectico === 0 && orders[selectedfila].Transferencia !== 0) {
                                                        medioDePago = 'Transferencia'
                                                    } else if (orders[selectedfila].Efectico !== 0 && orders[selectedfila].Transferencia !== 0) {
                                                        medioDePago = 'Mixto'
                                                    } return medioDePago
                                                    })()}</label>
                                            </>
                                        ) : (
                                            <label>Seleccione una venta</label> // Mostrar un mensaje por defecto o dejar el espacio vacío
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='Table'>
                                <Flatlist
                                    data={selectedOrder}
                                    row={RowOfSelectedOrder}
                                    headers={HeadersOrderSelected}
                                    selectedRow={selectedfilaOrder}
                                    setSelectedRow={setSelectedfilaOrder}
                                    Height='500px'
                                    maxHeight={'30%'}
                                />
                            </div>
                            <button
                                className="btnStnd btn1"
                                onClick={()=>returnProductM()}
                                disabled={selectedOrder !== null? false: true}
                                >Devolver articulo</button>
                            <label>Total:</label>
                            <label>${Formater(total)}</label>
                            
                        </div>
                        <button
                            className="btnStnd btn1"
                            onClick={()=>returnTheOrder(2)}
                            disabled={selectedOrder === null || total === 0? true: false} 
                            >Cancelar venta</button>
                        <button
                            className="btnStnd btn1"
                            onClick={()=>{askToPrint()}}
                            disabled={selectedOrder !== null? false: true}
                            >Imprimir copia</button>
                    </div>
                </div>

                {showReturnModal && <ReturnProduct show={setShowReturnModal} row={orders[selectedfila]} index={selectedfilaOrder} updateOrders={ChangueSelectedOrder}/>}
                {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnTheOrder} />}
            </div>
        </div>
    );
}