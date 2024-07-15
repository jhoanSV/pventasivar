import React, { useEffect, useState } from 'react';
import "./_newproduct.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput, UserConfirm } from '../../Components';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'
import { GranelModal } from '../../Components/Modals/GranelModal';
import { NuevoProducto } from '../../api';

export const Newproduct = () => {
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
    const { setSection, someData, setSomeData, setInvAdAuth, usD } = useTheContext();
    const [imgSrc, setImgSrc] = useState(someData && `https://sivarwebresources.s3.amazonaws.com/AVIF/${someData.cod}.avif`)
    const [selectedCategory, setSelectedCategory] = useState(''); // set the selected category
    const [buttons, setButtons] = useState("Crear producto");
    const [productData, setProductData] = useState({'Cod':'','Descripcion':'', 'InvMaximo':'', 'InvMinimo':'', 'Inventario': '', 'PCosto':'', 'PVenta': '', 'Ubicacion':'', 'Detalle':''});
    const [modificarProducto, setModificarProducto] = useState(false);
    const [pctGan, setpctGan] = useState('');
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    // eslint-disable-next-line
    const [productsDataShow, setproductsDataShow] = useState({});

    const calpctC = (e) =>{
        let thePventa = Number(productData.PVenta.replace(/\./g, ''))
        let pct = (((thePventa-e)/e)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpctV = (e) =>{
        let thePcosto = Number(productData.PCosto.replace(/\./g, ''))
        let pct = (((e-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    const calpventa = (e) =>{
        let thePcosto = Number(productData.PCosto.replace(/\./g, ''))
        let newPventa = (thePcosto + (thePcosto*e/100)).toFixed(2).toString();
        changeValuesProducts('PVenta', Formater(newPventa));
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

    const NPToNumber = (num) =>{
        let a
        if (!(typeof(num) === 'number')){
            a = Number(num.replace(/\./g, ''))
        }else{
            a = num
        }
        return a
    }

    const prepData = () =>{
        let d = {...productData}
        d.PVenta = NPToNumber(d['PVenta'])
        d.PCosto = NPToNumber(d['PCosto'])
        d.Inventario = NPToNumber(d['Inventario'])
        d.InvMinimo = NPToNumber(d['InvMinimo'])
        d.InvMaximo = NPToNumber(d['InvMaximo'])
        
        //setSomeData(d);
        return d;
        /*
            Here FIRST CHANGE THE PCOSTO, PVENTA and others TO NUMBERS
        */
    }

    const handleBtn1 = async() =>{
        /*
            validate in case of changes
        */
        let a = prepData();
        console.log(productData);
        console.log(a);
        a.IdFerreteria = usD.Cod;
        const fecha = new Date()
        const today = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds()
        a.Fecha = today
        // *Determinadas----------------------------
        a.CodResponsable = usD.Cod;
        a.Responsable = usD.Ferreteria;
        a.Motivo = "Nuevo producto al inventario";
        // *----------------------------------------
        a.SubCategoria = 1;
        a.Clase = false
        a.Iva = 19 //* En discusión 
        const res = await NuevoProducto(a)
        console.log(res);
        if(res){
            navigate('/ProductsList')
        }else{
            alert('Ocurrió un error inesperado al crear o modificar el producto');
        }
    }

    const handleBtn2 = () =>{
        /*
            validate in case of changes
        */
        setShow1(true)
    }

    useEffect(() => {        
        if (someData){
            let data = {...someData}
            if(data.PVenta && data.PCosto){
                let pct = (((data.PVenta-data.PCosto)/data.PCosto)*100).toFixed(2).toString();
                pct = pct.replace(/\./g, ',');
                setpctGan(pct);
            }
            data.PVenta = Formater(data.PVenta)
            data.PCosto = Formater(data.PCosto)
            data.Inventario = Formater(data.Inventario)
            data.InvMinimo = Formater(data.InvMinimo)
            data.InvMaximo = Formater(data.InvMaximo)
            setProductData(data);
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
                        <label>Codigo</label>
                    </div>
                    <div className='Colmn2'>
                        <input 
                            type="text"
                            className=""
                            onChange={(e)=>changeValuesProducts("Cod", e.target.value)}
                            value={productData.Cod}/>
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
                            onChange={(e)=>changeValuesProducts("Descripcion", e.target.value)}
                            value={productData.Descripcion}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Costo</label>
                    </div>
                    <div className='Colmn2'>
                        <TheInput
                            val={productData.PCosto}
                            numType={'real'}
                            onchange={(e)=>{changeValuesProducts('PCosto', e);calpctC(e)}}
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
                            val={productData.PVenta}
                            numType={'real'}
                            onchange={(e)=>{changeValuesProducts('PVenta', e);calpctV(e)}}
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
                            <input type="text" className="" value={productData.Descripcion} onChange={(e)=>changeValuesProducts("Descripcion", e.target.value)}/*change to category*/ readOnly={productData.IdFerreteria ? false : true}/>
                        </div>
                    </div>
                }
                <div className={'Row salesMethod '+((productData.Cod && productData.Descripcion && productData.PCosto && productData.PVenta) && 'show')}>
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
                            <input type="radio" className="custom-radio" name="uniorpack" onClick={()=>{setShow2(true)}}/>
                            <i></i>
                            granel
                        </label>
                    </div>
                </div>
                {show2 && <GranelModal show={setShow2} productData={productData} pctGan={pctGan}/>}
                <div className="Row" style={{padding: '35px'}}>
                    {modificarProducto ?
                        <div className="ProImgContainer">
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={imgSrc}
                                />
                                <img                                    
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
                        value={productData.Detalle}
                        onChange={(e)=>changeValuesProducts("Detalle", e.target.value)}
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
                                <label>{productData.Inventario}</label>
                            :
                                <TheInput
                                    val={productData.Inventario}
                                    numType={'nat'}
                                    onchange={(e)=>{changeValuesProducts('Inventario', e)}}
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
                                val={productData.InvMinimo}
                                numType={'nat'}
                                onchange={(e)=>{changeValuesProducts('InvMinimo', e)}}
                            />
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv maximo</label>
                        </div>
                        <div className='Colmn2'>
                            <TheInput
                                val={productData.InvMaximo}
                                numType={'nat'}
                                onchange={(e)=>{changeValuesProducts('InvMaximo', e)}}
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
                                onChange={(e)=>changeValuesProducts("Ubicacion", e.target.value)}
                                value={productData.Ubicacion}/>
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
                                confirmed={(e)=>{if(e){setInvAdAuth(true);navigate('/InvAdjustment')}}}/>
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