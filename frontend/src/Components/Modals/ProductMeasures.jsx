import React, { useState } from 'react';
import './_ProductMeasures.scss';
import { TheInput } from '../InputComponent/TheInput';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const ProductMeasures = ({show, product, aceptar}) => {
    const [ selectedOption, setSelectedOption] = useState('');
    const [ cantidad, setCantidad ] = useState(0);
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

    const aceptFunction = async() => {
        console.log(cantidad);
        if (selectedOption === '' || cantidad === 0 || cantidad === '' || !cantidad){
            await TheAlert('No tiene cantidad');
        } else {
            const verdaderaCantidad = typeof(cantidad) === 'string' ? 
                Number(cantidad.replace(/[.,]/g, (a) => (a === "." ? "" : "."))) :
                cantidad
            //const costoMedidas = product.PCosto / product.Medidas[selectedOption].UMedida// * cantidad
            //const VerdaderoCosto = 
            //console.log('product.PCosto / product.Medidas[selectedOption].UMedida: ', product.PCosto / product.Medidas[selectedOption].UMedida)
            /*console.log(verdaderaCantidad, product.Inventario, product.Medidas[selectedOption].UMedida);
            console.log(product.Inventario*product.Medidas[selectedOption].UMedida);
            return*/
            if(verdaderaCantidad <= (product.Inventario*product.Medidas[selectedOption].UMedida)){
                let theProduct = {...product};
                theProduct.Cantidad = verdaderaCantidad;
                theProduct.PCosto = product.PCosto / product.Medidas[selectedOption].UMedida;
                theProduct.Medida = product.Medidas[selectedOption].Medida;
                theProduct.UMedida = product.Medidas[selectedOption].UMedida;
                theProduct.PVenta = product.Medidas[selectedOption].PVentaUM;
                aceptar(theProduct);
                show(false);
            }else{
                await TheAlert('No hay suficiente inventario.');
            }
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
                                            select={true}
                                            autofocus={true}
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
                                            select={true}
                                        />
                                    </td>
                                </tr>
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
                </div>
            </div>
        </div>
    );
}