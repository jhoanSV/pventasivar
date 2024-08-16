import React, { useEffect, useState } from 'react';
import './_ProductMeasures.scss';
import { TheInput } from '../InputComponent/TheInput';
import { useTheContext } from '../../TheProvider';
import { Flatlist, ModalBusca } from '../../Components';
import { CashFlow, NewMoneyFlow, RemoveFlow } from '../../api';

export const MoneyFlow = ({show, typeOfFlow , aceptar, width='50%', height='50%'}) => {
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

    const ctHeaders = [
        {
            header: 'Monto',
            key: 'Efectivo',
            defaultWidth: 150,
            type: 'text',
        },
        {
            header: 'Comentarios',
            key: 'Comentarios',
            defaultWidth: 200,
            type: 'text',
        },
        {
            header: 'Fecha',
            key: 'Fecha',
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
        if(typeOfFlow === false){
            setTitle('Entrada');

        } else {
            setTitle('Salida');
        }
        const cashFlow = await CashFlow({
            IdFerreteria: usD.Cod,
            Fecha: new Date().toISOString().split('T')[0],
        })
        const filterFlow = cashFlow.filter(flow => !!flow.TipoDeFlujo === !!typeOfFlow && flow.Motivo !== 'Inicio de caja')
        setMoneyFlow(filterFlow)
    }

    const cancelarEnSa = async(item) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas realizar esta acción?");
    
        if (isConfirmed) {
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
                Efectivo: item.Efectivo,
                Transferencia: 0,
                Motivo: 'Devolución ' + title,
                Comentarios: item.Comentarios,
                TipoDeFlujo: !typeOfFlow,
                Activo: true
            }
            await RemoveFlow({IdFerreteria: usD.Cod, Consecutivo: item.Consecutivo})
            await NewMoneyFlow(dataToSend)
            alert('Se eliminó correctamente la ' + title)
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
            iconColor: item.Activo === 0 ? 'grey' : 'red'
        };
        const removeFlow = () => {
            if (item.Activo === 0) {
                alert('la ' + title + 'ya se encuentra eliminada')
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
                        <label>{item.Comentarios}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[2]}}>
                        <label>{date.toLocaleTimeString('en-GB', { hour12: false })}</label>
                    </td>
                    <td
                        style={{...styles, width: columnsWidth[3]}}
                        onClick={()=>removeFlow(item)}>
                        <div><i className="bi bi-trash-fill" style={{color: styles.iconColor}}></i></div>
                    </td>
                </>
        );
    };

    const handleInputChange = (event) => {
        setComentario(event.target.value); // Establecer el valor del input en el estado
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div>
                    <h1>{title} de efectivo</h1>
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
                    onChange={e => handleInputChange(e)}>
                </input>
                <div>
                    {showPrevio && <Flatlist
                                        data={moneyFlow}
                                        row={RowMoneyFlow}
                                        headers={ctHeaders}
                                        selectedRow={selectedfila}
                                        setSelectedRow={setSelectedfila}
                                    />
                                }
                    <div>
                        <button onClick={()=>addMoneyFlow()}>Guardar</button>
                        <button onClick={()=>show(false)}>Cancelar</button>
                        <button onClick={()=>setShowPrevio(!showPrevio)}>{previo}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}