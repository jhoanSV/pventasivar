import React, { useState } from 'react';
import { TheInput } from '../InputComponent';

export const GranelModal = ({show, productData, pctGan}) => {
    
    const Formater = (number) =>{
        if (!number) return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberfromat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }
    const [granel, setGranel] = useState('Metros');
    const [medidaUnit, setMedidaUnit] = useState(1);
    const [cUnit, setcUnit] = useState((typeof(productData.PCosto) !== 'number') ? Formater(productData.PCosto.replace(/\./g, '')/medidaUnit) : Formater(productData.PCosto/medidaUnit));
    const [pctUnit, setPctUnit] = useState('')
    const [pVentaUnit, setPVentaUnit] = useState('');


    const handleMedUnit = (e) =>{
        setMedidaUnit(e);
        (typeof(productData.PCosto) !== 'number') ? setcUnit(Formater(productData.PCosto.replace(/\./g, '')/e)) : setcUnit(Formater(productData.PCosto/e))
    }

    const calpct = (e) =>{
        let thePcosto = Number(cUnit.replace(/\./g, ''))
        let pct = (((e-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setPctUnit(Formater(pct))
    }

    const calcPVU = (e) =>{
        let thePcosto = Number(cUnit.replace(/\./g, ''))
        let newPventa = (thePcosto + (thePcosto*e/100)).toFixed(2).toString();
        setPVentaUnit(Formater(newPventa))
    }

    return(
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: 'max-content', position: 'relative'}}>
                <div className='theModal-body'>
                    <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <h1>{productData.Cod}</h1>
                    <h3>{productData.Descripcion}</h3>
                    <div className='Row'>
                        <span style={{width: '114px', textAlign: 'end', marginRight: '10px'}}>
                            Medida
                        </span>
                        <select value={granel} name='medida' onChange={(e)=>{setGranel(e.target.value)}}>
                            <option value='Metros'>Metros</option>
                            <option value='Kilos'>Kilos</option>
                        </select>
                    </div>
                    <div className="Row">
                        <span style={{marginRight: '10px'}}>
                            Medida Unitaria
                        </span>
                        <TheInput
                            val={medidaUnit}
                            numType='real'
                            onchange={(e)=>{handleMedUnit(e)}}
                        />
                    </div>
                    <div className="Row">
                        <table className='theTable' style={{margin: '10px 0px'}}>
                            <thead>
                                <tr>
                                    <th>a</th>
                                    <th>Costo</th>
                                    <th>P. venta</th>
                                    <th>% Gananacia</th>                                
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Completo</td>
                                    <td>{(typeof(productData.PCosto) !== 'number') ? Formater(productData.PCosto.replace(/\./g, '')) : productData.PCosto}</td>
                                    <td>{(typeof(productData.PVenta) !== 'number') ? Formater(productData.PVenta.replace(/\./g, '')) : productData.PVenta}</td>
                                    <td>{Number(pctGan.replace(/,/g, '.'))}</td>
                                </tr>
                                <tr>
                                    <td>{granel}</td>
                                    <td>{cUnit}</td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pVentaUnit}
                                            pholder={Formater(Number(cUnit.replace(/\./g, '')) + (Number(cUnit.replace(/\./g, ''))*Number(pctGan.replace(/,/g, '.'))/100))}
                                            onchange={(e)=>calpct(e)}
                                        />
                                    </td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pctUnit}
                                            pholder={Number(pctGan.replace(/,/g, '.'))}
                                            onchange={(e)=>calcPVU(e)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button className='btnStnd btn1' onClick={() => show(false)}>Cancelar</button>{/*desseleccionar radio cuando cancelar*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
