import React, {useState, useEffect} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { NewSale } from '../../api';
import './_ConfirmSaleModal.scss';
import { TheAlert } from '../TheAlert';

export const ConfirmSaleModal = ({show, sendSale , folio , orderslist, width='50%', height='50%', totalE}) => {
    const [ efectivo, setEfectivo] = useState(5000)
    const [ transferencia, setTransferencia] = useState(0);
    const [ cambio, setCambio] = useState(0)
    const [ total, setTotal] = useState(0)
    const [ tipoDePago, setTipoDePago] = useState("Efectivo");
    const [ referencia, setReferencia] = useState('');
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
            console.log('Entro en efectivo')
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
        console.log('Total: ', suma)
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

    const chargeTheOrder = () => {
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        /*{
            "Ambiente": 2,
            "Resolucion": {
                "NumeroResolucion": "18760000001",
                "FechaInicio": "2019-01-19",
                "FechaFinal": "2030-01-19",
                "Prefijo": "SETP",
                "NumeroInicial": "990000000",
                "NumeroFinal": "995000000",
                "ClaveTecnica": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c"
            },
            "Factura": "SETP990000001",
            "Fecha": date,
            "Hora": "09:00:00-05:00",
            "Observacion": "Observacion",
            "FormaDePago": "1",
            "MedioDePago": "41",
            "FechaVencimiento": "2019-06-30",
            "CantidadArticulos": orderslist.Order.length,
            "Cliente": {
                "TipoPersona": 1,
                "NombreTipoPersona": "Persona Jurídica",
                "TipoDocumento": 31,
                "NombreTipoDocumento": "Documento de identificación extranjero",
                "Documento": 900108281,
                "Dv": 3,
                "NombreComercial": "OPTICAS GMO COLOMBIA SAS",
                "RazonSocial": "OPTICAS GMO COLOMBIA SAS",
                "Telefono": "123123",
                "Correo": "example@gmail.com",
                "Departamento": {
                "Codigo": 11,
                "Nombre": "Bogota"
                },
                "Ciudad": {
                "Codigo": 11001,
                "Nombre": "Bogota, DC."
                },
                "Direccion": "CARRERA 8 No 20-14/40",
                "ResponsabilidadFiscal": "R-99-PN",
                "DetallesTributario": {
                "Codigo": "01",
                "Nombre": "IVA"
                }
            },
            "Impuestos": {
                "IVA": {
                "Codigo": "01",
                "Total": total - total/1.19,
                "porcentajes": [
                    {
                    "porcentaje": "19",
                    "Base": total/1.19,
                    "Total": total - total/1.19
                    }
                ]
                }
            },
            "Totales": {
                "Bruto": total/1.19,
                "BaseImpuestos": total/1.19,
                "Descuentos": 1000, //Preguntar que es esto
                "Cargos": 1000, //Preguntar que es esto
                "APagar": total,
                "Impuestos": total - total/1.19
            },
            "Articulos": [
                {
                "CodigoInterno": "1111",
                "Nombre": "Articulo 1",
                "Cantidad": 1,
                "PrecioUnitario": 10000,
                "Total": 8403.36,
                "Regalo": "false",
                "DescuentoYRecargos": [
                    {
                    "Recargo": "false",
                    "Observacion": "Recargo por domicilios",
                    "Porcentaje": 10,
                    "Base": 8403.36,
                    "Total": 840.34
                    },
                    {
                    "Recargo": "true",
                    "Observacion": "descuento por cliente vip",
                    "Porcentaje": 10,
                    "Base": 8403.36,
                    "Total": 840.34
                    }
                ],
                "Impuestos": {
                    "IVA": {
                    "Codigo": "01",
                    "Total": 1596.64,
                    "porcentajes": [
                        {
                        "porcentaje": "19",
                        "Base": 8403.36,
                        "Total": 1596.64
                        }
                    ]
                    }
                }
                }
            ]
            }*/

            if (tipoDePago !== 'Efectivo' &&  referencia === '') {
                TheAlert('Debe ingresar una referencia para este tipo de pago')
            } else { if (efectivo === 0 && transferencia === '') {
                TheAlert('Debe ingresar el efectivo o la transferencia para este tipo de pago')} else {
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
                    console.log('orderlist: ', orderslist)
                    NewSale(orderslist)
                    sendSale()
                    show(false)
                }
            }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
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
                                <label>
                                    <input type ='radio'
                                           value ='Efectivo'
                                           name = 'ModoDePago'
                                           defaultChecked = {true}
                                           onChange = {()=>setTipoDePago('Efectivo')}/>
                                    Efectivo
                                </label>
                                <label>
                                    <input type='radio'
                                           value='Transferencia'
                                           name = 'ModoDePago'
                                           onChange = {()=>setTipoDePago('Transferencia')}/>
                                    Transferencia
                                </label>
                                <label>
                                    <input type='radio'
                                           value='Mixto'
                                           name = 'ModoDePago'
                                           onChange = {()=>setTipoDePago('Mixto')}/>
                                    Mixto
                                </label>
                            </div>
                            <div className='Rows'>
                                <div className='column1'>
                                    <label>Total:</label>
                                </div>
                                <div className='column2'>
                                    <label>$ {Formater(total)}</label>
                                </div>
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
                        <div className='menuOptions'>
                            <div>
                                <button className="btnStnd btn1" onClick={()=>chargeTheOrder()}>Solo cobrar</button>
                            </div>
                            <div>
                                <button className="btnStnd btn1" onClick={()=>{}}>Cobrar e imprimir</button>
                            </div>
                            <div>
                                <label>Total de articulos:</label>
                            </div>
                            <div>
                                <label>{orderslist.Order.length}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}