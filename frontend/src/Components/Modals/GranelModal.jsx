import React, { useState } from 'react';
import { TheInput } from '../InputComponent';

export const GranelModal = ({show, productData, pctGan, updtState}) => {
    
    const Formater = (number) =>{
        if (!number) return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberformat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberformat.toFixed(2));
    }

    //console.log(Number(pctGan.replace(/[.,]/g, (a) => (a === "." ? "" : "."))))
    console.log(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, ''));
    const [cUnit, setcUnit] = useState((typeof(productData.PCosto) !== 'number') ? (productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, '')) : Formater(productData.PCosto/productData.UMedida));
    const [pVentaUnit, setPVentaUnit] = useState(productData.PVentaUM);
    const [pctUnit, setPctUnit] = useState(productData.PVentaUM ? 
        Formater((((pVentaUnit.replace(/\./g, '')-cUnit)/cUnit)*100).toFixed(2))
        :
        ''
    )

    const handleMedUnit = (e) =>{
        updtState('UMedida', e);
        console.log(productData.PCosto);
        (typeof(productData.PCosto) !== 'number') ? setcUnit(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/e) : setcUnit(productData.PCosto/e)
    }

    const calpct = (e) =>{
        let thePventa = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")))
        let thePcosto = cUnit
        let pct = (((thePventa-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setPctUnit(Formater(pct))
    }

    const calcPVU = (e) =>{
        let thepct = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePcosto = Number(cUnit);
        let newPventa = (thePcosto + (thePcosto*thepct/100)).toFixed(2).toString();
        updtState('PVentaUM', Formater(newPventa));
        setPVentaUnit(Formater(newPventa));
    }

    return(
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: 'max-content', position: 'relative'}}>
                <div className='theModal-body'>
                    <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <h1>{productData.Descripcion}</h1>
                    <h1>{productData.Cod}</h1>
                    <div className='Row' style={{marginBottom: '10px'}}>
                        <span style={{width: '131px', textAlign: 'end', marginRight: '10px'}}>
                            Unidad de medida
                        </span>
                        <select value={productData.Medida} name='medida' onChange={(e)=>{updtState('Medida', e.target.value)}}>
                            <option value='Metros'>Metros</option>
                            <option value='Kilos'>Kilos</option>
                            <option value='UnidadPaq'>Unidad de paquete</option>
                        </select>
                    </div>
                    <div className="Row">
                        <span style={{width: '131px', marginRight: '10px'}}>
                            Medida Unitaria
                        </span>
                        <TheInput
                            val={productData.UMedida}
                            numType='nat'
                            onchange={(e)=>{handleMedUnit(e)}}
                        />
                    </div>
                    <div className="Row">
                        <table className='theTable gmt' style={{margin: '10px 0px'}}>
                            <thead>
                                <tr>
                                    <th></th>
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
                                    <td>{Formater(pctGan)}</td>
                                </tr>
                                <tr>
                                    <td>{productData.Medida ? productData.Medida : updtState('Medida', 'Metros')}</td>
                                    <td>{Formater(cUnit)}</td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pVentaUnit}
                                            pholder={Formater(Number(cUnit) + (Number(cUnit)*Number(pctGan.replace(/,/g, '.'))/100))}
                                            onchange={(e)=>{updtState('PVentaUM', e);calpct(e)}}
                                        />
                                    </td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pctUnit}
                                            pholder={Formater(pctGan)}
                                            onchange={(e)=>calcPVU(e)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button className='btnStnd btn1' onClick={() => show(false)}>Guardar</button>{/*desseleccionar radio cuando cancelar*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
