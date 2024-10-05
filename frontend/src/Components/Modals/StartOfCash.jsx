import React, { useEffect, useState } from 'react';
import './_StartOfCash.scss';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { NewMoneyFlow} from '../../api';
import { TheAlert } from '../TheAlert';

export const StartOfCash = ({show, aceptar}) => {
    const [ cantidad, setCantidad ] = useState(0);
    const { setSection, usD } = useTheContext();

    const aceptFunction = async() => {
        if (cantidad === 0 ){
            TheAlert('Debe ingresar una cantidad');
        } else {
            const now = new Date();
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.toISOString().split('T')[0];
            // Obtener la hora en formato HH:MM:SS
            const time = now.toTimeString().split(' ')[0];
            const dataToSend ={
                ConsecutivoCV: 0,
                IdFerreteria: usD.Cod,
                Fecha: date + ' ' + time,
                Referencia: 0,
                Efectivo: cantidad,
                Transferencia: 0,
                Motivo: 'Inicio de caja',
                Comentarios: '',
                TipoDeFlujo: 0,
                Activo: true
            }
            await NewMoneyFlow(dataToSend)
            show(false)
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{position: 'relative'}}>
                {/*<button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>{/*Borrar este botón*/}
                <div style={{
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '10px'
                    }}>
                        <label>Bienvenido {usD.Contacto} un gusto verte de nuevo<br/></label>
                        <label>¿Con cuanto dinero inicias la caja hoy?</label>
                    </div>
                    <div>
                        <label style={{marginRight: '10px'}}>Cantidad:</label>
                        <TheInput
                            numType='real'
                            val={cantidad}
                            onchange={(e)=>setCantidad(e)}
                            min={0}
                        />
                    </div>
                    <button className='btnStnd btn1'
                     onClick={()=>aceptFunction()}
                     style={{margin: '10px auto auto', fontSize: '17px'}}
                     >
                        &#x1F4B0; Registrar dinero en caja</button>
                </div>
            </div>
        </div>
    );
}