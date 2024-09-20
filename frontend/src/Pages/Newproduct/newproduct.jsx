import React, { useEffect, useState } from 'react';
import "./_newproduct.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheAlert, TheInput, UserConfirm } from '../../Components';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'
import { GranelModal } from '../../Components/Modals/GranelModal';
import { NuevoProducto, postUpdateInventory, UpdateProduct } from '../../api';

export const Newproduct = () => {
    
    const navigate = useNavigate()
    const { setSection, someData, setInvAdAuth, usD, productCodes, subC, categories } = useTheContext();
    const [imgSrc, setImgSrc] = useState(someData && `https://sivarwebresources.s3.amazonaws.com/AVIF/${someData.Cod}.avif`)
    const [selectedCategory, setSelectedCategory] = useState(''); // set the selected category
    const [buttons, setButtons] = useState("Crear producto");
    const [productData, setProductData] = useState({
        'Cod': '',
        'Descripcion': '',
        'InvMaximo': '',
        'InvMinimo': '',
        'Inventario': '',
        'PCosto': '',
        'PVenta': '',
        'IdSubCategoria':'',
        'Ubicacion': '',
        'Medidas': [],
        'Detalle': '',
        'Clase': '',
    });
    const [modificarProducto, setModificarProducto] = useState(false);
    const [pctGan, setpctGan] = useState('');
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    // eslint-disable-next-line
    const [productsDataShow, setproductsDataShow] = useState({});
    const [subCatList, setSubCatList] = useState(/*productData.Categoria ?  : */subC);

    const calpctC = (e) => {
        let thePcosto = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePventa = Number(productData.PVenta.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        let pct = ((thePventa - thePcosto) / thePcosto) * 100;
        pct = pct % 1 === 0 ? pct : pct.toFixed(2);
        //pct = pct.replace(/\./g, ',');
        setpctGan(Formater(pct));
    }
    
    const calpventa = (e) => {
        let Epct = e.replace(/[.,]/g, (a) => (a === "," && "."))
        let thePcosto = Number(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        let newPventa = (thePcosto + (thePcosto * Epct / 100)).toFixed(2).toString();
        changeValuesProducts('PVenta', Formater(newPventa));
    }

    const calpctV = (e) => {
        let thePventa = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePcosto = Number(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        let pct = (((thePventa - thePcosto) / thePcosto) * 100)
        pct = pct % 1 === 0 ? pct : pct.toFixed(2);
        //pct = pct.replace(/\./g, ',');
        setpctGan(Formater(pct));
    }

    const changeValuesProducts = (key, value) => {
        //This function allows us to change the one specific value in the product data
        setProductData(prevValue => ({
            ...prevValue, // Copia los valores anteriores
            [key]: value // Reemplaza el valor de la clave específica
        }));
    }

    const handleSelectedCategory = (value2Ch, e) => {
        //*This function handles the selected category and
        console.log(value2Ch, e.target.value);
        if(value2Ch === 'Categoria'){
            if(e.target.value!==''){
                setSelectedCategory(e.target.value);
                //changeValuesProducts('Categoria', categories.find(c => c.IdCategoria === Number(e.target.value)).Categoria);
                setSubCatList(subC.filter(c => c.IdCategoria === Number(e.target.value)));
                console.log(subC.filter(c => c.IdCategoria === Number(e.target.value)));
            }else{
                //changeValuesProducts('Categoria', '');
                setSelectedCategory('');
                setSubCatList(subC);
            }
        }else{
            if(e.target.value!==''){
                console.log(e.target.value);
                console.log(subC[e.target.value-1].IdCategoria);
                setSelectedCategory(subC[e.target.value-1].IdCategoria);
                setSubCatList(subC.filter(c => c.IdCategoria === Number(subC[e.target.value-1].IdCategoria)));
                changeValuesProducts('IdSubCategoria', Number(e.target.value));
            }else{
                //changeValuesProducts('Categoria', '');
                changeValuesProducts('IdSubCategoria', '')
                //setSelectedCategory('')
            }
        }
    };

    const Formater = (number) => {
        if(!number)return '';
        let thenumber = typeof (number) === 'number' ? number.toString() : number
        //it gives a number format
        const numberfromat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }

    const handleError = (e) => {
        console.log('error?', e);
        
        setImgSrc(imgPlaceHolder)

    }

    const NPToNumber = (num) => {
        let a
        if (!(typeof (num) === 'number')) {
            a = Number(num.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        } else {
            a = num
        }
        return a
    }

    const prepData = () => {
        let d = {...productData}
        let ms = d.Medidas.map(item => ({ ...item }));
        if(d.Medidas.length !== 0){
            ms.forEach((item) => {
                if (item.PVentaUM==='' && item.UMedida) {
                    let v = NPToNumber(d.PCosto) / NPToNumber(item.UMedida) + 
                        NPToNumber(d.PCosto) / 
                        NPToNumber(item.UMedida)*Number(pctGan.replace(/,/g, '.'))/100;
                    v = v % 1 === 0 ? v.toString() : v.toFixed(2);
                    item.PVentaUM = Number(v);
                }else{
                    item.PVentaUM = NPToNumber(item.PVentaUM);
                }
                item.UMedida = NPToNumber(item.UMedida);
                delete item.pctUM;
            });
            d.Medidas = ms;
        }/*else if(d.Medidas.length===0&&d.Clase!==0){

        }*/
        
        d.PVenta = NPToNumber(d['PVenta'])
        d.PCosto = NPToNumber(d.PCosto)
        d.Inventario = NPToNumber(d['Inventario'])
        d.InvMinimo = NPToNumber(d['InvMinimo'])
        d.InvMaximo = NPToNumber(d['InvMaximo'])
        return d;
        /*
            Here FIRST CHANGE THE PCOSTO, PVENTA and others TO NUMBERS
        */
    }

    const handleBtn1 = async () => {
        //*Validations-------------------------------------------------------
        let emptValue;
        for (let key in productData) {
            if ((key !== 'Detalle' &&
                key !== 'Ubicacion' &&
                //key !== 'Clase' &&
                key !== 'Medida'
            ) && productData[key] === '') {
                emptValue = key; // Si algún campo está vacío, la validación falla
            }
        }
        if (emptValue) {
            let text1 = emptValue;
            if(text1 === 'IdSubCategoria') text1 = 'Sub-Categoría';
            if(text1 === 'Clase') text1 = 'Modo de venta';
            if(text1 === 'Inventario') text1 = 'Inv Actual';
            TheAlert('El campo '+ text1 + ' no puede estar vacío');
            return;
        }
        if(productData.Clase!==0&&productData.Medidas.length===0){
            TheAlert('Revisar medidas de venta para granel');
            return;
        }
        const codeFind = productCodes.map(code => code.toLowerCase()).includes(productData.Cod.toLowerCase());
        if(codeFind){
            TheAlert('El código de producto ya existe');
            return;
        }
        //*------------------------------------------------------------------
        let a = prepData();
        a.IdFerreteria = usD.Cod;
        const fecha = new Date();
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
        a.Fecha = today;
        // *Determinadas----------------------------
        a.CodResponsable = usD.Cod;
        a.Responsable = usD.Ferreteria;
        a.Motivo = "Nuevo producto al inventario";
        // *----------------------------------------
        a.Iva = 19 //* En discusión 
        console.log(a);
        const res = await NuevoProducto(a);
        console.log(res);
        if(res && res.message === 'Transacción completada con éxito'){
            navigate('/ProductsList');
            TheAlert('Producto creado con éxito');
        } else {
            TheAlert('Ocurrió un error inesperado al crear el producto');
        }
    }

    const handleBtn2 = async() => {
        //*Validations---------------------------
        let emptValue;
        for (let key in productData) {
            if ((key !== 'Detalle' &&
                key !== 'Ubicacion' &&
                //key !== 'Clase' &&
                key !== 'Medida'
            ) && productData[key] === '') {
                emptValue = key; // Si algún campo está vacío, la validación falla
                productData.Medidas.forEach(med => {
                    if(med.UMedida===''){
                        emptValue = med.Medida + ' de granel'
                    }
                });
            }
        }
        if (emptValue) {
            let text1 = emptValue;
            if(text1 === 'IdSubCategoria') text1 = 'Sub-Categoría';
            TheAlert('El campo '+ text1 + ' no puede estar vacío');
            return;
        }
        if(productData.Clase!==0&&productData.Medidas.length===0){
            TheAlert('Revisar medidas de venta para granel');
            return;
        }
        const codeFind = productCodes.map(code => code.toLowerCase()).includes(productData.Cod.toLowerCase());
        if((productData.Cod !== someData.Cod) && codeFind){
            TheAlert('El código de producto ya existe');
            return;
        }
        //*---------------------------------------
        let a = prepData();
        a.IdFerreteria = usD.Cod;
        a.Iva = 19 //* En discusión 
        a.ConsecutivoProd = someData.Consecutivo
        console.log(productData);
        console.log(a);
        if(modificarProducto && ((someData.PCosto!==0&&!someData.PVenta!==0)||someData.Inventario!==0)){
            console.log('Es para modificar un producto ya creado pero que no tiene inventario por lo que no está creado en mi inventario sjj');
            const fecha = new Date();
            const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
            const res = await postUpdateInventory({
                "IdFerreteria": someData.IdFerreteria,
                "CodResponsable": usD.Cod,
                "Responsable": usD.Ferreteria,
                "ConsecutivoProd": someData.Consecutivo,
                "Cantidad": someData.Inventario,
                "Fecha": today,
                "Motivo": 'Agregar producto a inventario'
            });
            if(!(res && res.message === 'Transacción completada con éxito')){
                await TheAlert('Ocurrió un error inesperado al agregar producto al inventario');
                return;
            }
        }
        const res2 = await UpdateProduct(a);
        console.log(res2);
        if(res2 && res2.message === 'Transacción completada con éxito'){
            navigate('/ProductsList');
            TheAlert('Producto modificado con éxito');
        } else {
            TheAlert('Ocurrió un error inesperado al modificar el producto');
        }
    }

    const modfInv = async () =>{
        setShow1(true)
    }

    const handleCodVali = () =>{
        const codeFind = productCodes.map(code => code.toLowerCase()).includes(productData.Cod.toLowerCase());
        if(modificarProducto && someData){
            if((productData.Cod !== someData.Cod) && codeFind){
                return true
            }else{
                return false
            }
        }else{
            if(codeFind){
                return true
            }else{
                return false
            }
        }
    }

    useEffect(() => {
        if (someData) {
            let data = { ...someData }
            console.log({...data});
            if (data.PVenta && data.PCosto) {
                let pct = ((data.PVenta - data.PCosto) / data.PCosto) * 100
                pct = pct % 1 === 0 ? pct : pct.toFixed(2);
                //pct = pct.replace(/\./g, ',');
                setpctGan(Formater(pct));
                if (data.Medidas.length !== 0){
                    data.Medidas.forEach((medida) => {
                        let pctum = medida.UMedida ? (medida.PVentaUM - data.PCosto/medida.UMedida) / (data.PCosto/medida.UMedida) * 100 : Number(pct);
                        pctum = pctum % 1 === 0 ? pctum : pctum.toFixed(2);
                        medida.pctUM = Formater(pctum);
                        medida.UMedida = Formater(medida.UMedida);
                        medida.PVentaUM = Formater(medida.PVentaUM);
                    })
                }
            }
            data.PVenta = Formater(data.PVenta);
            data.PCosto = Formater(data.PCosto);
            data.Inventario = Formater(data.Inventario);
            data.InvMinimo = Formater(data.InvMinimo);
            data.InvMaximo = Formater(data.InvMaximo);
            console.log(data);
            setSelectedCategory(data.Categoria.toLowerCase());
            setProductData(data);
            setSection('Modificar producto');
            setButtons("Modificar producto");
            setModificarProducto(true);
        } else {
            setSection('Nuevo Producto');
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log('-->', productData);
    }, [productData]);

    return (
        <section className='Newproduct'>
            <div style={{ position: 'relative' }}>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Codigo</label>
                    </div>
                    <div className='Colmn2'>
                        <div style={{position: 'relative', width: '41%'}}>
                            <input
                                style={{width: '100%'}}
                                type="text"
                                className=""
                                onChange={(e) => changeValuesProducts("Cod", e.target.value)}
                                value={productData.Cod}
                                disabled={productData.IdFerreteria===0}
                                />
                            <div className={(handleCodVali()) ? 'warningCloud' : 'd-none'}>
                                Este c&oacute;digo ya existe
                            </div>
                        </div>
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
                            onChange={(e) => changeValuesProducts("Descripcion", e.target.value)}
                            value={productData.Descripcion}
                            disabled={productData.IdFerreteria===0}
                            />
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
                            onchange={(e) => { changeValuesProducts('PCosto', e); calpctC(e) }}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>% ganancia</label>
                    </div>
                    <div className='Colmn2' style={{position: 'relative'}}>
                        <TheInput
                            val={pctGan}
                            numType={'real'}
                            onchange={(e) => { setpctGan(e); calpventa(e) }}
                        />
                        <span style={{position: 'absolute', top: '6px', left: 3+pctGan.length+'%'}}>
                            %
                        </span>
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
                            onchange={(e) => { changeValuesProducts('PVenta', e); calpctV(e) }}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Categoria</label>
                    </div>
                    <div className='Colmn2'>
                        {/*selectedCategory*/}
                        {/*['tornilleria', 'estudiantil', 'gas', 'griferia', 'electricos', 'ebanisteria'].map((item, index) => (
                            <label key={index} className="catIconLabel">
                                <input type="radio" name="catPack"
                                className={`cr${item}`}
                                checked={handleCatChecked(item)}
                                onChange={()=>{
                                    setSelectedCategory(item);
                                }}
                                />
                                <i className={`icon-${item}`}></i>
                            </label>
                        ))*/}
                        <select value={selectedCategory} onChange={(e)=>{handleSelectedCategory('Categoria', e)}} style={{width: '41%'}} disabled={productData.IdFerreteria===0}>
                            <option value="">Categoria...</option>
                            {categories.map(c => (
                                <option key={c.IdCategoria} value={c.IdCategoria}>
                                    {c.Categoria.charAt(0).toUpperCase() + c.Categoria.slice(1).toLowerCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Sub-Categor&iacute;a</label>
                    </div>
                    <div className='Colmn2'>
                        <select value={productData.IdSubCategoria} onChange={(e)=>{handleSelectedCategory('subCat', e)}} style={{width: '41%'}} disabled={productData.IdFerreteria===0}>
                            <option value="">Seleccione...</option>
                            {subCatList.map(sc => (
                                <option key={sc.IdSubCategoria} value={sc.IdSubCategoria}>{sc.SubCategoria}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* {modificarProducto && //* For the next step
                    <div className='Row'>
                        <div className='Colmn1'>
                            <label>Proveedor</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className="" value={productData.Descripcion} onChange={(e) => changeValuesProducts("Descripcion", e.target.value)} readOnly={productData.IdFerreteria ? false : true} />
                        </div>
                    </div>
                } */}
                <div className={'Row salesMethod ' + ((productData.Cod && productData.Descripcion && productData.PCosto && productData.PVenta) && 'show')}>
                    <div className='Colmn1'>
                        <label>Modo de venta:</label>
                    </div>
                    <div className='Row'>
                        { productData.IdFerreteria !== 0 &&
                        <label className="custom-label">
                            <input type="radio" className="custom-radio" name="uniorpack"
                                checked={productData.Clase===0}
                                onChange={() => { 
                                    let pd = {...productData}
                                    pd.Clase = 0
                                    pd.Medidas = []
                                    setProductData(pd);
                                }}
                            />
                            <i></i>
                            por unidad
                        </label>}
                        <label className="custom-label">
                            <input type="radio" className="custom-radio" name="uniorpack"
                                checked={productData.Clase!==0 && productData.Clase!==''}
                                onChange={() => { }}
                                onClick={() => { setShow2(true) }}
                            />
                            <i></i>
                            granel
                        </label>
                    </div>
                </div>
                {show2 && <GranelModal show={setShow2} productData={productData} pctGan={pctGan} updtState={changeValuesProducts}/>}
                <div className="Row" style={{ padding: '35px' }}>
                    {(modificarProducto && productData.IdFerreteria === 0) ?
                        <div className="ProImgContainer">
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={imgSrc}
                                />
                                <img
                                    onError={(e)=>handleError(e)}
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
                        onChange={(e) => changeValuesProducts("Detalle", e.target.value)}
                    />
                </div>


                <div className='Inv'>
                    <div className='InvLabel'>
                        <strong>Inventario</strong>
                    </div>
                    <div className="Row" style={{ marginTop: '15px' }}>
                        <div className='Colmn1'>
                            <label>Inv actual</label>
                        </div>
                        <div className='Colmn2'>
                            {modificarProducto && ((someData.PCosto!==0&&!someData.PVenta!==0)||someData.Inventario!==0) ?
                                <label>{Formater(productData.Inventario)==='' ? 0 : Formater(productData.Inventario)}</label>
                                :
                                <TheInput
                                    val={productData.Inventario}
                                    numType={'nat'}
                                    onchange={(e) => { changeValuesProducts('Inventario', e) }}
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
                                onchange={(e) => { changeValuesProducts('InvMinimo', e) }}
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
                                onchange={(e) => { changeValuesProducts('InvMaximo', e) }}
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
                                onChange={(e) => changeValuesProducts("Ubicacion", e.target.value)}
                                value={productData.Ubicacion} />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', padding: '0px 4%' }}>
                <button
                    className='btnStnd btn1'
                    onClick={() => { modificarProducto ? handleBtn2() : handleBtn1() }}>{buttons}</button>
                {modificarProducto &&
                    <>
                        <button
                            style={{ margin: '0px 10px' }}
                            className='btnStnd btn1'
                            onClick={() => { modfInv() }}
                        >Modificar inventario</button>
                        {show1 &&
                            <UserConfirm
                                show={setShow1}
                                confirmed={(e) => { if (e) { setInvAdAuth(true); navigate('/InvAdjustment')}}}
                            />
                        }
                    </>
                }

                <button
                    style={{ marginLeft: 'auto' }}
                    className='btnStnd btn1'
                    onClick={() => { navigate(-1) }}>Cancelar</button>
            </div>
        </section>
    );
}