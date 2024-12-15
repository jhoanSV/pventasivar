import React, { useState, useEffect} from 'react';
import './_ReturnProduct.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { UserConfirm } from './UserConfirm';
import { useTheContext } from '../../TheProvider';
import { validateUser, NewMoneyFlow, NewOutput } from '../../api';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const ReturnProduct = ({show, row, updateOrders, index, width='50%', height='50%', returnP}) => {
    const [ cantidad, setCantidad ] = useState(0);
    const [ value, setValue ] = useState(0);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ comentarios, setComentarios ] = useState('');
    const { setSection, setSomeData, usD } = useTheContext();

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
                <div style={{display: 'flex', padding: '10px', gap: '5px'}}>
                    <button className='btnStnd btn1' onClick={() => returnP(1,cantidad)}>Aceptar</button>
                    <button className='btnStnd btn1' onClick={() => show(false)}>Cancelar</button>
                </div>
            </div>
            {showConfirm && <UserConfirm show={setShowConfirm} confirm={returnP} />}
        </div>
    );
}