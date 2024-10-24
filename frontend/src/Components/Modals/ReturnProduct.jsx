import React, { useState, useEffect} from 'react';
import './_ReturnProduct.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { UserConfirm } from './UserConfirm';
import { useTheContext } from '../../TheProvider';
import { validateUser, NewMoneyFlow, NewOutput } from '../../api';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const ReturnProduct = ({show, row, updateOrders, index, width='50%', height='40%'}) => {
    const [ cantidad, setCantidad ] = useState(0);
    const [ value, setValue ] = useState(0);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ comentarios, setComentarios ] = useState('');
    const { setSection, setSomeData, usD } = useTheContext();

    const returnP = async() => {
        let Cliente = {
            "TipoPersona": 1,
            "NombreTipoPersona": "Persona Jurídica",
            "TipoDocumento": 31,
            "NombreTipoDocumento": "Documento de identificación extranjero",
            "Documento": 222222222222,
            "Dv": 3,
            "NombreComercial": 'Consumidor final',
            "RazonSocial": 'Consumidor final',
            "Telefono": usD.Telefono,
            "Correo": usD.Email,
            "Departamento": {
            "Codigo": 11,
            "Nombre": "Bogota"
            },
            "Ciudad": {
            "Codigo": 11001,
            "Nombre": "Bogota, DC."
            },
            "Direccion": usD.Direccion,
            "ResponsabilidadFiscal": "R-99-PN",
            "DetallesTributario": {
            "Codigo": "01",
            "Nombre": "IVA"
            }
        }
        if (row.IdCliente === 0) {
            Cliente = {
                "TipoPersona": 1,
                "NombreTipoPersona": "Persona Jurídica",
                "TipoDocumento": 31,
                "NombreTipoDocumento": "Documento de identificación extranjero",
                "Documento": row.NitCC,
                "Dv": 3,
                "NombreComercial": row.Nombre + ' ' + row.Apellido,
                "RazonSocial": row.Nombre + ' ' + row.Apellido,
                "Telefono": row.Telefono1,
                "Correo": row.Email,
                "Departamento": {
                "Codigo": 11,
                "Nombre": "Bogota"
                },
                "Ciudad": {
                "Codigo": 11001,
                "Nombre": "Bogota, DC."
                },
                "Direccion": row.Direccion,
                "ResponsabilidadFiscal": "R-99-PN",
                "DetallesTributario": {
                "Codigo": "01",
                "Nombre": "IVA"
                }
            }
        }
        /*
        
        {
        "Ambiente": 2,
        "Referencia": {
            "NumeroResolucion": "18760000001",
            "Factura": row.FacturaElectronica,
            "Cufe": row.Cufe,
            "Fecha": "2022-11-20",
            "Hora": "09:00:00-05:00",
            "Prefijo": "NC",
            "Tipo_Reclamo": 1,
            "Descripcion_Reclamo": "Anulacion de Factura"
        },
        "Factura": row.FacturaElectronica,
        "Fecha": "2022-11-20",
        "Hora": "09:00:00-05:00",
        "Observacion": "Observacion",
        "FormaDePago": "1",
        "MedioDePago": "41",
        "FechaVencimiento": "2019-06-30",
        "CantidadArticulos": 1,
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
            "Correo": "yordirico93@gmail.com",
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
            "Total": 1596.64,
            "porcentajes": [
                {
                "porcentaje": "19",
                "Base": 8403.36,
                "Total": 1596.64
                }
            ]
            }
        },
        "Totales": {
            "Bruto": 8403.36,
            "BaseImpuestos": 8403.36,
            "Descuentos": 840.34,
            "Cargos": 840.34,
            "APagar": 10000,
            "Impuestos": 1596.64
        
        */
        try {
            const now = new Date();
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.toISOString().split('T')[0];
            // Obtener la hora en formato HH:MM:SS
            const time = now.toTimeString().split(' ')[0];
            const dataToSendMoneyFlow ={
                ConsecutivoCV: row.Consecutivo,
                IdFerreteria: usD.Cod,
                Fecha: date + ' ' + time,
                Referencia: 0,
                Efectivo: value,
                Transferencia: 0,
                Motivo: 'Devolución mercancia',
                Comentarios: comentarios,
                TipoDeFlujo: 1,
                Activo: true
            }
            const dataToSendProduct ={
                CodInterno: 0,
                IdFerreteria: usD.Cod,
                ConsecutivoProd: row.Orden[index].ConsecutivoProd,
                Cantidad: cantidad,
                Cod: row.Orden[index].Cod,
                Descripcion: row.Orden[index].Descripcion,
                PCosto: row.Orden[index].VrCosto,
                PCostoLP: 0,
                Fecha: date + ' ' + time,
                Iva: row.Orden[index].Iva,
                CodResponsable: usD.Cod,
                Responsable: usD.Contacto,
                Motivo: 'Devolución mercancia',
                ConsecutivoCompra: row.Consecutivo,
                Medida: row.Orden[index].Medida,
                UMedida: row.Orden[index].UMedida,
            }
            NewMoneyFlow(dataToSendMoneyFlow)
            NewOutput(dataToSendProduct)
            updateOrders()
            show(false)
            TheAlert('Se devlcio el articulo correctamente')
        } catch (error) {
            console.error('Error al realizar la devolución:', error);
        }
    }

    const handleCantidad = (Number) => {
        let valueNumber = Number;
        if (Number === '' || Number < 0) {
            valueNumber = 0;
            setCantidad('');
        } else if (Number > row.Orden[index].CantidadSa - row.Orden[index].CantidadEn) {
            valueNumber = row.Orden[index].CantidadSa - row.Orden[index].CantidadEn;
            setCantidad(valueNumber);
        } else {
            valueNumber = Number
            setCantidad(valueNumber);
        }
        setValue(valueNumber * row.Orden[index].VrUnitario);
        console.log('valueNumber: ' + valueNumber);
    };

    useEffect(() => {
        console.log('datos del row: ', row)
    }, [])

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    {row.Cufe === ''?
                        <div style={{background: `linear-gradient(to right, #193773, #FFFFFF)` , color: '#FFFFFF'}}>
                            <h3>Devolución de artículo</h3>
                        </div>
                        :
                        <div style={{background: `linear-gradient(to right, #193773, #FFFFFF)` , color: '#FFFFFF'}}>
                            <h3>Nota crédito</h3>
                        </div>
                    }
                    <div className='Rows' style={{margin: '15px'}}>
                        <label className='Subtittle'>Cod:</label>
                        <label>{row.Orden[index].Cod}</label>
                        <label className='Subtittle'>Descripción:</label>
                        <label>{row.Orden[index].Descripcion}</label>
                        <label className='Subtittle'>Valor unitario:</label>
                        <label>$ {Formater(row.Orden[index].VrUnitario)}</label>
                        <label className='Subtittle'>Cantidad actual:</label>
                        <label>{row.Orden[index].CantidadSa - row.Orden[index].CantidadEn}</label>
                        <label className='Subtittle'>Cantidad a devolver:</label>
                        <TheInput
                            type='real'
                            val={cantidad}
                            onchange={(e)=>handleCantidad(e)}
                            Min = {0}
                            Max = {row.Orden[index].CantidadSa - row.Orden[index].CantidadEn}
                        />
                        <label className='Subtittle'>Motivo</label>
                        <input
                            type="text">
                        </input>
                        <label className='Subtittle'>Valor a devolver:</label>
                        <label>$ {Formater(value)}</label>
                    </div>
                </div>
                <button className='btnStnd btn1' onClick={() => setShowConfirm(true)}>Aceptar</button>
                <button className='btnStnd btn1'>Cancelar</button>
            </div>
            {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnP} />}
        </div>
    );
}