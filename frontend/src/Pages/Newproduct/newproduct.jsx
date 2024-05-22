import React, { useEffect, useState } from 'react';
import "./_newproduct.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput } from '../../Components';

export function Newproduct(){
    //*Examples
    // example of list of categories
    // Example dictionary
    const categoriesList = {
        1: 'EBANISTERIA',
        2: 'ELECTRICOS',
        3: 'TORNILLERIA',
        4: 'GRIFERIA',
        5: 'GAS',
        6: 'LICUADORA',
        7: 'ESTUDIANTIL',
        8: 'MISCELANEOS'
    };


    const navigate = useNavigate()
    const { setSection } = useTheContext();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(''); // set the selected category
    const [buttons, setButtons] = useState("Crear producto");
    const [productData, setProductData] = useState({'cod_de_barras':'','descripcion':'', 'invMaximo':'', 'invMinimo':'', 'inventario': '', 'pcosto':'', 'pventa': '', 'ubicacion':''});
    const [modificarProducto, setModificarProducto] = useState(false);
    const [pctGan, setpctGan] = useState('');
    const [productsDataShow, setproductsDataShow] = useState({});

    useEffect(() => {
        if (location.state){
            setProductData(location.state);
            setSection('Modificar producto');
            setButtons("Modificar producto");
            setModificarProducto(true);
            if(location.state.pventa && location.state.pcosto){
                let pct = (((location.state.pventa-location.state.pcosto)/location.state.pcosto)*100).toFixed(2).toString();        
                pct = pct.replace(/\./g, ',');
                setpctGan(pct);
            }
        } else {
            setSection('Nuevo Producto');
        }
        // eslint-disable-next-line
    },[]);

    const calpctC = (e) =>{
        let pct = (((productData.pventa-e)/e)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpctV = (e) =>{
        let pct = (((e-productData.pcosto)/productData.pcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpventa = (e) =>{
        let newPventa = (productData.pcosto + (productData.pcosto*e/100)).toFixed(2).toString();
        newPventa = newPventa.replace(/\./g, ',');
        return(newPventa)
    }

    const changeValuesProducts = (key, value)=>{
        //This function allows us to change the one specific value in the product data
        setProductData(prevValue => ({
            ...prevValue, // Copia los valores anteriores
            [key]: value // Reemplaza el valor de la clave específica
          }));
    }

    const handleSelectedCategory = (e) => {
        //*This function handles the selected category and 
        const { value } = e.target;
        setSelectedCategory(value);
    };

    return (
        <section className='Newproduct'>
            <div style={{position: 'relative'}}>
                <div className='Row'>
                    <div className='Colmn1'>                        
                        <label>Codigo de barras</label>
                    </div>
                    <div className='Colmn2'>
                        <input 
                            type="text"
                            className=""
                            onChange={(e)=>changeValuesProducts("cod_de_barras", e.target.value)}
                            value={productData.cod_de_barras}/>                        
                        <button onClick={()=>console.log(productData)}>a</button>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Producto</label>
                    </div>
                    <div className='Colmn2'>
                        <input
                            type="text"
                            className=''
                            onChange={(e)=>changeValuesProducts("descripcion", e.target.value)}
                            value={productData.descripcion}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Se vende:</label>
                    </div>
                    <div className='Row'>
                        <label className="custom-label">
                            <input type="radio" className="custom-radio" name="uniorpack" />
                            <i></i>
                            por unidad
                        </label>
                        <label className="custom-label">
                            <input type="radio" className="custom-radio" name="uniorpack"/>
                            <i></i>
                            granel
                        </label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Costo</label>
                    </div>
                    <div className='Colmn2'>
                        <TheInput
                            val={productData.pcosto}
                            numType={'real'}
                            onchange={(e)=>{changeValuesProducts('pcosto', Number(e));calpctC(e)}}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>% ganancia</label>
                    </div>
                    <div className='Colmn2'>
                        <TheInput
                            val={pctGan}
                            numType={'real'}
                            onchange={(e)=>{changeValuesProducts('pventa', calpventa(e))}}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Precio venta</label>
                    </div>
                    <div className='Colmn2'>
                        <TheInput
                            val={productData.pventa}
                            numType={'real'}
                            onchange={(e)=>{changeValuesProducts('pventa', Number(e));calpctV(e)}}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Categoria</label>
                    </div>
                    <div className='Colmn2'>
                        <select value={selectedCategory} onChange={handleSelectedCategory}>
                            {Object.entries(categoriesList).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {modificarProducto &&
                    <div className='Row'>
                        <div className='Colmn1'>
                            <label>Proveedor</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className=""/>
                        </div>
                    </div>
                }
                <div className="Row" style={{padding: '35px'}}>
                    <div className="ProImgContainer">
                        <img 
                            className=""
                            alt='imgProduct'
                            />
                    </div>

                    <textarea
                        type="textbox"
                        className="npTextArea"
                        placeholder="Detalles del producto"
                    />
                </div>


                <div className='Inv'>
                    <div className='InvLabel'>
                        <strong>Inventario</strong>
                    </div>
                    <div className="Row" style={{marginTop: '15px'}}>
                        <div className='Colmn1'>
                            <label>Inv actual</label>
                        </div>
                        <div className='Colmn2'>
                        {modificarProducto && 
                            <label>{productData.inventario}</label>
                        }
                        {!modificarProducto && <input
                            id="venta"
                            type="text"
                            className=''
                            onChange={(e)=>changeValuesProducts("inventario", e.target.value)}
                            value={productData.inventario}/>
                        }
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv minimo</label>
                        </div>
                        <div className='Colmn2'>
                            <input
                                id="invMinimo"
                                type="text"
                                className=''
                                onChange={(e)=>changeValuesProducts("invMinimo", e.target.value)}
                                value={productData.invMinimo}/>
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv maximo</label>
                        </div>
                        <div className='Colmn2'>
                            <input
                                id="invMaximo"
                                type="text"
                                className=''
                                onChange={(e)=>changeValuesProducts("invMaximo", e.target.value)}
                                value={productData.invMaximo}/>
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Ubicación</label>
                        </div>
                        <div className='Colmn2'>
                            <input
                                id="ubicacion"
                                type="text"
                                className=''
                                onChange={(e)=>changeValuesProducts("ubicacion", e.target.value)}
                                value={productData.ubicacion}/>
                        </div>
                    </div>
                </div>
            </div>
            <button
                className='btnStnd btn1'
                onClick={()=>{navigate('/ProductsList')}}>{buttons}</button>
            {modificarProducto && 
                <button
                    className='btnStnd btn1'
                    onClick={()=>{navigate('/InvAdjustment')}}
                    >Modificar inventario</button>}
        </section>
    );
}