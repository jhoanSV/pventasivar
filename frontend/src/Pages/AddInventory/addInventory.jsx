import React, { useEffect, useRef, useState } from 'react';
import "./_addInventory.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { Inventory, AddProduct, Alias  } from '../../api';
import { Flatlist, ModalBusca, TheAlert } from '../../Components';
import { CSSTransition } from 'react-transition-group';
import { Formater } from '../../App';

export function AddInventory(){
    const navigate = useNavigate()
    const { setSection, usD } = useTheContext();
    //*useState
    const [ invList, setInvList] = useState([]);
    const [ showFL, setShowFL] = useState(false);
    const [ sBText, setSBText] = useState('');
    const [ selectedFLI, setSelectedFLI] = useState(0);
    const [ productData, setProductData] = useState({
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
        'Medida': '',
        'UMedida': ''
    });
    const [ cantidadYProveedor, setcantidadYProveedor] = useState({
        'Cantidad': '',
        'Proveedor': ''
    })
    //*useRef
    const refList = useRef([]);
    const nodeRef = useRef(null);
    const selectedFLIRef = useRef(selectedFLI);
    const isEditingRef = useRef(false);
    const invListRef = useRef([]);
    const asktoaddRef = useRef(null);
    const theProductRef = useRef([]);
    const refAliasList = useRef([]);

    const handleKeyDown = async(e) => {
        if(document.getElementById('NPinputNP') === document.activeElement){
            const theInvList = invListRef.current
            if (e.key === 'ArrowDown') {
                if(selectedFLIRef.current === theInvList.slice(0, 20).length-1){
                    selectedFLIRef.current = 0
                }else{
                    selectedFLIRef.current = selectedFLIRef.current + 1
                }
            } else if (e.key === 'ArrowUp') {
                if(selectedFLIRef.current === 0){
                    selectedFLIRef.current = theInvList.slice(0, 20).length-1;
                }else{
                    selectedFLIRef.current = selectedFLIRef.current-1;
                }
            } else if (e.key === 'Enter') {
                const selectedItem = theInvList[selectedFLIRef.current];
                if(!selectedItem){
                    document.getElementById('NPinputNP').focus();
                    document.getElementById('NPinputNP').select();
                    return;
                } 
                asktoaddRef.current(selectedItem);
            }
            setSelectedFLI(selectedFLIRef.current);
        }
    };

    useEffect(() => {
        setSection('Agregar al inventario')
        fetchInventoryList()
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    const askToAddProduct = (item) => {
        toModifyProduct(item)
        setShowFL(false)
    }
    
    const cancel = async(valueBoolean) => {
        if (valueBoolean) {
            setProductData({
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
                'Medida': '',
                'UMedida': 1,
            });
            setcantidadYProveedor({
                'Cantidad': '',
                'Proveedor': ''
            })
        }
    }

    const toModifyProduct = (dataProduct) => {
        console.log(dataProduct)
        let data = {...dataProduct}
        let medida = data.Medidas.length !==0 ? data.Medidas.find(med => med.UMedida === 1).Medida : 'Unidad';
        data.PVenta = Formater(data.PVenta);
        data.PCosto = Formater(data.PCosto);
        data.Inventario = Formater(data.Inventario);
        data.InvMinimo = Formater(data.InvMinimo);
        data.InvMaximo = Formater(data.InvMaximo);
        data.Medida = medida
        setProductData(data);
        theProductRef.current = data
    }

    const changeValuesProducts = (key, value) => {
        //This function allows us to change the one specific value in the product data
        setProductData(prevValue => ({
            ...prevValue, // Copia los valores anteriores
            [key]: value // Reemplaza el valor de la clave específica
        }));
    }

    const filterByText = (item, text) => 
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const fetchInventoryList = async() =>{
        const list = await Inventory({
            "IdFerreteria": usD.Cod
        })
        const aliasList1 = await Alias()
        if(list){
            setInvList(list);
            refList.current = list;
            refAliasList.current = aliasList1;
        }
    }

    const SearchHandle = (text) =>{
        setSBText((text))
        let c = refList.current;
        if (text !== ''){
            setInvList(c.filter((i)=>filterByText(i, text)));
            console.log(invList)
        }else{
            fetchInventoryList();
        }
    }

    const calpventa = (e) => {
        if (e > 0) {
            let Epct = e.replace(/[.,]/g, (a) => (a === "," && "."))
            console.log('Epct', Epct)
            let Pventa = Number(theProductRef.current.PVenta.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
            let thePcosto = Number(theProductRef.current.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
            let ganancia = (Pventa - thePcosto)/thePcosto
            console.log(ganancia)
            let newPventa = (Epct * (1 + ganancia)).toFixed(2).toString();
            let newPCosto = Number(Epct).toFixed(2).toString()
            console.log('newPventa',newPventa)
            changeValuesProducts('PCosto', e);
            changeValuesProducts('PVenta', Formater(newPventa));
        } else {
            changeValuesProducts('PVenta', Formater(theProductRef.current.PVenta));
        }
    }

    const toAddInventory = async() => {
        const fecha = new Date();
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
        let data = {...productData}

        if (cantidadYProveedor.Cantidad === '' || cantidadYProveedor.Cantidad === 0){
            TheAlert('La cantidad no puede ser 0')
        } else if (data.PCosto === '' || data.PCosto === 0) {
            TheAlert('El costo no puede ser 0')
        } else if (data.PVenta === '' || data.PVenta === 0) {
            TheAlert('El precio de venta no puede ser 0')
        } else {
            let newData = {
                IdFerreteria: usD.Cod,
                ConsecutivoProd: data.Consecutivo,
                Cantidad: cantidadYProveedor.Cantidad ,
                Cod: data.Cod,
                Descripcion: data.Descripcion,
                PCosto: data.PCosto.replace(/[.,]/g, (a)=>(a === '.'? '': ',')),
                PCostoLP: theProductRef.current.PCosto.replace(/[.,]/g, (a)=>(a === '.'? '': ',')),
                PVenta: data.PVenta.replace(/[.,]/g, (a)=>(a === '.'? '': ',')),
                Fecha: today,
                Iva: data.Iva,
                CodResponsable: usD.Cod,
                Responsable: usD.Contacto,
                Motivo: 'compra externa',
                ConsecutivoCompra: 0,
                Medida: data.Medida,
                UMedida: 1
            }
            //data.PCostoLP = theProductRef.current.PCosto.replace(/[.,]/g, (a)=>(a === '.'? '': ','))
            //data.PCosto = data.PCosto.replace(/[.,]/g, (a)=>(a === '.'? '': ','))
            //data.PVenta = data.PVenta.replace(/[.,]/g, (a)=>(a === '.'? '': ','))
            console.log(newData)
            const addTheProduct = await AddProduct(newData)
            if (addTheProduct.status === 200) {
                const MoreAdd = await TheAlert('Se añadio con exito, ¿desea añadir mas productos?', 1)
                if (MoreAdd) {
                    cancel(true)
                } else {
                    navigate('/PurchaseList')
                }
            }
        }
    }

    const theCantidad = (e) => {
        let data = {...cantidadYProveedor}
        data.Cantidad = e
        setcantidadYProveedor(data)
    }

    return (
        <section className='InvAdjustment'>
            <div id="RowSearch">
                <label>Buscar:</label>
                <div>
                    <input type="text"
                        className=''
                        id='NPinputNP'
                        onChange={(e) => {
                            changeValuesProducts("Descripcion", e.target.value);
                            SearchHandle((e.target.value).toLowerCase(), setInvList);
                            selectedFLIRef.current = 0
                        }}
                        value={productData.Descripcion}
                        onFocus={(e)=>{
                            setShowFL(true);
                            isEditingRef.current=true;
                            e.target.select();}}
                        onBlur={()=>{isEditingRef.current=false;}}
                        autoComplete='off'
                        placeholder='Buscar'
                    />
                    <CSSTransition
                        timeout={200}
                        in={sBText !== '' && showFL}
                        nodeRef={nodeRef}
                        classNames="FLA"
                        unmountOnExit
                        >
                        <div id='flId' className="FloatingList" ref={nodeRef} style={{width:'60%'}}>
                            {invList.slice(0,20).map((item, index) =>
                                <div key={index}
                                    className={`flItem ${index === selectedFLI ? 'selected' : ''}`}
                                    onClick={()=>{
                                        askToAddProduct(item)}}
                                    style={{color: Number(item.Inventario)<=0 && 'red'}}
                                >
                                    {item.Descripcion}
                                    <div className='codFlitem'>
                                        {item.Cod}
                                    </div>
                                </div>
                            )}
                            {invList.length === 0 ?
                                <div className='flItem'>
                                    No se encuentran coincidencias                                                                                                            
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </CSSTransition>
                </div>
                <ModalBusca
                    list={refList.current}
                    Alias={refAliasList.current}
                    click={askToAddProduct}
                    sh={SearchHandle}
                />
            </div>
            <h1>Producto: {productData.Descripcion === ''? 'Nombre del producto': productData.Descripcion}</h1>
            <h2>Codigo: {productData.Cod === ''? 'Codigo': productData.Cod}</h2>

            <div className='Row'>
                <div className='Colmn1'>
                    <label>Cantidad actual:</label>
                </div>
                <div className='Colmn 2'>
                    <label>{productData.Inventario === ''? '0': productData.Inventario}</label>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Medida:</label>
                </div>
                <div className='Colmn 2'>
                    <label>{productData.Medida? productData.Medida: ''}</label>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Agregar:</label>
                </div>
                <div className='Colmn2'>
                <TheInput
                    val={cantidadYProveedor.Cantidad}
                    numType={'real'}
                    onchange={(e) => {theCantidad(e)}}
                />
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Costo:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput
                        val={productData.PCosto}
                        numType={'real'}
                        onchange={(e) => {calpventa(e)}}
                        >
                    </TheInput>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Precio venta:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput
                        val={productData.PVenta}
                        numType={'real'}
                        onchange={(e)=>{changeValuesProducts('PVenta', e)}}>
                    </TheInput>
                </div>
            </div>
            {/*<div className='Row'>
                <div className='Colmn1'>
                    <label>Proveedor:</label>
                </div>
                <div className='Colmn2'>
                    <input
                        type="text"
                        id="i-proovedor"
                        name="i-proveedor"
                        autocomplete="off"
                        value={cantidadYProveedor.Proveedor}
                        onChange={(e) => {let data = {...cantidadYProveedor} 
                        data.Proveedor = e.target.value
                        setcantidadYProveedor(data)}}
                        >
                    </input>
                </div>
            </div>*/}
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Responsable:</label>
                </div>
                <div className='Colmn2'>
                    <label>{usD.Contacto}</label>
                </div>
            </div>
            <div id='RowSearch'>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{toAddInventory()}}
                    >Agregar
                </button>
                <button
                    className='btnStnd btn1'
                    onClick={async()=>{ const cancelAcept = await TheAlert('Se perderan los cambios si decide cancelar, ¿Desea continuar?', 1)
                                        cancel(cancelAcept)}}
                    >Cancelar
                </button>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{navigate('/NewProduct')}}
                    >Crear un producto nuevo
                </button>
            </div>
        </section>
    )
}