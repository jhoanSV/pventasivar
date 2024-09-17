import React, {useEffect, useState, useRef} from 'react';
import { Flatlist, ModalBusca, TheAlert } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { ConfirmSaleModal } from '../../Components/Modals/ConfirmSaleModal';
import { UserConfirm } from '../../Components/Modals/UserConfirm';
import { SignClient } from '../../Components/Modals/SignClient';
import { SalesOfTheDay } from '../../Components/Modals/SalesOfTheDay';
import { ProductMeasures } from '../../Components/Modals/ProductMeasures';
import { MoneyFlow } from '../../Components/Modals/MoneyFlow';
import { StartOfCash } from '../../Components/Modals/StartOfCash';
import "./_sales.scss";
// import ticketsJson from '../../tickets-text.json';
import { useTheContext } from '../../TheProvider';
import { CashFlow, Inventory } from '../../api';
import { CSSTransition } from 'react-transition-group';

export function Sales(){
    //*---------------------
    const [saleTabs, setSaleTabs] = useState(JSON.parse(localStorage.getItem('ticketsJson')));
    const [currentTab, setCurrentTab] = useState({"index": 0, "key": Object.keys(saleTabs)[0]});
    const [tabsHistory, setTabsHistory] = useState(Object.keys(saleTabs).length);
    //*---------------------
    const [ total, setTotal] = useState(0);
    const [ orderslist, setOrderslist] = useState(saleTabs[Object.keys(saleTabs)[0]]["Order"])
    const [ customer, setCustomer] = useState("Por asignar");
    const [ showConfirmar, setShowConfirmar] = useState(false);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ changeQuantity, setChangeQuantity] = useState(null);
    const [ changePventa, setChangePventa] = useState(null);
    const [ confirmUser, setConfirmUser] = useState(false);
    const [ searchClient, setSearchClient] = useState(false);
    const [ showSalesOfTheDay, setShowSalesOfTheDay] = useState(false);
    const [ showProductMeasures, setShowProductMeasures] = useState(false);
    const [ showStartCahs, setShowStartCahs ] = useState(false);
    const [ showMoneyFlow, setShowMoneyFlow ] = useState(false);
    const [ typeMoneyFlow, setTypeMoneyFlow ] = useState(false);
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
        let theOrder = saleTabs[currentTab.key].Order//Object.entries(saleTabs)[selectedTabRef.current][1]
        //console.log(selectedfilaRef.current);
        //console.log(theOrder.length);
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
                theOrder.splice(currentSelectedFila, 1)
                if (selectedfila === theOrder.length - 1 && selectedfila !== 0){
                    setSelectedfila(currentSelectedFila - 1)
                }
                // Actualiza el estado con la nueva lista
                const updatedOrdersList = [...theOrder];
                setOrderslist(updatedOrdersList);
            }
        }
    };

    const onblurChangeCuantity = (row, amount) => {
        let theOrder = [...saleTabs[currentTab.key].Order]
        let theAmount = amount.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
        if (theAmount > 0) {
            theOrder[row].Cantidad = Number(theAmount);
            setOrderslist(theOrder);
        }
        setChangeQuantity(null);
    };

    const onblurChangePv = (row, amount) => {
        let theOrder = [...saleTabs[currentTab.key].Order];
        let withoutFormat = amount.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
        if (withoutFormat > 0) {
            theOrder[row].PVenta = Number(withoutFormat);
            // Actualiza el estado con la nueva lista
            setOrderslist(theOrder);
        }
        setChangePventa(null);
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
                            <label>{Formater(item.Cantidad)}</label>
                        )}
                    </td>
                    <td style={{width: columnsWidth[1]}}>
                        <label>{item.Cod}</label>
                    </td>
                    <td style={{width: columnsWidth[2]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>{item.Medida === '' ? 'Unidad': item.Medida}</label>
                    </td>
                    <td style={{width: columnsWidth[4]}} onDoubleClick={()=>{setConfirmUser(true);isEditingRef.current=true}}>
                        { isEditingPv ? (
                            <TheInput
                                id = {'i'+ rowIndex}
                                numType ='real'
                                val = {item.PVenta}
                                sTyle = {{width: columnsWidth[0]}}
                                onblur = {(e) => {
                                    onblurChangePv(rowIndex, e);
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
        let theOrder = saleTabs[currentTab.key].Order//Object.entries(saleTabs.Orden)[selectedTabRef.current][1]
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
            setOrderslist(saleTabs[currentTab.key].Order);
            setCurrentTab({"index": index,
                "key": currentTab.key
            });
        }else{
            setOrderslist(saleTabs[Num].Order);
            setCurrentTab({"index": index,
                "key": Num});
        }
        if (Num !== null && saleTabs[Num].Order.length !== 0) {
            setSelectedfila(() => {
                //send the scrollbar to the bottom
                setTimeout(() => {
                    var orderElement = document.getElementById("FlastListID");
                    if (orderElement) {
                        orderElement.scrollTop = orderElement.scrollHeight;
                        console.log(orderElement);
                    }
                }, 0);
                return saleTabs[Num].Order.length - 1
            }
            );
            
        } else if ( Num !== null && saleTabs[Num].Order.length === 0 ) {
            setSelectedfila(null);
        }
        
        if(Object.keys(saleTabs[Num].Customer).length !== 0){
            setCustomer(saleTabs[Num].Customer.Nombre + ' ' + saleTabs[Num].Customer.Apellido)
        }else{
            setCustomer("Por asignar")
        }
        //console.log(saleTabs[Num].Customer.Nombre !== null);
        //const custromerName = saleTabs[Num].Customer.Nombre === '' ? saleTabs[Num].Customer.Nombre: 'Por asignar';
        //setCustomer(custromerName)
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

    const closeTab = async(tabNumber, index) => {
        let asktoclose = await TheAlert('¿Desea eliminar el tiket con ' + saleTabs[tabNumber].Order.length + ' productos?', 1);
        if(!asktoclose) return;
        if (Object.keys(saleTabs).length > 1 && (tabNumber in saleTabs)) {
            const newTabButtons = {...saleTabs};
            delete newTabButtons[tabNumber];
            setSaleTabs(newTabButtons);
            console.log('tabNumber: '+tabNumber+' index: '+index+' CurrentTab: '+currentTab);
            if(index < currentTab.index) {
                setCurrentTab({"index": currentTab.index-1,
                                "key": tabNumber});
            }else if(index === currentTab.index){
                if(index === 0){
                    changeTab(Object.keys(saleTabs)[index+1], (index))
                }else {
                    changeTab(Object.keys(saleTabs)[index-1], (index-1))
                }
            }
        } else {
            createButton()
            const newTabButtons = {...saleTabs};
            delete newTabButtons[tabNumber];
            setSaleTabs(newTabButtons)
            setCurrentTab({"index": 0,
                             "key": Object.keys(newTabButtons)[0]})
        }
    };

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text, sl) =>{
        setSBText((text))
        let c = refList.current;
        if (text !== ''){
            sl(c.filter((i)=>filterByText(i, text)));
        }else{
            fetchInventoryList();
        }
    }

    const addProduct = (item) =>{
        let theOrder = saleTabs[currentTab.key].Order
            // Verificar si el producto ya existe en theOrder
        const productAlreadyExistsIndex = theOrder.findIndex(
            (prod) => prod.Cod === item.Cod && prod.Medida === item.Medida
        );
        if(productAlreadyExistsIndex === -1){
            theOrder.push(item);
            setOrderslist(a => {
                //send the scrollbar to the bottom
                var orderElement = document.getElementById("FlastListID");
                setTimeout(() => {
                    if (orderElement) {
                        orderElement.scrollTop = orderElement.scrollHeight;
                    }
                }, 0);
                return [...theOrder];
            });
            setShowFL(false);
            setSelectedfila(saleTabs[currentTab.key].Order.length - 1)
        } else {
            saleTabs[currentTab.key].Order[productAlreadyExistsIndex].Cantidad = theOrder[productAlreadyExistsIndex].Cantidad + item.Cantidad
            setSelectedfila(productAlreadyExistsIndex)
            setShowFL(false);
        }
    }

    const askToAddProduct = (item) => {
        //console.log(item)
        if (item.Clase === 0){
            let theProduct = {...item}
            theProduct.Medida = ''
            theProduct.Cantidad = 1;
            theProduct.UMedida = 1;
            addProduct(theProduct)
        } else if (item.Clase !== 0){
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
        if(list){
            setInvList(list);
            refList.current = list;
        }
    }

    const AsingCustomerToOrder = (item) => {
        let st = {...saleTabs};
        st[currentTab.key].Customer = item[0];
        setCustomer(st[currentTab.key].Customer.Nombre + " " + st[currentTab.key].Customer.Apellido);
        setSaleTabs(st);
    }

    const confirmarVenta = () => {
        if (orderslist.length > 0) {
            setShowConfirmar(true);
        } else {
            TheAlert('Debe seleccionar al menos un producto');
        }
    }

    useEffect(() => {
        let st = {...saleTabs}
        console.log(currentTab, saleTabs);
        st[currentTab.key].Order = orderslist;
        setSaleTabs(st);
        console.log(st);
        sumarTotal();
        localStorage.setItem('ticketsJson', JSON.stringify(saleTabs));
        // eslint-disable-next-line
    }, [orderslist]);
    
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
        console.log('seleccionada fila', selectedfila);
        
    }, [selectedfila]);
    
    useEffect(() => {
        selectedTabRef.current = currentTab.index;
        //console.log(saleTabs)
        // eslin-disable-next-line
    }, [currentTab]);

    useEffect(() => {
        localStorage.setItem('ticketsJson', JSON.stringify(saleTabs));
    }, [saleTabs]);
    
    useEffect(() => {
        setSection('Ventas');
        fetchInventoryList();
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        if(Object.keys(saleTabs[currentTab.key].Customer).length !== 0){
            setCustomer(saleTabs[currentTab.key].Customer.Nombre + ' ' + saleTabs[currentTab.key].Customer.Apellido)
        }else{
            setCustomer("Por asignar");
        }
        
        const StartCahs = async() => {
            const cashFlow = await CashFlow({
                IdFerreteria: usD.Cod,
                Fecha: new Date().toISOString().split('T')[0],
            });
            if (cashFlow.length === 0){
                setShowStartCahs(true);
                localStorage.setItem('ticketsJson', JSON.stringify(
                    {
                        "1": { "Customer": {},
                                "Order": []
                        }
                    }
                ));
                setSaleTabs({
                    "1": { "Customer": {},
                            "Order": []
                    }
                });
                setOrderslist([]);
                setCurrentTab({"index": 0, "key": 1});
                setCustomer("Por asignar");
                console.log('ResetTickets and showStarCash');
            }
        }
        StartCahs()
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
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase(), setInvList)}}
                        style={{width: '500px'}}
                        onFocus={()=>{setShowFL(true);isEditingRef.current=true}}
                        onBlur={()=>{isEditingRef.current=false}}
                        autoComplete='off'
                        autoFocus
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
                                    onClick={()=>{Number(item.Inventario)!==0 ? askToAddProduct(item) : TheAlert('No hay invetario suficiente')}}
                                    style={{color: Number(item.Inventario)===0 && 'red'}}
                                >
                                    {item.Descripcion}
                                </div>
                            )}
                        </div>
                    </CSSTransition>
                </div>
                <ModalBusca
                    list={[...invList]}
                    click={askToAddProduct}
                    sh={SearchHandle}
                />
            </div>
            <div id='sales-main-view'>
                <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                    <button
                        className="btnStnd btn1"
                        onClick={()=>setSearchClient(true)}
                        >Asignar cliente
                    </button>
                    <button
                        style={{marginLeft: 'auto'}}
                        className="btnStnd moneyEnt"
                        onClick={()=>{setTypeMoneyFlow(false);setShowMoneyFlow(true)}}
                        >Entradas de dinero
                    </button>
                    <button
                        className="btnStnd moneyExt"
                        onClick={()=>{setTypeMoneyFlow(true); setShowMoneyFlow(true)}}
                        >Salidas de dinero
                    </button>
                </div>
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
                        Height={'93%'}
                        selectedRow={selectedfila}
                        setSelectedRow={setSelectedfila}
                    />
                </div>
                <div className='sDetail'>
                    <div><label>Total &iacute;tems: {orderslist && orderslist.length}</label></div>
                    <div style={{display: 'flex'}}>
                        <div className='total-label'>
                            $ {Formater(total)}
                        </div>
                        <button className="btnStnd btn1" onClick={()=>confirmarVenta()}
                            style={{fontSize: '16px', padding: '16px 14px'}}>
                            F2-Cobrar
                        </button>
                    </div>
                    <div>
                        <button className="btnStnd btn1" onClick={()=>setShowSalesOfTheDay(true)}>
                            Ventas del dia y devoluciones
                        </button>
                    </div>
                </div>
                { showConfirmar && <ConfirmSaleModal orderslist={saleTabs[currentTab.key]} show={setShowConfirmar} folio={currentTab.key} sendSale={()=>closeTab(currentTab.key, currentTab.index)} totalE={total}/>}
                { confirmUser && <UserConfirm show={setConfirmUser} confirmed={()=>setChangePventa(selectedfila)}/>}
                { searchClient && <SignClient show={setSearchClient} retornar={(i)=>AsingCustomerToOrder(i)}/>}
                { showSalesOfTheDay && <SalesOfTheDay show={setShowSalesOfTheDay} />}
                { showProductMeasures && <ProductMeasures show={setShowProductMeasures} product={selectProduct} aceptar={addProduct}/>}
                { showMoneyFlow && <MoneyFlow show={setShowMoneyFlow} typeOfFlow={typeMoneyFlow}></MoneyFlow>}
                { showStartCahs && <StartOfCash show={setShowStartCahs}></StartOfCash>}
            </div>
        </section>
    );
}