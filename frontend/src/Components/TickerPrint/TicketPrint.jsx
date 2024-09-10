import React from 'react';
import './_TicketPrint.scss';

export const TicketPrint = ({data, usD}) => {

    const Formater = (number) =>{
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };
    //For the total
    let total = 0;
    let base = 0;
    let iva = 0;

    data.Order.forEach(detail => {
        total += detail.PVenta * detail.Cantidad;
        base += (detail.PCosto * detail.Cantidad)/(1+detail.Iva);
        iva += ((detail.PCosto * detail.Cantidad)/(1+detail.Iva)) * detail.Iva;
    });

    return (
        <div id="ticket-content">
            <div>
                <label>{usD.Nombre}</label>
                <label>Nit:</label>
            </div>
            <label>Datos del cliente</label>
            <label>Fecha: {data.RCData.Fecha}</label>
            <label>C.C/Nit: {data.Customer.NitCC}</label>
            <label>Cliente: {data.Customer.Nombre + data.Customer.Apellido}</label>
            <label>E-Mail: {data.Customer.Correo}</label>
            <label>Telefono: {data.Customer.Telefono1}</label>
            <table>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Can</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Base</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Iva</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Order.map((item) => (
                        <tr key={item.id}>
                            <td>{item.Cantidad}</td>
                            <td>{item.Descripcion}</td>
                            <td>{Formater((item.PVenta * item.Cantidad)/(1+item.Iva))}</td>
                            <td>{Formater(((item.PVenta * item.Cantidad )/(1+item.Iva))*item.Iva)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label>Total: {Formater(total)}</label>
            <label>Efectivo: {Formater(data.RCData.Efectivo)}</label>
            <label>Transferencia: {Formater(data.RCData.Transferencia)}</label>
            <label>Cambio: {Formater(data.RCData.Efectivo)}</label>
        </div>
    )
}
