import React, {useState, useEffect} from 'react';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist } from '../../Components';
import './_SalesOfTheDay.scss';
import jsonTest from '../../sales_per_day.json';
import { SalesPerDay } from '../../api';

export const SalesOfTheDay = ({show, orderslist, width='70%', height='80%'}) => {
    const [ paga, setPaga] = useState(0);
    const [ cambio, setCambio] = useState(0);
    const [ total, setTotal] = useState(0);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ selectedfilaOrder, setSelectedfilaOrder] = useState(0);
    const [ selectedOrder, setSelectedOrder] = useState(null);
    const [ orders, setOrders ] = useState([]);
    const [ headerSales, setHeaderSales ] = useState(null);
    const { setSection, setSomeData, usD } = useTheContext();

    const getOrdersPerday = async() => {
        const response = await SalesPerDay({
            'IdFerreteria' : usD.Cod,
            'Fecha': '2024-04-07'
        });
        setOrders(response);
        console.log(response);
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
    }, [])

    useEffect(() => {
        sumarTotal()
    }, [selectedOrder])

    const ChangueSelectedOrder = (item) => {
        setHeaderSales(item);
        setSelectedOrder(item.Orden)
        console.log(item.Orden);
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
            suma += item.VrUnitario * item.Cantidad
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
            defaultWidth: 131,
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
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: 300,
            type: 'text',
        },
        ,
        {
            header: 'Vr.Unitario',
            key: 'vrUnitario',
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


    const RowOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        return (
                <>
                    <td style={{width: columnsWidth[0]}} onClick={()=>ChangueSelectedOrder(item)}>
                        <label>{item.Consecutivo}</label>
                    </td>
                    <td style={{width: columnsWidth[1]}} onClick={()=>ChangueSelectedOrder(item)}>
                        <label>{item.Folio}</label>
                    </td>
                    <td style={{width: columnsWidth[2]}} onClick={()=>ChangueSelectedOrder(item)}>
                        <label>{item.Nombre}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}} onClick={()=>ChangueSelectedOrder(item)}>
                        <label>{item.Fecha.split('T')[1].split('.')[0]}</label>
                    </td>
                    <td style={{width: columnsWidth[4]}} onClick={()=>ChangueSelectedOrder(item)}>
                        <label>${Formater(item.Total)}</label>
                    </td>
                </>
        );
    };

    const RowOfSelectedOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        const rowIndex = index;
        return (
                <>
                    <td style={{width: columnsWidth[0]}}>
                        <label>{item.Cantidad}</label>
                    </td>
                    <td style={{width: columnsWidth[1]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{width: columnsWidth[2]}}>
                        <label>${Formater(item.VrUnitario)}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>${Formater(item.Cantidad * item.VrUnitario)}</label>
                    </td>
                </>
        );
    };

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
                            <button className="btnStnd btn1" onClick={()=>{}}>Devolver articulo</button>
                            <div>
                                <label>Total:</label>
                                <label>${Formater(total)}</label>
                                <label>Pago con:</label>
                                <label>Forma de pago:</label>
                                <label>$ Formater</label>
                            </div>
                        </div>
                        <button className="btnStnd btn1" onClick={()=>{}}>Cancelar venta</button>
                        <button className="btnStnd btn1" onClick={()=>{}}>Imprimir copia</button>
                    </div>
                </div>
            </div>
        </div>
    );
}