import React, { useEffect, useState } from 'react';
import './_MoneyFlow.scss';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { Flatlist, ModalBusca, TheAlert } from '../../Components';
import { CashFlow, NewMoneyFlow, RemoveFlow } from '../../api';

export const MoneyFlow = ({show, typeOfFlow , aceptar }) => {
    //if typeOfFlow is false then is an influx of money
    //if typeOfFlow is true then is an waste of money
    const [ cantidad, setCantidad ] = useState(0);
    const [ comentario, setComentario ] = useState('');
    const [ showPrevio, setShowPrevio ] = useState(false);
    const [ previo, setPrevio ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ moneyFlow, setMoneyFlow ] = useState([]);
    const [ selectedfila, setSelectedfila ] = useState(0);
    const { setSection, setSomeData, usD } = useTheContext();
    const [ colores, setColores ] = useState({ principal: '#1a7124', seleccionado: 'rgba(26, 113, 36, 0.58)'});

    const ctHeaders = [
        {
            header: 'Monto',
            key: 'Efectivo',
            defaultWidth: 128,
            type: 'text',
        },
        {
            header: 'Comentarios',
            key: 'Comentarios',
            defaultWidth: 328,
            type: 'text',
        },
        {
            header: 'Hora',
            key: 'Hora',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Cancelar',
            key: 'Cancelar',
            defaultWidth: 50,
            type: 'text',
        }
    ];

    
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
    
    const selectFlow = async() => {
        const now = new Date();

        if(typeOfFlow === false){
            setTitle('Entrada');

        } else {
            setTitle('Salida');
            setColores({principal: '#900C3F', seleccionado: 'rgba(144, 12, 63, 0.58)'})
        }
        const cashFlow = await CashFlow({
            IdFerreteria: usD.Cod,
            Fecha: now.getFullYear() +
                    '-' + String(now.getMonth() + 1).padStart(2, '0') +
                    '-' + String(now.getDate()).padStart(2, '0')
        })
        const filterFlow = cashFlow.filter(flow => !!flow.TipoDeFlujo === !!typeOfFlow && flow.Motivo !== 'Inicio de caja')
        setMoneyFlow(filterFlow)
    }

    const cancelarEnSa = async(item) => {
        const isConfirmed = await TheAlert("¿Estás seguro de que deseas realizar esta acción?", 1);
    
        if (isConfirmed) {
            const now = new Date();
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.getFullYear() +
                        '-' + String(now.getMonth() + 1).padStart(2, '0') +
                        '-' + String(now.getDate()).padStart(2, '0');
            // Obtener la hora en formato HH:MM:SS
            const time =  String(now.getHours()).padStart(2, '0') +
                        ':' + String(now.getMinutes()).padStart(2, '0') +
                        ':' + String(now.getSeconds()).padStart(2, '0');
            const dataToSend ={
                ConsecutivoCV: 0,
                IdFerreteria: usD.Cod,
                Fecha: date + ' ' + time,
                Referencia: 0,
                Efectivo: item.Efectivo,
                Transferencia: 0,
                Motivo: 'Devolución ' + title,
                Comentarios: item.Comentarios,
                TipoDeFlujo: !typeOfFlow,
                Activo: true
            }
            await RemoveFlow({IdFerreteria: usD.Cod, Consecutivo: item.Consecutivo})
            await NewMoneyFlow(dataToSend)
            TheAlert('Se eliminó correctamente la ' + title)
            const newFlowIndex = moneyFlow.findIndex(row => row.Consecutivo === item.Consecutivo)
            if (newFlowIndex !== -1) {
                const updatedMoneyFlow = moneyFlow.map((row, index) => 
                    index === newFlowIndex ? { ...row, Activo: 0 } : row
                );
                
                setMoneyFlow(updatedMoneyFlow);
            }
        } else {
            console.log("Acción cancelada");
        }
    }
    
    const addMoneyFlow = async() => {
        if (cantidad === 0 ){
            TheAlert('Debe ingresar una cantidad');
        } else {
            const now = new Date();
            // Obtener la fecha en formato YYYY-MM-DD
            const date = now.getFullYear() +
                        '-' + String(now.getMonth() + 1).padStart(2, '0') +
                        '-' + String(now.getDate()).padStart(2, '0');
            // Obtener la hora en formato HH:MM:SS
            const time = String(now.getHours()).padStart(2, '0') +
                        ':' + String(now.getMinutes()).padStart(2, '0') +
                        ':' + String(now.getSeconds()).padStart(2, '0');
            const dataToSend ={
                ConsecutivoCV: 0,
                IdFerreteria: usD.Cod,
                Fecha: date + ' ' + time,
                Referencia: 0,
                Efectivo: cantidad,
                Transferencia: 0,
                Motivo: 'Ingreso por caja',
                Comentarios: comentario,
                TipoDeFlujo: typeOfFlow,
                Activo: true
            }
            await NewMoneyFlow(dataToSend)
            show(false)
        }
    }

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };
    

    const RowMoneyFlow = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        const date = new Date(item.Fecha)
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000',
            iconColor: item.Activo === 0 ? 'grey' : 'red',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
        };
        const removeFlow = () => {
            if (item.Activo === 0) {
                TheAlert('la ' + title + 'ya se encuentra eliminada')
            } else {
                cancelarEnSa(item)
            }
        }

        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>$ {Formater(item.Efectivo)}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <textarea
                            defaultValue={item.Comentarios}
                            className='taTMf'
                        />
                    </td>
                    <td style={{...styles, width: columnsWidth[2]}}>
                        <label>{String(date.getHours()).padStart(2, '0') +
                                ':' + String(date.getMinutes()).padStart(2, '0') +
                                ':' + String(date.getSeconds()).padStart(2, '0')}</label>
                    </td>
                    <td
                        style={{...styles, width: columnsWidth[3]}}
                        onClick={()=>removeFlow(item)}>
                        <button className='btn1Stnd'>
                            <i className="bi bi-trash-fill" style={{color: styles.iconColor, fontSize: '18px'}}/>
                        </button>
                    </td>
                </>
        );
    };

    const handleInputChange = (event) => {
        setComentario(event.target.value); // Establecer el valor del input en el estado
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content mfws' style={{position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, ${colores.principal}, #FFFFFF)`}}>
                    <h1>{title} de efectivo</h1>
                </div>
                <div style={{padding: '0px 10px 10px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '10px'}}>
                        <table className='semiTable'>{/*semiTable*/}
                            <tbody>
                                <tr>
                                    <td>Cantidad:</td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={cantidad}
                                            onchange={(e)=>setCantidad(e)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Comentarios:</td>
                                    <td>
                                        <textarea
                                            type='text'
                                            value={comentario}
                                            style={{backgroundColor: '#d9d9d9', resize: 'none', width: '130%'}}
                                            onChange={e => handleInputChange(e)}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='ActionButtons'>
                            <button className="btnStnd btn1" onClick={()=>addMoneyFlow()}>Guardar</button>
                            <button className="btnStnd btn1" onClick={()=>show(false)}>Cancelar</button>
                            <button className="btnStnd btn1" onClick={()=>setShowPrevio(!showPrevio)}>{previo}</button>
                        </div>
                    </div>
                    <div style={{minHeight: showPrevio && '100px'}}>
                        {showPrevio && <Flatlist
                                            data={moneyFlow}
                                            row={RowMoneyFlow}
                                            headers={ctHeaders}
                                            selectedRow={selectedfila}
                                            setSelectedRow={setSelectedfila}
                                            principalColor={colores.principal}
                                            selectedRowColor={colores.seleccionado}
                                            maxHeight='242px'
                                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}