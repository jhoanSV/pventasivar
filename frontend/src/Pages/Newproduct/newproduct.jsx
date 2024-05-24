import React, { useEffect, useState } from 'react';
import "./_newproduct.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput, UserConfirm } from '../../Components';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'

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
    const [imgSrc, setImgSrc] = useState(location.state && `https://sivarwebresources.s3.amazonaws.com/AVIF/${location.state.cod}.avif`)
    const [selectedCategory, setSelectedCategory] = useState(''); // set the selected category
    const [buttons, setButtons] = useState("Crear producto");
    const [productData, setProductData] = useState({'cod_de_barras':'','descripcion':'', 'invMaximo':'', 'invMinimo':'', 'inventario': '', 'pcosto':'', 'pventa': '', 'ubicacion':''});
    const [modificarProducto, setModificarProducto] = useState(false);
    const [pctGan, setpctGan] = useState('');
    const [show1, setShow1] = useState(false);
    // eslint-disable-next-line
    const [productsDataShow, setproductsDataShow] = useState({});

    const calpctC = (e) =>{
        let thePventa = Number(productData.pventa.replace(/\./g, ''))
        let pct = (((thePventa-e)/e)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpctV = (e) =>{
        let thePcosto = Number(productData.pcosto.replace(/\./g, ''))
        let pct = (((e-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpventa = (e) =>{
        let thePcosto = Number(productData.pcosto.replace(/\./g, ''))
        let newPventa = (thePcosto + (thePcosto*e/100)).toFixed(2).toString();
        changeValuesProducts('pventa', Formater(newPventa));
        //newPventa = newPventa.replace(/\./g, ',');
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

    const Formater = (number) =>{
        if (!number) return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberfromat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }

    const handleError = () =>{
        //console.log(`img ${codigo} not found`);
        setImgSrc(imgPlaceHolder)
    }

    const prepData = () =>{
        /*
            Here FIRST CHANGE THE PCOSTO AND PVENTA TO NUMBERS
        */
        location.state.pventa = Number(productData['pventa'].replace(/\./g, '')); // change to numer
        location.state.pcosto = Number(productData['pcosto'].replace(/\./g, '')); // change to number 
        location.state.inventario = Number(productData['inventario'].replace(/\./g, '')); // change to number 
        location.state.invMinimo = Number(productData['invMinimo'].replace(/\./g, '')); // change to number 
        location.state.invMaximo = Number(productData['invMaximo'].replace(/\./g, '')); // change to number 
        console.log(location.state);
    }

    const handleBtn1 = () =>{
        /*
            validate in case of changes
        */
        prepData();
        /*Function to change the backend, I guess, with the location.state*/
        navigate('/ProductsList')
    }

    const handleBtn2 = () =>{
        /*
            validate in case of changes
        */
        setShow1(true)
    }


    useEffect(() => {
        if (location.state){
            if(location.state.pventa && location.state.pcosto){
                let pct = (((location.state.pventa-location.state.pcosto)/location.state.pcosto)*100).toFixed(2).toString();        
                pct = pct.replace(/\./g, ',');
                setpctGan(pct);
            }
            location.state.pventa = Formater(location.state.pventa)
            location.state.pcosto = Formater(location.state.pcosto)
            location.state.inventario = Formater(location.state.inventario)
            location.state.invMinimo = Formater(location.state.invMinimo)
            location.state.invMaximo = Formater(location.state.invMaximo)
            setProductData(location.state);
            setSection('Modificar producto');
            setButtons("Modificar producto");
            setModificarProducto(true);
        } else {
            setSection('Nuevo Producto');
        }
        // eslint-disable-next-line
    },[]);

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
                            onchange={(e)=>{changeValuesProducts('pcosto', e);calpctC(e)}}
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
                            onchange={(e)=>{calpventa(e)}}
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
                            onchange={(e)=>{changeValuesProducts('pventa', e);calpctV(e)}}
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
                    {modificarProducto ?
                        <div className="ProImgContainer">
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={imgSrc}
                                />
                                <img
                                    style={{width: '100%'}}
                                    src={imgSrc}
                                    onError={handleError}
                                    alt="imgProducto"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        :
                        <></>
                    }
                    <textarea
                        type="textbox"
                        className="taStnd npTextArea"
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
                            {modificarProducto ?
                                <label>{productData.inventario}</label>
                            :
                                <TheInput
                                    val={productData.inventario}
                                    numType={'nat'}
                                    onchange={(e)=>{changeValuesProducts('inventario', e)}}
                                />
                            }
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv minimo</label>
                        </div>
                        <div className='Colmn2'>
                            <TheInput
                                //val={productData.invMinimo}
                                numType={'nat'}
                                onchange={(e)=>{changeValuesProducts('invMinimo', e)}}
                            />
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv maximo</label>
                        </div>
                        <div className='Colmn2'>
                            <TheInput
                                val={productData.invMaximo}
                                numType={'nat'}
                                onchange={(e)=>{changeValuesProducts('invMaximo', e)}}
                            />                                
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
            <div style={{display: 'flex', padding: '0px 4%'}}>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{handleBtn1()}}>{buttons}</button>
                {modificarProducto &&
                    <>
                        <button
                            style={{ margin: '0px 10px' }}
                            className='btnStnd btn1'
                            onClick={() => { handleBtn2() }}
                        >Modificar inventario</button>
                        {show1 &&
                            <UserConfirm
                                show={setShow1}
                                confirmed={(e)=>{if(e){prepData();navigate('/InvAdjustment', {state: location.state})}}}/>
                        }
                    </>
                }
                    
                <button
                    style={{marginLeft: 'auto'}}
                    className='btnStnd btn1'
                    onClick={()=>{navigate(-1)}}>Cancelar</button>
            </div>
        </section>
    );
}