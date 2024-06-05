import React, {useState} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';

export const ChangePurchasePro = ({data, show, width, height}) => {
    const [newData, setNewData] = useState(data)
    const [newPventa, setNewPventa] = useState(data.pVentaSistem)
    const [newGanancia, setNewGanancia] = useState((data.pVentaSistem - data.vrUnitario)/data.vrUnitario * 100)
    
    const ganancia = (ganancia) => {
        let withoutFormat = ganancia.replace(/\./g, '')
        let nuevoPv = (data.vrUnitario + data.vrUnitario*(withoutFormat/100)).toString().replace(/\./g, ',')
        setNewGanancia(ganancia)
        setNewPventa(nuevoPv)
    };
    
    const precioVenta = (pventa) => {
        let withoutFormat = pventa.replace(/\./g, '')
        let nuevaGanancia = ((withoutFormat - data.vrUnitario)/data.vrUnitario * 100).toString().replace(/\./g, ',')
        setNewPventa(pventa)
        setNewGanancia(nuevaGanancia)
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
                <div className='theModal-body'>
            <div>
                <div>
                    <div>
                        <label className='subtitle'>Codigo:</label>
                        <label className='subtitle'>{data.cod}</label>
                    </div>
                </div>
                <div >
                    <label className='subtitle'>{data.descripcion}</label>
                </div>
                <div className='Rows'>
                    <div className='column1'>
                        <label className='subtitle'>Inventario actual:</label>
                    </div>
                    <div className='column2'>
                        <label>{data.existencia}</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Minimo:</label>
                    </div>
                    <div className='column2'>
                        <label>{data.invMinimo}</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Maximo:</label>
                    </div>
                    <div className='column2'>
                        <label>{data.invMaximo}</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Costo actual:</label>
                    </div>
                    <label className='column2'>$ {Formater(data.pCostoSistem)}</label>
                </div>
                <div className='form-container'>
                    <div className='form-row'>
                        <label className='subtitle'>Cantidad de compra:</label>
                        <label>{data.cantidad}</label>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Costo:</label>
                        <label>$ {Formater(data.vrUnitario)}</label>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Ganancia:</label>
                        <TheInput
                            numType='real'
                            val={Formater(newGanancia)}
                            onblur={(e)=>ganancia(e)}>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Nuevo precio de venta:</label>
                        <TheInput
                            numType='real'
                            val={Formater(newPventa)}
                            onblur={(e)=>precioVenta(e)}>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>precio venta:</label>
                        <label>$ {Formater(data.pVentaSistem)}</label>
                    </div>
                </div>
                <div>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{}}
                            >
                            aceptar
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{show(false)}}
                        >
                            cancelar
                    </button>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
}