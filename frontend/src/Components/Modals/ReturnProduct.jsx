import React, { useState } from 'react';
import './_ReturnProduct.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { validateUser } from '../../api';

export const ReturnProduct = ({show, row, index, width='50%', height='40%'}) => {
    const [ cantidad, setCantidad ] = useState(0);
    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <label>Cod:</label>
                <label>{row.Orden[index].Cod}</label>
                <label>Descripción:</label>
                <label>{row.Orden[index].Descripcion}</label>
                <label>Valor unitario:</label>
                <label>{row.Orden[index].VrUnitario}</label>
                <label>Cantidad a devolver:</label>
                <TheInput
                    type='number'
                    value={cantidad}
                    onChange={(e) => console.log(e.target.value)}
                />
                <label>Valor a devolver:</label>
                <label>{cantidad}</label>
                <button className='btnStnd btn1' onClick={() => {console.log(row)}}>Aceptar</button>
                <button className='btnStnd btn1'>Cancelar</button>
            </div>
        </div>
    );
}