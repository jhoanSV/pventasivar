import React, {useState} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { ModifyPurchaseProduct } from '../../api';
import { useTheContext } from '../../TheProvider';

export const ChangePurchasePro = ({data, show, width}) => {
    console.log(data);
    const [newPventa, setNewPventa] = useState(data.PVenta ? data.PVenta : '');
    // eslint-disable-next-line
    const [theCost, setTheCost] = useState(data.PCostoLP ? data.PCostoLP : data.PCosto);
    const [newGanancia, setNewGanancia] = useState(
        data.PVenta ? ((data.PVenta - data.PCosto)/data.PCosto * 100).toFixed(2)
        : 0
    )
    const { usD, someData } = useTheContext();
    console.log(someData);
    const ganancia = (ganancia) => {
        let withoutFormat = Number(ganancia.replace(/[.,]/g, (a) => (a === "," && ".")));
        let nuevoPv = (data.PCosto + data.PCosto*(withoutFormat/100)).toFixed(2);
        data.PVenta = nuevoPv
        setNewPventa(nuevoPv);
    };
    
    const precioVenta = (pventa) => {
        let withoutFormat = Number(pventa.replace(/[.,]/g, (a) => (a === "," && ".")));
        let nuevaGanancia = ((withoutFormat - data.PCosto)/data.PCosto * 100).toFixed(2);
        //data.PVenta = nuevaGanancia
        data.PVenta = withoutFormat;
        setNewGanancia(nuevaGanancia);
    };

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const acceptChanges = async() =>{
        console.log({
            "ConsecutivoProd": data.ConsecutivoProd,
            "Cod" : data.Cod,
            "IdFerreteria": usD.Cod,
            "NPreFactura" : someData.NPreFactura,
            "PCosto": theCost,
            "PVenta": data.PVenta,
        });
        console.log(theCost);
        const res = await ModifyPurchaseProduct({
            "ConsecutivoProd": data.ConsecutivoProd,
            "Cod" : data.Cod,
            "IdFerreteria": usD.Cod,
            "NPreFactura" : someData.NPreFactura,
            "PCosto": theCost,
            "PVenta": data.PVenta,
        });
        if(res && res.message === 'Transacción completada con éxito'){
            show(false);
            data.Verificado = 1
            alert('Producto modificado con éxito');
            document.getElementById('id'+data.Cod).checked = true;
        } else {
            alert('Ocurrió un error inesperado al modificar el producto');
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
            <div>
                <div>
                    <label className='subtitle'>Codigo: </label>
                    <label className='subtitle'>{data.Cod}</label>
                </div>
                <div style={{paddingBottom: '10px', borderBottom: '1px solid'}}>
                    <label className='subtitle'>{data.Descripcion}</label>
                </div>
                {(data.PVenta !== null && data.PCostoLP !== null) &&
                    <div className='Rows' style={{paddingBottom: '10px', borderBottom: '1px solid'}}>
                        <div className='column1'>
                            <label className='subtitle'>Inventario actual:</label>
                        </div>
                        <div className='column2'>
                            <label>{data.Inventario}</label>
                        </div>
                        <div className='column1'>
                            <label className='subtitle'>Minimo:</label>
                        </div>
                        <div className='column2'>
                            <label>{data.InvMinimo}</label>
                        </div>
                        <div className='column1'>
                            <label className='subtitle'>Maximo:</label>
                        </div>
                        <div className='column2'>
                            <label>{data.InvMaximo}</label>
                        </div>
                        <div className='column1'>
                            <label className='subtitle'>Costo actual:</label>
                        </div>
                        <div className='column2'>
                            <label>$ {data.PCostoLP ? Formater(data.PCostoLP) : Formater(0)}</label>
                        </div>
                        <div className='column1'>
                            <label className='subtitle'>Precio Venta:</label>
                        </div>
                        <div className='column2'>
                        <label>$ {data.PVenta ? Formater(data.PVenta) : Formater(0)}</label>
                        </div>
                    </div>
                }
                <div className='form-container'>
                    <div className='form-row'>
                        <label className='subtitle'>Cantidad de compra:</label>
                        <label>{data.Cantidad}</label>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Costo:</label>
                        <label>$ {Formater(data.PCosto)}</label>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Ganancia:</label>
                        <TheInput
                            numType='real'
                            val={Formater(newGanancia)}
                            onchange={(e)=>ganancia(e)}/>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Nuevo precio de venta:</label>
                        <TheInput
                            numType='real'
                            val={Formater(newPventa)}
                            pholder={'Nuevo p. Venta'}
                            onchange={(e)=>precioVenta(e)}>
                        </TheInput>
                    </div>
                    
                </div>
                {someData.Estado === 'Por ingresar' &&
                    <div>
                        <button className='btnStnd btn1'
                            style={{marginLeft: '20px'}}
                            onClick={()=>{acceptChanges()}}
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
                }
            </div>
                </div>
            </div>
        </div>
    );
}