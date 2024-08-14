import React, {useState, useEffect} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';
import './_ConfirmSaleModal.scss';

export const ConfirmSaleModal = ({show, orderslist, width='50%', height='50%'}) => {
    const [ efectivo, setEfectivo] = useState(0)
    const [ transferencia, setTransferencia] = useState(0);
    const [ cambio, setCambio] = useState(0)
    const [ total, setTotal] = useState(0)
    const [ tipoDePago, setTipoDePago] = useState("Efectivo")

    useEffect(() => {
        if (tipoDePago === 'Efectivo') {
            if (efectivo >= total) {
                setCambio(efectivo - total)
            } else {
                setCambio(0)
            }
        } else if (tipoDePago === 'Transferencia') {
            if (transferencia >= total) {
                setCambio(transferencia - total)
            } else {
                setCambio(0)
            }
        } else if (tipoDePago === 'Mixto') {
            if (efectivo + transferencia >= total) {
                setCambio(efectivo + transferencia - total)
            } else {
                setCambio(0)
            }
        }
    }, [efectivo, transferencia, tipoDePago])

    useEffect(() => {
        sumarTotal()
    }, [])

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const sumarTotal = () => {
        let suma = 0;
        console.log('orderslist.Order: ' + JSON.stringify(orderslist.Order))
        if (orderslist.Order && orderslist.Order.length > 0) {orderslist.Order.forEach((item, index) => {
            console.log(item.PVenta);
            suma += item.PVenta * item.Cantidad
        })}
        setTotal(suma)
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    <div className='header_confirm_sale'>
                        <h2>Cliente:</h2>
                        <h2>{orderslist.Customer.Nombre + ' ' + orderslist.Customer.Apellido}</h2>
                    </div>
                    <div className='content'>
                        <div className='change'>
                            <div>
                                <label>
                                    <input type ='radio'
                                           value ='Efectivo'
                                           name = 'ModoDePago'
                                           defaultChecked = {true}
                                           onChange = {()=>setTipoDePago('Efectivo')}/>
                                    Efectivo
                                </label>
                                <label>
                                    <input type='radio'
                                           value='Transferencia'
                                           name = 'ModoDePago'
                                           onChange = {()=>setTipoDePago('Transferencia')}/>
                                    Transferencia
                                </label>
                                <label>
                                    <input type='radio'
                                           value='Mixto'
                                           name = 'ModoDePago'
                                           onChange = {()=>setTipoDePago('Mixto')}/>
                                    Mixto
                                </label>
                            </div>
                            <div className='Rows'>
                                <div className='column1'>
                                    <label>Total:</label>
                                </div>
                                <div className='column2'>
                                    <label>$ {Formater(total)}</label>
                                </div>
                                {tipoDePago === 'Efectivo' || tipoDePago === 'Mixto' ? (
                                    <>
                                        <div className='column1'>
                                            <label>Efectivo:</label>
                                        </div>
                                        <div className='column2'>
                                            <TheInput
                                                numType='real'
                                                val={efectivo}
                                                onchange={(e)=>setEfectivo(e)}
                                            />
                                        </div>
                                    </>
                                ): null}
                                {tipoDePago === 'Transferencia' || tipoDePago === 'Mixto' ? (
                                    <>
                                        <div className='column1'>
                                            <label>Transferencia:</label>
                                        </div>
                                        <div className='column2'>
                                            <TheInput
                                                numType='real'
                                                value={transferencia}
                                                onchange={(e)=>setTransferencia(e)}
                                            />
                                        </div>
                                        <div className='column1'>
                                            <label>Referencia:</label>
                                        </div>
                                        <div className='column2'>
                                            <input type='text'/>
                                        </div>
                                    </>
                                ): null}
                                <div className='column1'>
                                    <label>Cambio:</label>
                                </div>
                                <div className='column2'>
                                    <label>$ {Formater(cambio)}</label>
                                </div>
                            </div>
                        </div>
                        <div className='menuOptions'>
                            <div>
                                <button className="btnStnd btn1" onClick={()=>{}}>Solo cobrar</button>
                            </div>
                            <div>
                                <button className="btnStnd btn1" onClick={()=>{}}>Cobrar e imprimir</button>
                            </div>
                            <div>
                                <label>Total de articulos:</label>
                            </div>
                            <div>
                                <label>{orderslist.Order.length}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}