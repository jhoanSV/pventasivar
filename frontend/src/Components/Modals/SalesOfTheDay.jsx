import React, {useState, useEffect, useRef} from 'react';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist } from '../../Components';
import './_SalesOfTheDay.scss';
import jsonTest from '../../sales_per_day.json';
import { SalesPerDay, CancelTheSale } from '../../api';
import { ReturnProduct } from './ReturnProduct';
import { UserConfirm } from './UserConfirm';


export const SalesOfTheDay = ({show, orderslist, width='90%', height='80%'}) => {
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
    const { setSection, setSomeData, usD } = useTheContext();
    // for the tables of the order and the selected order
    const isEditingRef = useRef(false);
    const ordersRef = useRef([]);
    const selectedfilaRef = useRef(0);
    const selectedOrderRef = useRef([]);
    const selectedfilaOrderRef = useRef(0);
    // for modals
    const [showReturnModal, setShowReturnModal] = useState(false);

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
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        const response = await SalesPerDay({
            'IdFerreteria' : usD.Cod,
            'Fecha': dateSearch.toISOString().split('T')[0]
        });
        setOrders(response);
        ordersRef.current = response
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

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

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
        console.log(item)
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
        const rowIndex = index;
        const styles = {
            textDecoration: item.CantidadSa - item.CantidadEn === 0 ? 'line-through' : 'none',
            color: item.CantidadSa - item.CantidadEn === 0 ? '#999999' : '#000000',
        };
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}} onClick={()=>isEditingRef.current = true}>
                        <label>{(item.CantidadSa - item.CantidadEn) !== 0 ? item.CantidadSa - item.CantidadEn: item.CantidadSa}</label>
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
        console.log(fila);
        if (fila.CantidadSa - fila.CantidadEn === 0) {
            alert('No se puede devolver un producto que ya ha sido vendido completamente.')
        } else {
            setShowReturnModal(true)
        }
    }

    const returnTheOrder = () => {
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        const fila = {...orders[selectedfila]}
        let suma = 0
        fila.Orden.forEach(valor => {
            suma += valor.VrUnitario * (valor.CantidadSa - valor.CantidadEn);
        });
        fila.FechaActual = date + ' ' + time
        fila.Total = suma
        fila.IdFerreteria = usD.Cod
        fila.Responsable = usD.Contacto
        CancelTheSale(fila)
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    <div className='header_confirm_sale'>
                        <h2>Buscar ventas del dia</h2>
                    </div>
                    <div className='twoColumnsContainer'>
                        <div>
                            <div>
                                <input type='text' placeholder='Buscar ventas del dia'>
                                </input>
                            </div>
                            <div className='Table'>               
                                <Flatlist
                                    data={orders}
                                    row={RowOrder}
                                    headers={ctHeaders}
                                    selectedRow={selectedfila}
                                    setSelectedRow={setSelectedfila}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='data_of_sale'>
                                <div className='Col'>
                                    <label>Venta:</label>
                                    <label>Cliente:</label>
                                    <label>Hora:</label>
                                </div>
                                <div className='Col'>
                                    {headerSales !== null ? (
                                        <>
                                            <label>{headerSales.Consecutivo}</label>
                                            <label>{headerSales.Nombre + ' ' + headerSales.Apellido}</label>
                                            <label>{headerSales.Fecha.split('T')[1].split('.')[0]}</label>
                                        </>
                                    ) : (
                                        <label>Seleccione una venta</label> // Mostrar un mensaje por defecto o dejar el espacio vacío
                                    )}
                                </div>
                            </div>
                            <div className='Table'>
                                <Flatlist
                                    data={selectedOrder}
                                    row={RowOfSelectedOrder}
                                    headers={HeadersOrderSelected}
                                    selectedRow={selectedfilaOrder}
                                    setSelectedRow={setSelectedfilaOrder}
                                />
                            </div>
                            <button className="btnStnd btn1" onClick={()=>returnProductM()}>Devolver articulo</button>
                            <label>Total:</label>
                            <label>${Formater(total)}</label>
                            
                        </div>
                        <button className="btnStnd btn1" onClick={()=>returnTheOrder()}>Cancelar venta</button>
                        <button className="btnStnd btn1" onClick={()=>{}}>Imprimir copia</button>
                    </div>
                </div>

                {showReturnModal && <ReturnProduct show={setShowReturnModal} row={orders[selectedfila]} index={selectedfilaOrder} updateOrders={ChangueSelectedOrder}/>}
                {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnTheOrder} />}
            </div>
        </div>
    );
}