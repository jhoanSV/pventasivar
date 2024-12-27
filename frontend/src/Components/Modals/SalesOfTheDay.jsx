import React, {useState, useEffect, useRef} from 'react';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist, TheAlert } from '../../Components';
import './_SalesOfTheDay.scss';
import jsonTest from '../../sales_per_day.json';
import { SalesPerDay, CancelTheSale, valTokenColtek, ToRemsionToElectronic} from '../../api';
import { ReturnProduct } from './ReturnProduct';
import { UserConfirm } from './UserConfirm';
import { TokenV } from '../../App';
import { Formater } from '../../App';
import ReactDOMServer from 'react-dom/server';
import { TicketPrint } from '../TickerPrint';
import progress from '../../Assets/AVIF/progress.gif';
import CargadoConExito from '../../Assets/AVIF/CargadoConExito.png'


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
    const [ showReprint, setShowReprint ] = useState(false);
    const [ showToElectronicInvoice, setShowToElectronicInvoice ] = useState(false);
    const [ visiblevCargando, setVisiblevCargando ] = useState(false);
    const [ visibleEnvioExitoso, setVisibleEnvioExitoso] = useState(false);
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
        const date = now.getFullYear() +
                    '-' + String(now.getMonth() + 1).padStart(2, '0') +
                    '-' + String(now.getDate()).padStart(2, '0');
        // Obtener la hora en formato HH:MM:SS
        const time = String(now.getHours()).padStart(2, '0') +
                    ':' + String(now.getMinutes()).padStart(2, '0') +
                    ':' + String(now.getSeconds()).padStart(2, '0');
        const response = await SalesPerDay({
            'IdFerreteria' : usD.Cod,
            'Fecha': dateSearch.getFullYear() +
                    '-' + String(dateSearch.getMonth() + 1).padStart(2, '0') +
                    '-' + String(dateSearch.getDate()).padStart(2, '0')
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
        const fecha = new Date(item.Fecha);
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
                        <label>{String(fecha.getHours()).padStart(2, '0') +
                                ':' + String(fecha.getMinutes()).padStart(2, '0') +
                                ':' + String(fecha.getSeconds()).padStart(2, '0')}
                        </label>
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

    const returnTheOrder = async(TipoReclamo, cantidad) => {
        const confirmCacelTheSale = await TheAlert('¿Esta seguro que desea ' + ( TipoReclamo === 1 ? 'devolver el producto':'cancelar la venta') + '?, esta acción es irreversible', 1)
        if (confirmCacelTheSale) {
            setVisiblevCargando(true)
            const fila = {...orders[selectedfila]}
            const now = new Date();

            const dateorder = new Date(fila.Fecha)
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.getFullYear() +
                        '-' + String(now.getMonth() + 1).padStart(2, '0') +
                        '-' + String(now.getDate()).padStart(2, '0');
            // Obtener la hora en formato HH:MM:SS
            const time = String(now.getHours()).padStart(2, '0') +
                        ':' + String(now.getMinutes()).padStart(2, '0') +
                        ':' + String(now.getSeconds()).padStart(2, '0');
            const dateOfTheOrder = dateorder.getFullYear() +
                                    '-' + String(dateorder.getMonth() + 1).padStart(2, '0') +
                                    '-' + String(dateorder.getDate()).padStart(2, '0');
            // Obtener la hora en formato HH:MM:SS
            const timeOfTheOrder = String(dateorder.getHours()).padStart(2, '0') +
                                    ':' + String(dateorder.getMinutes()).padStart(2, '0') +
                                    ':' + String(dateorder.getSeconds()).padStart(2, '0');
            let suma = 0
            if (TipoReclamo === 1){
                fila.Tipo_Reclamo = 1
                fila.Descripcion_Reclamo = "Devolución parcial de los bienes y/o no aceptación parcial del servicio"
                let producto = {...fila.Orden[selectedfilaOrderRef.current]}
                producto.CantidadEn = 0
                producto.CantidadSa = cantidad
                fila.Orden = [producto]
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
                Direccion: usD.Direccion,
                ResponsabilidadFiscal: "R-99-PN",
                DetallesTributario: {
                    Codigo: "01",
                    Nombre: "IVA"
                }
            }
            
            fila.Orden.forEach(valor => {
                suma += valor.VrUnitario * (valor.CantidadSa - valor.CantidadEn);
            });
            fila.FechaFactura = dateOfTheOrder
            fila.HoraFactura = timeOfTheOrder
            fila.FechaActual = date
            fila.HoraActual = time
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
            const cancelOrder = await CancelTheSale(fila)
            if (fila.Cufe !== '' && cancelOrder.Result.IsValid === 'false'){
                
                setVisiblevCargando(false)
                setVisibleEnvioExitoso(false)
                TheAlert('No se pudo generar Nota credito:\n el error es: ' + cancelOrder.Result.Errores)
                setShowReturnModal(false)
                return
            } else if (fila.Cufe !== '' && cancelOrder.Result.IsValid === 'true'){
                
                getOrdersPerday()
                setVisiblevCargando(false)
                setVisibleEnvioExitoso(true)
                setTimeout(() => {
                    setVisibleEnvioExitoso(false)
                    setShowReturnModal(false)
                }, 2000);
                return
            } else if (fila.Cufe === '' && cancelOrder.IsValid === true) {
                
                getOrdersPerday()
                setVisiblevCargando(false)
                setVisibleEnvioExitoso(true)
                setTimeout(() => {
                    setVisibleEnvioExitoso(false)
                    setShowReturnModal(false)
                }, 2000);
                return
            } else if (fila.Cufe === '' && cancelOrder.IsValid === true) {
                
                setVisiblevCargando(false)
                setVisibleEnvioExitoso(false)
                TheAlert('No se pudo generar Nota credito:\n el error es: ' + cancelOrder.Errores)
                setShowReturnModal(false)
                return
            }
            
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        return [year, month, day].join('-');
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
        const electronic = headerSales.Prefijo === ''? false: true;
        let NewOrderlist = []
        for (let orden of selectedOrder) {
            if ((orden.CantidadSa - orden.CantidadEn)>0){
                NewOrderlist.push(orden)
            }
        }
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
            Order: NewOrderlist,
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
                Codigo: orders[selectedfila].Prefijo + orders[selectedfila].FacturaElectronica,
                CufeCude: orders[selectedfila].Cufe,
                Errores: "",
                IsValid: "true",
                StatusCode: "00",
                StatusDescription: "Procesado Correctamente.",
                Url_Pdf: "http://empresa.example.com/Facturacion/empresa/Facturas/18760000001/SETP990000001/SETP990000001.pdf"
            }
        }
        
        if (print) {
            const usDdata = usD
            //console.log('Sended orden: ', sendedOrden)
            // Render the component as HTML
            const ticketHTML = ReactDOMServer.renderToString(<TicketPrint data={sendedOrden} usD={usDdata} Electronic={electronic}/>);
            //Send the HTML to Electron for printing
            window.electron.send('print-ticket', ticketHTML);
            //setShowTicket(true);
        }
    };

    const ModarChargin = () => {
        return(
            <div
                className='theModalContainer'
                style={{
                    display: 'flex',
                    justifyContent: 'center', // Centra horizontalmente
                    alignItems: 'center',    // Centra verticalmente
                    height: '100vh',         // Ocupa toda la altura de la ventana
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente (opcional)
                  }}>
                <div className='theModal-content' style={{width: '400px', height: '400px', position: 'relative'}}>
                    <div className='theModal-body' style={{display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <img 
                            src={progress}
                            style={{
                                width: '80%',
                                height: 'auto', // Mantiene la proporción de la imagen
                              }}
                            alt="Cargando..."/>
                        <label style={{ marginTop: '10px', fontSize: '30px', textAlign: 'center', color: '#193773' }}>
                            <strong>Cargando...</strong>
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    const ModarSuccessfulSubmission = () => {
        return(
            <div
                className='theModalContainer'
                style={{
                    display: 'flex',
                    justifyContent: 'center', // Centra horizontalmente
                    alignItems: 'center',    // Centra verticalmente
                    height: '100vh',         // Ocupa toda la altura de la ventana
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente (opcional)
                  }}>
                <div className='theModal-content' style={{width: '400px', height: '400px', position: 'relative'}}>
                    <div className='theModal-body' style={{display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <img 
                            src={CargadoConExito}
                            style={{
                                width: '80%',
                                height: 'auto', // Mantiene la proporción de la imagen
                              }}
                            alt="CargadoConExito"/>
                    </div>
                </div>
            </div>
        )
    }

    const openElectronicInvoice = () => {
        const link = `http://${usD.resColtek.usuario.name.toLowerCase()}.colsad.com/Facturacion/${usD.resColtek.usuario.name.toLowerCase()}/Facturas/${orders[selectedfila].Resolucion}/${headerSales.Prefijo + headerSales.FacturaElectronica}/${headerSales.Prefijo + headerSales.FacturaElectronica}.pdf`; // Cambia el link según lo necesites
        window.electron.openExternalLink(link);
    }

    const ConfirmPrintModal= ()=>{
        const [ confirmarConvert, setConfirmarConvert ] = useState('')
        const printTicket =async()=>{
            if (showToElectronicInvoice === true && confirmarConvert.toLowerCase() === 'confirmar') {
                try {
                    setVisiblevCargando(true)
                    const now = new Date();
                    // Obtener la fecha en formato YYYY-MM-DD
                    const date = now.getFullYear() +
                                '-' + String(now.getMonth() + 1).padStart(2, '0') +
                                '-' + String(now.getDate()).padStart(2, '0');
                    // Obtener la hora en formato HH:MM:SS
                    const time = String(now.getHours()).padStart(2, '0') +
                                ':' + String(now.getMinutes()).padStart(2, '0') +
                                ':' + String(now.getSeconds()).padStart(2, '0');
                    let orderslist = {...orders[selectedfila]}
                    let MedioDePagoColtek = 10 //para pago en efectivo
                    if (orderslist.Transferencia > 0 && orderslist.Efectivo === 0){
                        MedioDePagoColtek = 31 //para pago por transferencia
                    }
                    orderslist.MedioDePagoColtek = MedioDePagoColtek
                    if (orderslist.IdCliente === 0){
                        orderslist.Customer = {
                            Consecutivo: 0,
                            IdFerreteria: usD.Cod,
                            Tipo: 0,
                            NitCC: 222222222222,
                            Nombre: 'Consumidor final',
                            Apellido: '',
                            Telefono1: usD.Telefono,
                            Telefono2: 0,
                            Correo: usD.Email,
                            Direccion: usD.Direccion,
                            Barrio: '',
                            FormaDePago: 0,
                            LimiteDeCredito: 0,
                            Nota: '',
                            Fecha: date + ' ' + time,
                            Dv: usD.Dv,
                            ResFiscal: usD.ResFiscal
                        }
                    } else {
                        orderslist.Customer = {
                            Tipo: orderslist.Tipo
                        }
                    }
                    orderslist.RCData = {IdFerreteria: usD.Cod,
                                        CodResponsable: usD.Cod,
                                        Responsable: usD.Contacto,
                                        Folio: orderslist.Folio,
                                        Fecha: date + ' ' + time,
                                        Efectivo: orderslist.Efectivo,
                                        Transferencia: orderslist.Transferencia,
                                        Motivo: "Venta por caja",
                                        Comentarios: '',
                                        Activo: true
                                        }
                    if (orderslist.Customer.Tipo === 0) {
                        //esto es para cedulas
                        orderslist.Customer.TipoPersona = 2
                        orderslist.Customer.NombreTipoPersona = 'Persona Natural'
                        orderslist.Customer.TipoDocumento = 13
                        orderslist.Customer.NombreTipoDocumento = 'Cédula de ciudadanía '
                    } else if (orderslist.Customer.Tipo === 1) {
                        //esto es para NIT
                        orderslist.Customer.TipoPersona = 1
                        orderslist.Customer.NombreTipoPersona = 'Persona Jurídica'
                        orderslist.Customer.TipoDocumento = 31
                        orderslist.Customer.NombreTipoDocumento = 'NIT'
                    }
                    const tokencheck = await valTokenColtek(usD.resColtek.token, usD.token)
                    if (tokencheck.status){
                        //If status is true then only put the token on the orderlist
                        orderslist.tokenColtek = usD.resColtek.token
                    } else if (!tokencheck.status){
                        //If status is false then restart the token to the new one
                        const newUsD = {...usD, resColtek: tokencheck.resColtek}
                        orderslist.tokenColtek = tokencheck.resColtek.token
                        setUsD(newUsD)
                    }
        
                    let NewOrderlist = []
                    //Preparanción de datos para imprimir
                    for (let orden of orderslist.Orden ) {
                        let newOrder = orden
                        newOrder.Cantidad = (orden.CantidadSa - orden.CantidadEn)
                        newOrder.PVenta = orden.VrUnitario
                        if ((orden.CantidadSa - orden.CantidadEn)>0){
                            NewOrderlist.push(newOrder)
                        }
                    }
                    orderslist.Order = NewOrderlist
                    delete orderslist.Orden
                    //Fin de la preparación de datos para imprimir
                    //console.log('orderslist', orderslist);
                    const sendedOrden = await ToRemsionToElectronic(usD.token, orderslist)
                    console.log('sendedOrden: ', sendedOrden)
                    if (sendedOrden.Result.IsValid === 'false') {
                        TheAlert('Ocurrio un error al crear la facura electronica,\n el error es: ' + sendedOrden.Result.Errores)
                        setVisiblevCargando(false)
                    }
                    const electronic = true
                    const print = true
                    if (print) {
                        const usDdata = usD
                        //console.log('Sended orden: ', sendedOrden)
                        // Render the component as HTML
                        const ticketHTML = ReactDOMServer.renderToString(<TicketPrint data={sendedOrden} usD={usDdata} Electronic={electronic}/>);
                        //Send the HTML to Electron for printing
                        window.electron.send('print-ticket', ticketHTML);
                        //setShowTicket(true);
                    }
                    setVisiblevCargando(false)
                    setVisibleEnvioExitoso(true)
                    setTimeout(() => {  
                        setVisibleEnvioExitoso(false)
                    }, 2000);
                    //TheAlert('Se convirtio con exito')
                    getOrdersPerday()
                    setShowReprint(false)
                    setShowToElectronicInvoice(false)
                } catch (error) {
                    TheAlert('Se genero un error al convertir')
                    setVisiblevCargando(false)
                    setShowReprint(false)
                    setShowToElectronicInvoice(false)
                    console.error(error)
                }
            } else {
                rePrint()
                getOrdersPerday()
                setShowReprint(false)
            }
        }

        return (
            <div className='theModalContainer'>
                <div className='theModal-content' style={{width: '35%', height: '30%', position: 'relative'}}>
                    <button className='btn1Stnd' onClick={() => {setShowReprint(false); setShowToElectronicInvoice(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <div className='theModal-body' style={{padding: '15px'}}>
                        <label style={{
                                display: 'block',
                                textAlign: 'center',
                                width: '100%',
                            }}>
                            <strong>
                                {showToElectronicInvoice ? 
                                'Para confirmar la conversión a factura electronica escriba "Confirmar"' : 
                                '¿Desea reimprimir como remisión o desea generar una factura electronica a partir de esta remisión?'}
                            </strong>
                        </label>
                        { showToElectronicInvoice &&
                            <div>
                                <input
                                    type='text'
                                    placeholder='Confirmar'
                                    style={{width: '80%'}}
                                    onChange={(e)=>{setConfirmarConvert(e.target.value)}}/>
                            </div>
                        }
                        { !showToElectronicInvoice &&
                            <div id='ReprintButtons'>
                                <button
                                    className="btnStnd btn1"
                                    style={{backgroundColor: 'Green'}}
                                    onClick={()=>{rePrint(); setShowReprint(false)}}
                                    >
                                    Reimprimir como remisión
                                </button>
                                <button
                                    className="btnStnd btn1"
                                    onClick={()=>{setShowToElectronicInvoice(true); setConfirmarConvert('')}}
                                    >Generar factura electronica.
                                </button>
                            </div>
                        }
                        { showToElectronicInvoice &&
                            <div id='ReprintButtons'>
                                <button
                                    className="btnStnd btn1"
                                    style={{backgroundColor: confirmarConvert.toLowerCase() === 'confirmar' ? 'Green': 'grey'}}
                                    onClick={()=>{printTicket()}}
                                    disabled={confirmarConvert.toLowerCase() !== 'confirmar'}
                                    >
                                    Aceptar
                                </button>
                                <button
                                    className="btnStnd btn1"
                                    onClick={()=>{setShowToElectronicInvoice(false)}}
                                    >Atras
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{display: 'flex', flexDirection: 'column', width: width, height: '90%', position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div
                    className='theModal-body'
                    style={{
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    >
                    <div className='header_Sales_Of_the_Day'>
                        <h2>Ventas del dia</h2>
                    </div>
                    <div
                        className='twoColumnsContainer'
                        style={{
                            height: '92%',
                            display: 'flex',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <div
                                style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px'
                                }}>
                                <label><strong>Buscar: </strong></label>
                                <input
                                    type='text'
                                    placeholder='Buscar ventas del dia'
                                    value={searchText}
                                    onChange={(text)=>searchOrder(text.target.value)}
                                    style={{width: '80%'}}>
                                </input>
                            </div>
                            <div
                                className='Table'
                                style={{height: '80%'}}>
                                <Flatlist
                                    data={orders}
                                    row={RowOrder}
                                    headers={ctHeaders}
                                    selectedRow={selectedfila}
                                    setSelectedRow={setSelectedfila}
                                    Height='100%'
                                    Width='100%'
                                    MaxHeight='100%'
                                />
                            </div>
                            <div style={{margin: '5px'}}>
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
                            <button
                                style={{
                                    height: '40px',
                                    width: '100%',
                                    marging: '5px'
                                }}
                                className="btnStnd btn1"
                                onClick={()=>returnTheOrder(2)}
                                disabled={selectedOrder === null || total === 0? true: false} 
                            >
                                Cancelar venta
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <div className='twoColumnsContainer' >
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
                                                <label>{headerSales.Prefijo === ''? 'Remisión': 'Factura electronica'}</label>
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
                                        <label><strong>Factura:</strong></label>
                                        {headerSales !== null && headerSales.Prefijo !== '' &&
                                            headerSales.Prefijo !== '' && 
                                            <div
                                                className="link-style"
                                                onClick={
                                                    () => openElectronicInvoice()
                                                }>
                                                <span>Ver PDF </span>
                                                <i class="bi bi-filetype-pdf" ></i>
                                            </div>
                                        }
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
                                                    })()}
                                                </label>
                                                 <label>{headerSales.Prefijo + headerSales.FacturaElectronica}</label>
                                            </>
                                        ) : (
                                            <label>Seleccione una venta</label> // Mostrar un mensaje por defecto o dejar el espacio vacío
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className='Table'
                                style={{
                                    paddingBottom: '10px',
                                    height: '70%'
                                }}>
                                <Flatlist
                                    data={selectedOrder}
                                    row={RowOfSelectedOrder}
                                    headers={HeadersOrderSelected}
                                    selectedRow={selectedfilaOrder}
                                    setSelectedRow={setSelectedfilaOrder}
                                    Height='100%'
                                    MaxHeight='100%'
                                />
                            </div>
                            <div>
                                <button
                                    className="btnStnd btn1"
                                    onClick={()=>returnProductM()}
                                    disabled={selectedOrder !== null? false: true}
                                    style={{margin: '5px'}}
                                    >Devolver articulo
                                </button>
                                <label> <strong>Total: $ {Formater(total)} </strong></label>
                            </div>
                            <button
                                style={{
                                    height: '40px',
                                    width: '100%',
                                    marging: '5px'
                                }}
                                className="btnStnd btn1"
                                onClick={()=>{
                                    if (headerSales.Prefijo === ''){
                                        setShowReprint(true)
                                    }
                                    else{
                                        rePrint()
                                    }
                                    }}
                                disabled={selectedOrder !== null? false: true}
                                >Imprimir copia
                            </button>
                        </div>                     
                    </div>
                </div>

                {showReturnModal && <ReturnProduct show={setShowReturnModal} row={orders[selectedfila]} index={selectedfilaOrder} updateOrders={ChangueSelectedOrder} returnP={returnTheOrder}/>}
                {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnTheOrder} />}
                {showReprint && <ConfirmPrintModal/>}
                { visiblevCargando && <ModarChargin/>}
                { visibleEnvioExitoso && <ModarSuccessfulSubmission/>}
            </div>
        </div>
    );
}