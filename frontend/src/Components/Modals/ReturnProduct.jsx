import React, { useState, useEffect} from 'react';
import './_ReturnProduct.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { UserConfirm } from './UserConfirm';
import { useTheContext } from '../../TheProvider';
import { validateUser, NewMoneyFlow, NewOutput } from '../../api';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const ReturnProduct = ({show, row, updateOrders, index, width='50%', height='40%', returnP}) => {
    const [ cantidad, setCantidad ] = useState(0);
    const [ value, setValue ] = useState(0);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ comentarios, setComentarios ] = useState('');
    const { setSection, setSomeData, usD } = useTheContext();

    /*const returnP = async(Tipo_Reclamo) => {
        let Cliente = {
            "TipoPersona": 1,
            "NombreTipoPersona": "Persona Jurídica",
            "TipoDocumento": 31,
            "NombreTipoDocumento": "Documento de identificación extranjero",
            "Documento": 222222222222,
            "Dv": usD.Dv,
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
            const dataToSendOutput = [{
                CantidadEn: 0,
                CantidadSa: cantidad,
                Cod: row.Orden[index].Cod,
                ConsecutivoProd: row.Orden[index].ConsecutivoProd,
                ConsecutivoVenta: row.Orden[index].ConsecutivoVenta,
                Descripcion: row.Orden[index].Descripcion,
                Iva: row.Orden[index].Iva,
                Medida: row.Orden[index].Medida,
                UMedida: row.Orden[index].UMedida,
                VrCosto: row.Orden[index].VrCosto,
                VrUnitario: row.Orden[index].VrUnitario
            }]
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
            //NewMoneyFlow(dataToSendMoneyFlow)
            //NewOutput(dataToSendProduct)
            updateOrders()
            show(false)
            TheAlert('Se devlcio el articulo correctamente')
        } catch (error) {
            console.error('Error al realizar la devolución:', error);
        }
    }*/

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
                <button className='btnStnd btn1' onClick={() => returnP(1,cantidad)}>Aceptar</button>
                <button className='btnStnd btn1' onClick={() => show(false)}>Cancelar</button>
            </div>
            {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnP} />}
        </div>
    );
}