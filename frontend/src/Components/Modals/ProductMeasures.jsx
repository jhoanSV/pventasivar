import React, { useEffect, useState } from 'react';
import './_ProductMeasures.scss';
import { TheInput } from '../InputComponent/TheInput';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const ProductMeasures = ({show, product, aceptar, width='50%', height='50%'}) => {
    const [ selectedOption, setSelectedOption] = useState('');
    const [ cantidad, setCantidad ] = useState(0);
    //const [ precioVenta, setPrecioVenta] = useState(0);
    const [total, setTotal] = useState('');
    
    const [precioVenta, setPrecioVenta] = useState(0);

    const handleChange = (e) => {
        setSelectedOption(e);
        if(e!==''){
            setPrecioVenta(product.Medidas[Number(e)].PVentaUM)
        }else{
            setPrecioVenta(0);
        }
    };

    const changeCantidad = (value) => {
        if (selectedOption === '') {} else {
            const valor = product.Medidas.filter(med=> med.Medida === selectedOption)
            if (value === '' || value === 0) {
                //setCantidad(0)    
                setPrecioVenta(valor[0].PVentaUM)
            } else {
                setCantidad(value)
                console.log(value * valor[0].PVentaUM)
                setPrecioVenta(value * valor[0].PVentaUM)
            }
        }
    }

    const changePrecio = (value) => {
        if (selectedOption === '' ) {} else {
            const valor = product.Medidas.filter(med=> med.Medida === selectedOption)
            if (value === '') {
                setCantidad(0)
                setPrecioVenta(valor[0].PVentaUM)
            } else {
                console.log(value * valor[0].PVentaUM)
                setCantidad(value / valor[0].PVentaUM)
            }
        }
    }

    const aceptFunction = () => {
        console.log(cantidad);
        if (selectedOption === '' || cantidad === 0 || cantidad === '' || !cantidad){
            TheAlert('No tiene cantidad');
        } else {
            const verdaderaCantidad = typeof(cantidad) === 'string' ? 
                Number(cantidad.replace(/[.,]/g, (a) => (a === "." ? "" : "."))) :
                cantidad
            let theProduct = {...product}
            theProduct.Cantidad = verdaderaCantidad
            theProduct.PCosto = product.PCosto / product.Medidas[selectedOption].UMedida * cantidad
            theProduct.Medida = product.Medidas[selectedOption].Medida
            theProduct.UMedida = product.Medidas[selectedOption].UMedida
            theProduct.PVenta = product.Medidas[selectedOption].PVentaUM
            aceptar(theProduct)
            show(false);
        }
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: '520px', position: 'relative'}}>
                <div className='theModal-body'>
                    <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <div style={{fontSize: '30px', fontWeight: 'bold'}}>{product.Descripcion}</div>
                    <div style={{marginBottom: '14px'}}>{product.Cod}</div>
                    <div className='Row' style={{marginBottom: '10px'}}>
                        <span style={{width: '134px', textAlign: 'end', marginRight: '10px'}}>
                            Unidad de medida:
                        </span>
                        <select value={selectedOption} name='medida'
                            onChange={(e)=>{handleChange(e.target.value)}}
                        >
                            <option value=''>seleccione...</option>
                            {product.Medidas.map((option, index) => (
                                <option key={index} value={index}>
                                    {option.Medida}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="Row">
                        
                        <table className='theTable gmt pmt' style={{margin: '10px 0px', width: '100%'}}>
                            <thead>
                                <tr>
                                    <th>
                                        Cantidad
                                    </th>
                                    <th>
                                        Precio
                                    </th>
                                    <th>
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            {selectedOption !== '' &&
                            <tbody>
                                <tr>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={cantidad}
                                            onchange={(e)=>{
                                                let c = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                let a = c * precioVenta;
                                                a = a % 1 === 0 ? a.toString() : a.toFixed(2);
                                                setTotal(Formater(a));
                                                setCantidad(e);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {Formater(precioVenta)}
                                    </td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={total}
                                            onchange={(e)=>{
                                                let pv = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                let a = pv / precioVenta;
                                                a = a % 1 === 0 ? a.toString() : a.toFixed(2);
                                                setCantidad(Formater(a));
                                                setTotal(e)
                                            }}
                                        />
                                    </td>
                                </tr>
                                
                                {/* {product.Medidas.slice(1).map((Med, index) =>{

                                    
                                    let pcosto = product.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                    let pcostoUnit = Med.UMedida ? pcosto/(Med.UMedida.replace(/[.,]/g, (a) => (a === "," && "."))) : 0;

                                    return (
                                    <tr key={index}>
                                        <td>{Med.Medida}</td>
                                        <td>
                                            <TheInput
                                                numType='real'
                                                val={Med.UMedida}
                                                onchange={(e)=>{
                                                    Med.UMedida = e;
                                                    let um = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                    let meds = {...product}.Medidas;
                                                    let a = meds[index+1];
                                                    if(a.PVentaUM){
                                                        console.log(a.PVentaUM);
                                                        let pct = (((a.PVentaUM.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) - (pcosto/um)) / (pcosto/um)) * 100);
                                                        console.log(Med.PVentaUM, pcosto/um, pct);
                                                        pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                        a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                    }
                                                    updtState('Medidas', meds);//Modifica la unidad en la medida
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {Formater(pcostoUnit)}
                                        </td>
                                        <td>
                                            <TheInput
                                                numType='real'
                                                val={Med.PVentaUM}
                                                pholder={Formater(
                                                    pcostoUnit + pcostoUnit*Number(pctGan.replace(/,/g, '.'))/100
                                                )}
                                                onchange={(e)=>{
                                                    Med.PVentaUM = e;
                                                    let pv = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                    let meds = {...product}.Medidas;
                                                    let a = meds[index+1];
                                                    if(a.UMedida!==''){
                                                        let pct = (((pv - pcostoUnit) / pcostoUnit) * 100);
                                                        pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                        a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                    }
                                                    updtState('Medidas', meds);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <TheInput
                                                id={`idpct${index}`}
                                                val={Med.pctUM}
                                                numType='real'
                                                pholder={Formater(pctGan)}
                                                onchange={(e)=>{
                                                    Med.pctUM = e
                                                    let pct = e.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                                    let meds = {...product}.Medidas;
                                                    let a = meds[index+1];
                                                    if(a.UMedida!==''){
                                                        let newPventa = (pcostoUnit + (pcostoUnit * pct / 100));
                                                        newPventa = newPventa % 1 === 0 ? newPventa.toString() : newPventa.toFixed(2);
                                                        meds[index+1].PVentaUM = Formater(newPventa);//Si hay umedida cambia el pventa
                                                    }
                                                    updtState('Medidas', meds);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    )}
                                )} */}
                            </tbody>}
                        </table>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button className='btnStnd btn1' onClick={() =>{
                            aceptFunction()
                        }}>
                        Guardar
                        </button>
                    </div>
                    {/* {<div className='Rows'>
                        <label>{product.Cod}</label>
                        <label>{product.Descripcion}</label>
                        <label>Medida:</label>
                        <select id="dropdown" value={selectedOption} onChange={handleChange}>
                            <option value="" disabled>
                                --Seleccionar--
                            </option>
                            {product.Medidas.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.Medida}
                                </option>
                            ))}
                        </select>
                    </div>
                    <label>Cantidad:</label>
                    <TheInput
                        numType='real'
                        val={cantidad}
                        onchange={(e)=>changeCantidad(e)}
                    >
                    </TheInput>
                    <label>Precio:</label>
                    <TheInput
                        numType='real'
                        val={precioVenta}
                        onchange={(e)=>changePrecio(e)}
                    >
                    </TheInput>
                    <button onClick={()=>aceptFunction()}>Aceptar</button>} */}
                </div>
            </div>
        </div>
    );
}