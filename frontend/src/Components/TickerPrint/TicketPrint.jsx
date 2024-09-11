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
        <div id="ticket-content" style={{ marginLeft: -6, width: '243px'}}>
            <div style={{textAlign: 'Center'}}>
                <label style={{display: 'block'}}><strong>{usD.Ferreteria}</strong></label>
                <label style={{display: 'block'}}><strong>{usD.Cel}</strong></label>
                <label style={{display: 'block'}}><strong>{usD.Direccion}</strong></label>
                <label style={{display: 'block'}}><strong>{usD.Email}</strong></label>
                <label style={{display: 'block'}}><strong>Nit:</strong></label>
            </div>
            <div>
                <label style={{display: 'block'}}><strong>Datos del cliente</strong></label>
                <label style={{display: 'block'}}><strong>Fecha:</strong> {data.RCData.Fecha}</label>
                <label style={{display: 'block'}}><strong>C.C/Nit:</strong> {data.Customer.NitCC}</label>
                <label style={{display: 'block'}}><strong>Cliente:</strong> {data.Customer.Nombre + data.Customer.Apellido}</label>
                <label style={{display: 'block'}}><strong>E-Mail:</strong> {data.Customer.Correo}</label>
                <label style={{display: 'block'}}><strong>Telefono:</strong> {data.Customer.Telefono1}</label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd' }}>Can</th>
                        <th style={{ border: '1px solid #ddd', padding: '0px 18px'}}>Descripción</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Vr.Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Order.map((item) => (
                        <tr key={item.id}>
                            <td>{item.Cantidad}</td>
                            <td style={{width: '8px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{item.Descripcion}</td>
                            <td>{Formater((item.Cantidad * item.PVenta).toFixed(2))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div id='Colt1'>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Total:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Efectivo:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Transferencia:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Cambio:</strong></label>
                </div>
                <div id='Colt2'>
                    <label style={{display: 'block'}}>${Formater(total)}</label>
                    <label style={{display: 'block'}}>${Formater(data.RCData.Efectivo)}</label>
                    <label style={{display: 'block'}}>${Formater(data.RCData.Transferencia)}</label>
                    <label style={{display: 'block'}}>${Formater(data.RCData.Efectivo)}</label>
                </div>
            </div>
            <div style={{textAlign: 'Center'}}>
                <label style={{display: 'block'}}>En alianza con</label>
                <label style={{display: 'block'}}>www.sivar.com.co</label>
                <label style={{display: 'block'}}><strong>Este ticket No constituye una factura electronica</strong></label>
            </div>
        </div>
    )
}
