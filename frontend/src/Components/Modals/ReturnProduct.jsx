import React, { useState, useEffect} from 'react';
import './_ReturnProduct.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { UserConfirm } from './UserConfirm';
import { useTheContext } from '../../TheProvider';
import { validateUser, NewMoneyFlow, NewOutput } from '../../api';

export const ReturnProduct = ({show, row, updateOrders, index, width='50%', height='40%'}) => {
    const [ cantidad, setCantidad ] = useState(0);
    const [ value, setValue ] = useState(0);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ comentarios, setComentarios ] = useState('');
    const { setSection, setSomeData, usD } = useTheContext();

    const returnP = async() => {
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
    }

    const handleCantidad = (Number) => {
        let valueNumber = Number;
        if (Number === '' || Number < 0) {
            valueNumber = 0;
            setCantidad('');
        } else if (Number > row.Orden[index].Cantidad) {
            valueNumber = row.Orden[index].Cantidad;
            setCantidad(valueNumber);
        } else {
            valueNumber = Number
            setCantidad(valueNumber);
        }
        setValue(valueNumber * row.Orden[index].VrUnitario);
        console.log('valueNumber: ' + valueNumber);
    };

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='Rows'>
                    <label>Cod:</label>
                    <label>{row.Orden[index].Cod}</label>
                    <label>Descripción:</label>
                    <label>{row.Orden[index].Descripcion}</label>
                    <label>Valor unitario:</label>
                    <label>$ {Formater(row.Orden[index].VrUnitario)}</label>
                    <label>Cantidad a devolver:</label>
                    <TheInput
                        type='real'
                        val={cantidad}
                        onchange={(e)=>handleCantidad(e)}
                        Min = {0}
                        Max = {row.Orden[index].Cantidad}
                    />
                <label>Valor a devolver:</label>
                <label>$ {Formater(value)}</label>
                </div>
                <button className='btnStnd btn1' onClick={() => setShowConfirm(true)}>Aceptar</button>
                <button className='btnStnd btn1'>Cancelar</button>
            </div>
            {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnP} />}
        </div>
    );
}