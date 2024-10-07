import React, {useState, useEffect} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { NewSale } from '../../api';
import { TicketPrint } from '../TickerPrint';
import ReactDOMServer from 'react-dom/server';
import './_ConfirmSaleModal.scss';
import { TheAlert } from '../TheAlert';
import '../../Fonts_CSS/PayIcon.css'

export const ConfirmSaleModal = ({show, sendSale , folio , orderslist, width='50%', height='50%', totalE}) => {
    const [ efectivo, setEfectivo] = useState(5000)
    const [ transferencia, setTransferencia] = useState(0);
    const [ cambio, setCambio] = useState(0)
    const [ total, setTotal] = useState(0)
    const [ tipoDePago, setTipoDePago] = useState("Efectivo");
    const [ referencia, setReferencia] = useState('');
    const [ showTicket, setShowTicket] = useState(false)
    const [ electronic, setElectronic ] = useState(true);
    const { setSection, setSomeData, usD } = useTheContext();

    useEffect(() => {
        if (tipoDePago === 'Efectivo') {
            if (efectivo >= total) {
                setCambio(efectivo - total)
            } else {
                setCambio(0)
            }
        } else if (tipoDePago === 'Transferencia') {
            if (transferencia >= total) {
                setCambio(transferencia - total)
            } else {
                setCambio(0)
            }
        } else if (tipoDePago === 'Mixto') {
            if (efectivo + transferencia >= total) {
                setCambio(efectivo + transferencia - total)
            } else {
                setCambio(0)
            }
        }
    }, [efectivo, transferencia])

    useEffect(() => {
        if (tipoDePago === 'Efectivo') {
            setEfectivo(total)
            setTransferencia(0)
            setCambio(efectivo - total)
        } else if (tipoDePago === 'Transferencia') {
            setEfectivo(0)
            setTransferencia(total)
            setCambio(transferencia - total)
        } else if (tipoDePago === 'Mixto') {
            setEfectivo(total)
            setTransferencia(0)
            setCambio(efectivo + transferencia - total)
        }
    }, [tipoDePago])

    useEffect(() => {
        let suma = 0;
        //console.log('orderslist.Order: ' + JSON.stringify(orderslist.Order))
        if (orderslist.Order && orderslist.Order.length > 0) {orderslist.Order.forEach((item, index) => {
            suma += item.PVenta * item.Cantidad
        })}
        setTotal(suma)
        setEfectivo(suma)
        console.log(usD)
    }, [])

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const sumarTotal = () => {
        let suma = 0;
        //console.log('orderslist.Order: ' + JSON.stringify(orderslist.Order))
        if (orderslist.Order && orderslist.Order.length > 0) {orderslist.Order.forEach((item, index) => {
            suma += item.PVenta * item.Cantidad
        })}
        setTotal(suma)
    };

    const chargeTheOrder = async(print) => {
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        if (tipoDePago !== 'Efectivo' &&  referencia === '') {
            TheAlert('Debe ingresar una referencia para este tipo de pago')
        } else if (efectivo === 0 && transferencia === '') {
            TheAlert('Debe ingresar el efectivo o la transferencia para este tipo de pago')
        } else {
            console.log(usD)
            if (Object.keys(orderslist.Customer).length === 0){
                orderslist.Customer = {
                    Consecutivo: 0,
                    IdFerreteria: usD.Cod,
                    Tipo: 0,
                    NitCC: 222222222222,
                    Nombre: 'Consumidor final',
                    Apellido: '',
                    Telefono1: 0,
                    Telefono2: 0,
                    Correo: usD.Email,
                    Direccion: '',
                    Barrio: '',
                    FormaDePago: 0,
                    LimiteDeCredito: 0,
                    Nota: '',
                    Fecha: date + ' ' + time
                }
            }
            orderslist.RCData = {IdFerreteria: usD.Cod,
                                CodResponsable: usD.Cod,
                                Responsable: usD.Contacto,
                                Folio: folio,
                                Fecha: date + ' ' + time,
                                Referencia: referencia,
                                MedioDePago: tipoDePago,
                                Efectivo: efectivo,
                                Transferencia: transferencia,
                                Motivo: "Venta por caja",
                                Comentarios: '',
                                Activo: true
                                }
            orderslist.Electronic = electronic
            console.log('orderlist: ', orderslist)
            const sendedOrden = await NewSale(orderslist)
            console.log('sendedOrden: ', sendedOrden)
            if (print) {
                const usDdata = usD
                //console.log('Sended orden: ', sendedOrden)
                // Render the component as HTML
                const ticketHTML = ReactDOMServer.renderToString(<TicketPrint data={sendedOrden} usD={usDdata} Electronic={electronic}/>);
                //Send the HTML to Electron for printing
                window.electron.send('print-ticket', ticketHTML);
                //setShowTicket(true);
            }
            sendSale()
            show(false)
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    <div className='header_confirm_sale'>
                        <h2>Cliente:</h2>
                        <h2>{orderslist.Customer.Nombre + ' ' + orderslist.Customer.Apellido}</h2>
                    </div>
                    <div className='content'>
                        <div className='change'>
                            <div>
                                <h1 className='total'>$ {Formater(total)}</h1>
                            </div>
                            <div className='op'> 
                                <label>
                                    <input type ='radio'
                                        value ='Efectivo'
                                        name = 'ModoDePago'
                                        defaultChecked = {true}
                                        onChange = {()=>setTipoDePago('Efectivo')}/>
                                    <i class="bi bi-cash-coin"></i>
                                    {/*<img src={require('../../Assets/PNG/efectivo.png')  } />*/}
                                    Efectivo
                                </label>
                                <label>
                                    <input type='radio'
                                        value='Transferencia'
                                        name = 'ModoDePago'
                                        onChange = {()=>setTipoDePago('Transferencia')}/>
                                        <i class="Picon-transferencia"></i>
                                        {/*<img src={require('../../Assets/PNG/transferencia.png')} />*/}
                                    Transferencia
                                </label>
                                <label>
                                    <input type='radio'
                                        value='Mixto'
                                        name = 'ModoDePago'
                                        onChange = {()=>setTipoDePago('Mixto')}/>
                                        <i class="Picon-mixto"></i>
                                        {/*<img src={require('../../Assets/PNG/mixto.png')} />*/}
                                    Mixto
                                </label>
                            </div>
                            <div className='Rows'>
                                {tipoDePago === 'Efectivo' || tipoDePago === 'Mixto' ? (
                                    <>
                                        <div className='column1'>
                                            <label>Efectivo:</label>
                                        </div>
                                        <div className='column2'>
                                            <TheInput
                                                numType='real'
                                                val={efectivo}
                                                onchange={(e)=>setEfectivo(e)}
                                            />
                                        </div>
                                    </>
                                ): null}
                                {tipoDePago === 'Transferencia' || tipoDePago === 'Mixto' ? (
                                    <>
                                        <div className='column1'>
                                            <label>Transferencia:</label>
                                        </div>
                                        <div className='column2'>
                                            <TheInput
                                                numType='real'
                                                val={transferencia}
                                                onchange={(e)=>setTransferencia(e)}
                                            />
                                        </div>
                                        <div className='column1'>
                                            <label>Referencia:</label>
                                        </div>
                                        <div className='column2'>
                                            <input
                                                type='text'
                                                value={referencia}
                                                onChange={(e)=>setReferencia(e.target.value)}
                                            />
                                        </div>
                                    </>
                                ): null}
                                <div className='column1'>
                                    <label>Cambio:</label>
                                </div>
                                <div className='column2'>
                                    <label>$ {Formater(cambio)}</label>
                                </div>
                            </div>
                        </div>
                        <div id='ButtonsOptions'>
                            <label>
                                <input type ='radio'
                                    value ='Remision'
                                    name = 'TipoDeVenta'
                                    defaultChecked = {true}
                                    onChange = {(e)=>setElectronic(e.target.value)}/>
                                Remisión
                            </label>
                            <label>
                                <input type ='radio'
                                    value ='FElectronica'
                                    name = 'TipoDeVenta'
                                    defaultChecked = {false}
                                    onChange = {(e)=>setElectronic(e.target.value)}/>
                                Factura
                            </label>
                            <div className='btn'>
                                <button className="btnStnd btn1" onClick={()=>chargeTheOrder(false)}>Solo cobrar</button>
                            </div>
                            <div  className='btn'>
                                <button className="btnStnd btn1" onClick={()=>chargeTheOrder(true)}>Cobrar e imprimir</button>
                            </div>
                            <div className='art'>
                                <label>Total de articulos:</label>
                                <label>{orderslist.Order.length}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showTicket && 
                <div className="theModalContainer">
                    <div className="theModal-content">
                        <TicketPrint data={orderslist} usD={usD} Electronic={electronic}/>
                    </div>
                </div>
            }
        </div>
    );
}