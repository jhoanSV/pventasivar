import React, {useEffect, useState, useRef} from 'react';
import { Flatlist, ModalBusca } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { ConfirmSaleModal } from '../../Components/Modals/ConfirmSaleModal';
import { UserConfirm } from '../../Components/Modals/UserConfirm';
import { SignClient } from '../../Components/Modals/SignClient';
import { SalesOfTheDay } from '../../Components/Modals/SalesOfTheDay';
import { ProductMeasures } from '../../Components/Modals/ProductMeasures';
import "./_sales.scss";
import jsonTest from '../../tickets-text.json';
import { useTheContext } from '../../TheProvider';
import { Inventory } from '../../api';
import { CSSTransition } from 'react-transition-group';

export function Sales(){
    //*---------------------
    const [saleTabs, setSaleTabs] = useState(jsonTest);
    const [currentTab, setCurrentTab] = useState({"index": 0, "key": 1});
    const [tabsHistory, setTabsHistory] = useState(Object.keys(saleTabs).length);
    //*---------------------
    const [ total, setTotal] = useState(0);
    const [ orderslist, setOrderslist] = useState(saleTabs[1]["Order"])
    const [ customer, setCustomer] = useState("Por asignar");
    const [ showConfirmar, setShowConfirmar] = useState(false);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ changeQuantity, setChangeQuantity] = useState(null);
    const [ changePventa, setChangePventa] = useState(null);
    const [ confirmUser, setConfirmUser] = useState(false);
    const [ searchClient, setSearchClient] = useState(false);
    const [ showSalesOfTheDay, setShowSalesOfTheDay] = useState(false);
    const [ showProductMeasures, setShowProductMeasures] = useState(false);
    const [ selectProduct, setSelectProduct] = useState(null);
    const [ showFL, setShowFL] = useState(false);
    //const [limit, setLimit] = useState(0);
    const [ sBText, setSBText] = useState('');
    const [ invList, setInvList] = useState([]);
    const nodeRef = useRef(null), divSRef = useRef();
    const refList = useRef([]);
    const selectedfilaRef = useRef(selectedfila);
    const selectedTabRef = useRef(currentTab);
    const isEditingRef = useRef(false);
    const { setSection, usD } = useTheContext();

    const handleKeyDown = (event) => {
        //const currentSelectedTab = selectedTabRef.current;
        if(isEditingRef.current===true)return;
        let theOrder = Object.entries(saleTabs)[selectedTabRef.current][1]
        console.log(selectedfilaRef.current);
        console.log(theOrder.length);
        if (theOrder.length !== 0 && selectedfilaRef.current !== null) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === '+') {
                updateCantidad(currentSelectedFila, 1)
            } else if (event.key === '-') {
                updateCantidad(currentSelectedFila,-1)
            } else if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < theOrder.length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < theOrder.length) {
                setSelectedfila(currentSelectedFila - 1)
            } else if (event.key === 'Delete') {
                console.log(theOrder);
                theOrder.splice(currentSelectedFila, 1)
                const updatedOrdersList = [...theOrder];
                console.log(updatedOrdersList);
                // Actualiza el estado con la nueva lista
                setOrderslist(updatedOrdersList);
            }
        }
    };

    const onblurChangeCuantity = (row, amount) => {
        let theOrder = Object.entries(saleTabs)[selectedTabRef.current][1]
        if (amount > 0) {
            theOrder[row].Cantidad = amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...theOrder];
            // Actualiza el estado con la nueva lista
            setOrderslist(updatedOrdersList);
        }
        setChangeQuantity(null)
    };

    const onblurChangePv = (row, amount, theKey) => {
        let theOrder = Object.entries(saleTabs)[selectedTabRef.current][1]
        console.log(theOrder);
        if (amount > 0) {
            const theValue = amount
            let withoutFormat = theValue.replace(/\./g, '')
            theOrder[row][theKey] = withoutFormat
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...theOrder];
            // Actualiza el estado con la nueva lista
            setOrderslist(updatedOrdersList);
        }
        setChangePventa(null)
    };
    
    const RowOrder = (item, index, columnsWidth) => {
        const isEditing = changeQuantity === index;
        const isEditingPv = changePventa === index;
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        const rowIndex = index;
        return (
                <>
                    <td style={{width: columnsWidth[0]}} onDoubleClick={()=>{setChangeQuantity(index);isEditingRef.current=true}}>
                        { isEditing ? (
                            <TheInput
                                id = {'i'+ rowIndex}
                                numType ='nat'
                                val = {item.Cantidad}
                                sTyle = {{width: columnsWidth[0]}}
                                onblur = {(e) => {onblurChangeCuantity(rowIndex, e);isEditingRef.current=false}}
                                autofocus={true}
                            /> ) :
                        ( 
                            <label>{item.Cantidad}</label>
                        )}
                    </td>
                    <td style={{width: columnsWidth[1]}}>
                        <label>{item.Cod}</label>
                    </td>
                    <td style={{width: columnsWidth[2]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>{item.Medida}</label>
                    </td>
                    <td style={{width: columnsWidth[4]}} onDoubleClick={()=>{setConfirmUser(true);isEditingRef.current=true}}>
                        { isEditingPv ? (
                            <TheInput
                                id = {'i'+ rowIndex}
                                numType ='real'
                                val = {item.Medida !== '' ? item.PVentaUM : item.PVenta}
                                sTyle = {{width: columnsWidth[0]}}
                                onblur = {(e) => {
                                    onblurChangePv(rowIndex, e, (item.Medida !== '' ? 'PVentaUM': 'PVenta'));
                                    isEditingRef.current=false}}
                                autofocus={true}
                            /> ) :
                        ( 
                            <label>$ {Formater(item.PVenta)}</label>
                        )}
                    </td>
                    <td style={{width: columnsWidth[5]}}>
                        <label>$ {Formater(item.PVenta * item.Cantidad)}</label>
                    </td>
                </>
        );
    };
    
    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };
    

    const updateCantidad = (selectedRow, amount) => {
        let theOrder = Object.entries(saleTabs)[selectedTabRef.current][1]
        if (theOrder[selectedRow].Cantidad + amount > 0) {
            theOrder[selectedRow].Cantidad += amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...theOrder];
            // Actualiza el estado con la nueva lista
            setOrderslist(updatedOrdersList);
        }
      };

    const ctHeaders = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Codigo',
            key: 'codigo',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: 500,
            type: 'text',
        },
        {
            header: 'U/M',
            key: 'UM',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Vr.Unitario',
            key: 'vrUnitario',
            defaultWidth: 223,
            type: 'text',
        },
        {
            header: 'Vr.Total',
            key: 'vrTotal',
            defaultWidth: 223,
            type: 'text',
        }
    ];

    const sumarTotal = () => {
        let suma = 0;
        if (orderslist && orderslist.length > 0) {orderslist.forEach((item, index) => (
            suma += item.PVenta * item.Cantidad
            //suma += item.Medida !== '' ? item.PVentaUM * item.Cantidad : item.PVenta * item.Cantidad
        ))}
        setTotal(suma)
    };

    const changeTab = (Num, index) => {
        if(Num===null){
            setOrderslist(Object.entries(saleTabs)[index][1]);
        }else{
            setOrderslist(saleTabs[Num].Order);
        }
        console.log('saleTabs[Num]', saleTabs[Num]);
        console.log(index);
        if (Num !== null && saleTabs[Num].length !== 0) {
            setSelectedfila(saleTabs[Num].length - 1);
        } else if ( Num !== null && saleTabs[Num].length === 0 ) {
            setSelectedfila(null);
        }
        setCurrentTab({"index": index,
                       "key": Num});
        console.log(saleTabs[Num].Customer.Nombre !== null);
        const custromerName = saleTabs[Num].Customer.Nombre !== null ?
        saleTabs[Num].Customer.Nombre: 'Por asignar';
        setCustomer(custromerName)
    };

    const createButton = () => {
        let tabLen = Object.keys(saleTabs).length
        if (tabLen < 16) {
            saleTabs[tabsHistory + 1] = {"Customer": {},
                                         "Order": []};
            changeTab((tabsHistory + 1), (Object.keys(saleTabs).length)-1);
            setTabsHistory(tabsHistory + 1);
        }
    };

    const closeTab = (tabNumber, index) => {
        if (Object.keys(saleTabs).length > 1 && (tabNumber in saleTabs)) {
            const newTabButtons = {...saleTabs};
            delete newTabButtons[tabNumber];
            setSaleTabs(newTabButtons);
            console.log('tabNumber: '+tabNumber+' index: '+index+' CurrentTab: '+currentTab);
            if(index < currentTab){
                setCurrentTab(currentTab-1);
            }else if(index === currentTab){
                if(index === 0){
                    changeTab(null, (index))
                }else changeTab(null, (index-1))
            }
        }
    };

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        setSBText((text))
        let c = refList.current;
        if (text !== ''){
            setInvList(c.filter((i)=>filterByText(i, text)));
        }else{
            fetchInventoryList();
        }
    }

    const addProduct = (item) =>{
        let theOrder = saleTabs[currentTab.key].Order
        const productAlreadyExists = theOrder.filter(prod => prod.Cod === item.Cod && prod.Medida === item.Medida);
        if(productAlreadyExists.length === 0){
        theOrder.push(item);
        setOrderslist(a => {
            var orderElement = document.getElementById("FlastListID");
            setTimeout(() => {
                if (orderElement) {
                    orderElement.scrollTop = orderElement.scrollHeight;
                }
              }, 0);
            return [...theOrder];
        });
        setShowFL(false);}
        else {
            console.log("El producto ya se encuentra en la lista")
            setShowFL(false);
        }
    }

    const askToAddProduct = (item) => {
        //console.log(item)
        if (item.Clase === 0){
            let theProduct = {...item}
            theProduct.Medida = 'Unidad'
            theProduct.Cantidad = 1;
            addProduct(item)
        } else if (item.Clase !== 0){
            console.log("entro a mas medidas del producto")
            setSelectProduct(item)
            setShowProductMeasures(true)
        }
    }

    const handleClickOutside = (event) => {
        if (divSRef.current && !divSRef.current.contains(event.target)) {
          setShowFL(false);
        }
    };

    const fetchInventoryList = async() =>{
        const list = await Inventory({
            "IdFerreteria": usD.Cod
        })
        console.log(list);
        if(list){
            setInvList(list);
            refList.current = list;
        }
    }

    const AsingCustomerToOrder = (item) => {
        jsonTest[currentTab.key].Customer = item[0]
        setCustomer(jsonTest[currentTab.key].Customer.Nombre + " " + jsonTest[currentTab.key].Customer.Apellido)
        setSaleTabs(jsonTest)
    }

    useEffect(() => {
        sumarTotal();
        // eslint-disable-next-line
    }, [orderslist]);
    
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);
    
    useEffect(() => {
        selectedTabRef.current = currentTab.index;
        console.log(saleTabs)
    }, [currentTab]);
    
    useEffect(() => {
        setSection('Ventas');
        fetchInventoryList();
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <section className='Sales'>
            <div className="Search">
                <div ref={divSRef} style={{position: 'relative'}}>
                    <input
                        type="text"
                        id='NPinput'
                        placeholder="Codigo del producto"
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                        style={{width: '500px'}}
                        onFocus={()=>{setShowFL(true);isEditingRef.current=true}}
                        onBlur={()=>{isEditingRef.current=false}}
                        autoComplete='hidden'
                    />
                    <CSSTransition
                        timeout={200}
                        in={sBText !== '' && showFL}
                        nodeRef={nodeRef}
                        classNames="FLA"
                        unmountOnExit
                        >
                        <div className="FloatingList" ref={nodeRef}>
                            {invList.slice(0,20).map((item, index) =>
                                <div key={index}
                                    className='flItem'
                                    onClick={()=>{Number(item.Inventario)!==0 ? askToAddProduct(item) : alert('No hay invetario suficiente')}}
                                    style={{color: Number(item.Inventario)===0 && 'red'}}
                                >
                                    {item.Descripcion}
                                </div>
                            )}
                        </div>
                    </CSSTransition>
                    {/*(sBText !== '' && showFL) &&
                    */}
                </div>
                {/*<ModalBusca/>*/}
            </div>
            <div style={{padding: '0px 70px'}}>
                <button
                    className="btnStnd btn1"
                    onClick={()=>setSearchClient(true)}
                    >Asignar cliente
                </button>
                <div>
                    <label>Cliente: {customer}</label>
                </div>
                <div className="tabs">
                    <div className='tabButtons'>
                        {Object.keys(saleTabs).map((tabNumber, index) => (
                            <div className='tabButtonModel' key={tabNumber} onClick={()=>{
                                changeTab(parseInt(tabNumber), index);
                                document.getElementById(`radio${tabNumber}`).checked = true;
                                console.log('a');
                            }}>
                                <input
                                    type="radio"
                                    id={`radio${tabNumber}`}
                                    name="dynamicRadioGroup"
                                    className='tabButton'
                                    checked={currentTab.index === index}
                                    readOnly
                                />

                                <label className='tab-rb-label' style={{userSelect: 'none'}}>
                                    {tabNumber}
                                </label>
                                <button className="tab-btn-close" style={{userSelect: 'none'}} onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(parseInt(tabNumber), (index));
                                }}>x</button>
                            </div>
                        ))}
                            <button onClick={()=>{createButton()}} className='add-tab' style={{userSelect: 'none'}}>+</button>
                    </div>
                    <Flatlist
                        data={orderslist}
                        headers={ctHeaders}
                        row={RowOrder}
                        Height={'60vh'}
                        selectedRow={selectedfila}
                        setSelectedRow={setSelectedfila}
                    />
                </div>
                <div>
                    <button className="btnStnd btn1" onClick={()=>setShowConfirmar(true)}>F2-Cobrar</button>
                    <label style={{marginLeft: '10px'}}>$ {Formater(total)}</label>
                </div>
                <label>{orderslist && orderslist.length} productos en el ticket actual</label>
                <button className="btnStnd btn1" onClick={()=>setShowSalesOfTheDay(true)}>Ventas del dia y devoluciones</button>
                { showConfirmar && <ConfirmSaleModal orderslist={saleTabs[currentTab.key]} show={setShowConfirmar}/>}
                { confirmUser && <UserConfirm show={setConfirmUser} confirmed={()=>setChangePventa(selectedfila)}/>}
                { searchClient && <SignClient show={setSearchClient} retornar={(i)=>AsingCustomerToOrder(i)}/>}
                { showSalesOfTheDay && <SalesOfTheDay show={setShowSalesOfTheDay} />}
                { showProductMeasures && <ProductMeasures show={setShowProductMeasures} product={selectProduct} aceptar={addProduct}/>}
            </div>
        </section>
    );
}