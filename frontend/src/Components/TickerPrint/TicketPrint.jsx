import React from 'react';
import './_TicketPrint.scss';
import QRCode from 'react-qr-code';


export const TicketPrint = ({data, usD, Electronic = false}) => {

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
    console.log('data', data)
    data.Order.forEach(detail => {
        total += detail.PVenta * detail.Cantidad;
        base += (detail.PVenta * detail.Cantidad)/(1+(detail.Iva/100));
        iva += base * (detail.Iva/100)//((detail.Pventa * detail.Cantidad)/(1+(detail.Iva/100))) * (detail.Iva/100);
    });

    let CufeQR = '';

    if (Electronic) {
        CufeQR = 'https://catalogo-vpfe.dian.gov.co/document/ShowDocumentToPublic/' + data.Result.CufeCude;
    }

    return (
        <div id="ticket-content" style={{ marginLeft: -7, width: '243px'}}>
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
            {Electronic &&
                <div style={{textAlign: 'Center'}}>
                    <label><strong>Factura electronica de venta</strong></label>
                </div>
            }
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
            <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '15px'}}>
                <div id='Colt1'>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Total:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Efectivo:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Transferencia:</strong></label>
                    <label style={{display: 'block', fontWeight: 'bold'}}><strong>Cambio:</strong></label>
                </div>
                <div id='Colt2'>
                    <label style={{display: 'block'}}>${Formater(total.toFixed(2))}</label>
                    <label style={{display: 'block'}}>${Formater(parseFloat(data.RCData.Efectivo).toFixed(2))}</label>
                    <label style={{display: 'block'}}>${Formater(parseFloat(data.RCData.Transferencia).toFixed(2))}</label>
                    <label style={{display: 'block'}}>${Formater(parseFloat(data.RCData.Efectivo).toFixed(2)-total.toFixed(2))}</label>
                </div>
            </div>
            {Electronic && 
            <div>
                <div>
                    <div style={{textAlign: 'Center'}}>
                        <label style={{display: 'block'}}><strong>Impuestos</strong></label>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '15px'}}>
                        <div>
                            <label style={{display: 'block'}}><strong>Total bruto:</strong></label>
                            <label style={{display: 'block'}}><strong>Iva:</strong></label>
                        </div>
                        <div>
                            <label style={{display: 'block'}}>${Formater(base.toFixed(2))}</label>
                            <label style={{display: 'block'}}>${Formater((total - base).toFixed(2))}</label>
                        </div>
                    </div>
                </div>
                <div>
                    <label><strong>Factura: </strong> {data.Result.Codigo}</label>
                </div>
                <div style={{textAlign: 'Center'}}>
                    <label style={{display: 'block'}}><strong>CUFE</strong></label>
                    <label style={{display: 'block', width: '90%',whiteSpace: 'normal', wordWrap: 'break-word'}}>{data.Result.CufeCude}</label>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "80%" }}
                        value={CufeQR}
                        viewBox={`0 0 230 230`}
                    />
                    <label style={{display: 'block'}}>Resolución con fecha de expedición</label>
                    <label style={{display: 'block'}}>Factura generada por COLTEK</label>
                    <label style={{display: 'block'}}>www.coltek.com.co</label>
                </div>
            </div>}
            <div style={{textAlign: 'Center'}}>
                <label style={{display: 'block'}}>En alianza con</label>
                <label style={{display: 'block'}}>www.sivar.com.co</label>
                {!Electronic && 
                    <label style={{display: 'block'}}><strong>Este ticket No constituye una factura electronica</strong></label>
                }
            </div>
        </div>
    )
}
