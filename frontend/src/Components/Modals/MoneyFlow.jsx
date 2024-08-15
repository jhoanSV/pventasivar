import React, { useEffect, useState } from 'react';
import './_ProductMeasures.scss';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { Flatlist, ModalBusca } from '../../Components';

export const MoneyFlow = ({show, typeOfFlow , aceptar, width='50%', height='50%'}) => {
    //if typeOfFlow is false then is an influx of money
    //if typeOfFlow is true then is an waste of money
    const [ cantidad, setCantidad ] = useState(0);
    const [ comentario, setComentario ] = useState('');
    const [ showPrevio, setShowPrevio ] = useState(false);
    const [ previo, setPrevio ] = useState('');
    const [ title, setTitle ] = useState('');
    const { setSection, setSomeData, usD } = useTheContext();

    const selectFlow = () => {
        if(typeOfFlow === false){
            setTitle('Entrada de efectivo');
        } else {
            setTitle('Salida de efectivo');
        }
    }

    useEffect(()=>{
        selectFlow()
    },[])

    useEffect(()=>{
        if (showPrevio === true){
            setPrevio('Ocultar previo');
        } else {
            setPrevio('Mostrar previo');
        }
    },[showPrevio])

    const addMoneyFlow = () => {
        if (cantidad === 0 ){
            alert('Debe ingresar una cantidad');
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
                Motivo: 'Ingreso por caja',
                Comentarios: comentario,
                TipoDeFlujo: true
            }
            if (typeOfFlow === false) {
                //Send the information to the entradasDeDinero table
                console.log('Lo manda a entradas', dataToSend)
            } else {
                //Send the information to the salidasDeDinero table
                console.log('Lo manda a salidas', dataToSend)
            }
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div>
                    <h1>{title}</h1>
                </div>
                <label>Cantidad:</label>
                <TheInput
                    numType='real'
                    val={cantidad}
                    onchange={(e)=>setCantidad(e)}
                >
                </TheInput>
                <label>Comentarios:</label>
                <input
                    type='text'
                    value={comentario}
                    onChange={e => setComentario(e)}>
                </input>
                {showPrevio && <Flatlist>
                               </Flatlist>}
                <button onClick={()=>addMoneyFlow()}>Guardar</button>
                <button onClick={()=>show(false)}>Cancelar</button>
                <button onClick={()=>setShowPrevio(!showPrevio)}>{previo}</button>
            </div>
        </div>
    );
}