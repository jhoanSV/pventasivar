import React, { useEffect, useState } from 'react';
import './_ProductMeasures.scss';
import { TheInput } from '../InputComponent/TheInput';
import { TheAlert } from '../TheAlert';

export const ProductMeasures = ({show, product, aceptar, width='50%', height='50%'}) => {
    const [ selectedOption, setSelectedOption] = useState('');
    const [ cantidad, setCantidad ] = useState(0);
    const [ precioVenta, setPrecioVenta] = useState(0);
    const [ costo, setCosto] = useState(0);
    
    const handleChange = (event) => {
        const valor = product.Medidas.filter(med=> med.Medida === event.target.value)
        setSelectedOption(event.target.value);
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
        if (selectedOption === '' || cantidad === 0 || cantidad === ''){
            TheAlert('No tiene cantidad');
        } else {
            const verdaderaCantidad = Number(cantidad)
            const valor = product.Medidas.filter(med=> med.Medida === selectedOption)
            let theProduct = {...product}
            theProduct.Cantidad = verdaderaCantidad
            theProduct.PCosto = product.PCosto / valor[0].UMedida * cantidad
            theProduct.Medida = selectedOption
            theProduct.UMedida = valor[0].UMedida
            theProduct.PVenta = valor[0].PVentaUM
            aceptar(theProduct)
            show(false);
        }
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='Rows'>
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
                <button onClick={()=>aceptFunction()}>Aceptar</button>
            </div>
        </div>
    );
}