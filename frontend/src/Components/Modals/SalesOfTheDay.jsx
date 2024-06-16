import React, {useState, useEffect} from 'react';
import { TheInput } from '../InputComponent/TheInput';
import { TableComponent, Flatlist } from '../../Components';
import './_SalesOfTheDay.scss';
import jsonTest from '../../sales_per_day.json';

export const SalesOfTheDay = ({show, orderslist, width='70%', height='80%'}) => {
    const [ paga, setPaga] = useState(0);
    const [ cambio, setCambio] = useState(0);
    const [ total, setTotal] = useState(0);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ selectedfilaOrder, setSelectedfilaOrder] = useState(0);
    const [ selectedOrder, setSelectedOrder] = useState(null);
    const [ orders, setOrders ] = useState(jsonTest);
    const [ ordersPerDay, setOrdersPerDay ] = useState(jsonTest);

    useEffect(() => {
        if (paga >= total) {
            setCambio(paga - total)
        } else {
            setCambio(0)
        }
    }, [paga])

    useEffect(() => {
        sumarTotal()
    }, [])

    useEffect(() => {
        Orders()
        console.log(selectedOrder.ticket)
    }, [])

    const ChangueSelectedOrder = (Nticket) => {
        const filteredOrders = orders.filter(order => order.ticket === Nticket);
        setSelectedOrder(filteredOrders)
    }

    const Orders = () => {
        const uniqueTickets = {};
        orders.forEach(order => {
        if (!uniqueTickets[order.ticket]) {
            uniqueTickets[order.ticket] = { ticket: order.ticket, fecha: order.fecha, total: 0};
        }
        uniqueTickets[order.ticket].total += order.Cantidad * order.pVenta;
        });

        const uniqueTicketList = Object.values(uniqueTickets);
        setOrdersPerDay(uniqueTicketList)
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
        if (orderslist && orderslist.length > 0) {orderslist.forEach((item, index) => (
            suma += item.pVenta * item.Cantidad
        ))}
        setTotal(suma)
    };

    const ctHeaders = [
        {
            header: 'N° venta',
            key: 'NVenta',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Art',
            key: 'Art',
            defaultWidth: 131,
            type: 'text',
        },
        ,
        {
            header: 'Hora',
            key: 'hora',
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
        const rowIndex = index;
        return (
                <div onClick={()=>ChangueSelectedOrder(item.ticket)}>
                    <td style={{width: columnsWidth[0]}}>
                        <label>{item.ticket}</label>
                    </td>
                    <td style={{width: columnsWidth[1]}}>
                        <label>Art</label>
                    </td>
                    <td style={{width: columnsWidth[2]}}>
                        <label>Hora</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>${Formater(item.total)}</label>
                    </td>
                </div>
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
                        <label>${Formater(item.pVenta)}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>${Formater(item.Cantidad * item.pVenta)}</label>
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
                                    data={ordersPerDay}
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
                                    <lavel>Cajero:</lavel>
                                    <label>Cliente:</label>
                                    <label>Fecha:</label>
                                </div>
                                <div className='Col'>
                                    <label>{selectedOrder.ticket}</label>
                                    <label>{selectedOrder.ticket}</label>
                                    <label>{selectedOrder.ticket}</label>
                                    <label>{selectedOrder.ticket}</label>
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
                                <label>Pago con:</label>
                                <label>Forma de pago:</label>
                                <lavel>$ Formater</lavel>
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