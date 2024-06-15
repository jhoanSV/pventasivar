import React, {useState, useEffect} from 'react';
import { TheInput } from '../../Components/InputComponent/TheInput';
import './_ConfirmSaleModal.scss';

export const ConfirmSaleModal = ({show, orderslist, width='50%', height='50%'}) => {
    const [paga, setPaga] = useState(0)
    const [cambio, setCambio] = useState(0)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (paga >= total) {
            setCambio(paga - total)
        } else {
            setCambio(0)
        }
    }, [paga])

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
        if (orderslist && orderslist.length > 0) {orderslist.forEach((item, index) => (
            suma += item.pVenta * item.Cantidad
        ))}
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
                        <h2>William sierra</h2>
                    </div>
                    <div className='content'>
                        <div className='change'>
                            <div className='Rows'>
                                <div className='column1'>
                                    <label>Total:</label>
                                </div>
                                <div className='column2'>
                                    <label>$ {Formater(total)}</label>
                                </div>
                                <div className='column1'>
                                    <label>Pago con:</label>
                                </div>
                                <div className='column2'>
                                    <TheInput 
                                        numType='real'
                                        value={paga.pago}
                                        onchange={(e)=>setPaga(e)}
                                    />
                                </div>
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
                                <label>{orderslist.length}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}