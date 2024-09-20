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
    const [tabsHistory, setTabsHistory] = useState(() => {
        const keys = Object.keys(saleTabs);
        return Number(keys[keys.length-1]);
    });
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
    const [ selectedFLI, setSelectedFLI] = useState(0);
    const nodeRef = useRef(null), divSRef = useRef();
    const refList = useRef([]), invListRef = useRef([]);
    const selectedfilaRef = useRef(selectedfila);
    const selectedTabRef = useRef(currentTab);
    const selectedFLIRef = useRef(selectedFLI);
    const isEditingRef = useRef(false);
    const asktoaddRef = useRef(null);
    const { setSection, usD } = useTheContext();
    
    const handleKeyDown = async(e) => {
        if(document.getElementById('NPinput') === document.activeElement){
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
                    document.getElementById('NPinput').focus();
                    document.getElementById('NPinput').select();
                    return;
                } 
                asktoaddRef.current(selectedItem);
                /*document.getElementById('tabsId').removeEventListener('keydown', handleKeyDown2);
                document.getElementById('NPinput').removeEventListener('keydown', handleKeyDown);
                document.getElementById('tabsId').addEventListener('keydown', handleKeyDown2);
                document.getElementById('NPinput').addEventListener('keydown', handleKeyDown);*/
            }
            setSelectedFLI(selectedFLIRef.current);
        }else if(document.getElementById('tabsId') === document.activeElement){
            if(isEditingRef.current===true)return;
            let st = JSON.parse(localStorage.getItem('ticketsJson'));
            let theOrder = st[selectedTabRef.current.key].Order;
            
            if (theOrder.length !== 0 && selectedfilaRef.current !== null) {
                const currentSelectedFila = selectedfilaRef.current;
                if (e.key === '+') {
                    updateCantidad(currentSelectedFila, 1)
                } else if (e.key === '-') {
                    updateCantidad(currentSelectedFila,-1)
                } else if (e.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < theOrder.length) {
                    setSelectedfila(currentSelectedFila + 1)
                } else if (e.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < theOrder.length) {
                    setSelectedfila(currentSelectedFila - 1)
                } else if (e.key === 'Delete') {
                    const PAdded = JSON.parse(localStorage.getItem('PAdded'));
                    let item = theOrder[currentSelectedFila]
                    console.log(Number(PAdded[item.Cod].Cantidades),' - ',Number(item.Cantidad/item.UMedida),' = ',Number(PAdded[item.Cod].Cantidades)-Number(item.Cantidad/item.UMedida));
                    let dif = Math.abs(Number(PAdded[item.Cod].Cantidades)-Number(item.Cantidad/item.UMedida)) < 1e-10 ? 0 : Number(PAdded[item.Cod].Cantidades)-Number(item.Cantidad/item.UMedida)
                    if(dif === 0){
                        delete PAdded[item.Cod];
                    }else PAdded[item.Cod].Cantidades = dif;
                    localStorage.setItem('PAdded', JSON.stringify(PAdded));
                    theOrder.splice(currentSelectedFila, 1);
                    if (currentSelectedFila === theOrder.length && currentSelectedFila !== 0){
                        setSelectedfila(currentSelectedFila - 1)
                    }
                    // Actualiza el estado con la nueva lista
                    const updatedOrdersList = [...theOrder];
                    setOrderslist(updatedOrdersList);
                }
            }
        }
    };

    const onblurChangeCuantity = async(row, amount) => {
        let theOrder = [...saleTabs[currentTab.key].Order]
        let theAmount = amount.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
        if (theAmount > 0) {
            const PAdded = JSON.parse(localStorage.getItem('PAdded'));
            let item = theOrder[row];
            console.log(Number(PAdded[item.Cod].Cantidades), Number(theAmount/item.UMedida), item.Inventario);
            if((Number(PAdded[item.Cod].Cantidades)+Number(theAmount/item.UMedida))>(item.Inventario)){
                await TheAlert('No hay suficiente inventario');
                PAdded[item.Cod].Cantidades = item.Cantidad;
                theOrder[row].Cantidad = Number(item.Cantidad);
                setOrderslist(theOrder);
                setChangeQuantity(null);
                return;
            }
            PAdded[item.Cod].Cantidades = Number(theAmount/item.UMedida);
            localStorage.setItem('PAdded', JSON.stringify(PAdded));
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
                                select={true}
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
                                select={true}
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
    

    const updateCantidad = async(selectedRow, amount) => {
        let st = JSON.parse(localStorage.getItem('ticketsJson'));
        let theOrder = st[selectedTabRef.current.key].Order;
        if (theOrder[selectedRow].Cantidad + amount > 0) {
            const PAdded = JSON.parse(localStorage.getItem('PAdded'));
            let item = theOrder[selectedRow];
            let umin = item.Medida ? item.Medidas[item.Medidas.length-1].UMedida : 1;
            console.log(Number(PAdded[item.Cod].Cantidades),Number(amount/item.UMedida),(item.Inventario*umin) );
            if(Number(PAdded[item.Cod].Cantidades)+Number(amount/item.UMedida)>(item.Inventario)){
                await TheAlert('No hay suficiente inventario.');
                return;
            }
            PAdded[item.Cod].Cantidades = Number(PAdded[item.Cod].Cantidades)+Number(amount/item.UMedida);
            localStorage.setItem('PAdded', JSON.stringify(PAdded));
            theOrder[selectedRow].Cantidad += amount;
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
        document.getElementById('NPinput').focus();
        document.getElementById('NPinput').select();
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
        let ifDel = false;
        const newTabButtons = {...saleTabs};
        const otD = newTabButtons[tabNumber].Order
        if (Object.keys(saleTabs).length > 1 && (tabNumber in saleTabs)) {
            delete newTabButtons[tabNumber];
            ifDel = true;
            setSaleTabs(newTabButtons);
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
            delete newTabButtons[tabNumber];
            ifDel = true
            setSaleTabs(newTabButtons)
            setCurrentTab({"index": 0,
                             "key": Object.keys(newTabButtons)[0]})
        }
        if(ifDel && otD.length > 0){
            const PAdded = JSON.parse(localStorage.getItem('PAdded'));
            otD.forEach(item => {
                if(Number(PAdded[item.Cod].Cantidades)-Number(item.Cantidad/item.UMedida) === 0){
                    delete PAdded[item.cod];
                }else PAdded[item.Cod].Cantidades = Number(PAdded[item.Cod].Cantidades)-Number(item.Cantidad/item.UMedida);
            });
            localStorage.setItem('PAdded', JSON.stringify(PAdded));
        }
    };

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text, sl) =>{
        setSBText((text))
        let c = refList.current;
        console.log(c);
        if (text !== ''){
            sl(c.filter((i)=>filterByText(i, text)));
        }else{
            fetchInventoryList();
        }
    }

    const addProduct = async(item) =>{
        const PAdded = JSON.parse(localStorage.getItem('PAdded'));
        //let paddedItem;
        let umin = item.Medida ? item.Medidas[item.Medidas.length-1].UMedida : 1;
        if(!PAdded[item.Cod])PAdded[item.Cod] = {};
        if(!PAdded[item.Cod]['Cantidades'])PAdded[item.Cod].Cantidades = 0;
        /*if(!item.Medida){
            if(!PAdded[item.Cod]['a'])PAdded[item.Cod]['a'] = { Cantidades: 0 }
            paddedItem = PAdded[item.Cod]['a'];
        }else{
            if(!PAdded[item.Cod][item.Medida])PAdded[item.Cod][item.Medida] = { Cantidades: 0 }
            paddedItem = PAdded[item.Cod][item.Medida];
        }*/
        /*console.log(Number(paddedItem.Cantidades),Number(item.Cantidad),item.Inventario, item.UMedida, umin);
        console.log((Number(paddedItem.Cantidades*umin)+Number(item.Cantidad)),(item.Inventario*umin));*/
        /*if(Number(paddedItem.Cantidades*umin)+Number(item.Cantidad*umin)>(item.Inventario*umin)){
            await TheAlert('No hay suficiente inventario. Inventario actual: '+(item.Inventario*item.UMedida));
            setSBText('')
            document.getElementById('NPinput').focus();
            return;
        }*/
        console.log(Number(item.Cantidad), (item.UMedida), (item.Inventario),(umin));
        console.log(Number(PAdded[item.Cod].Cantidades), Number(item.Cantidad/item.UMedida), (item.Inventario));
        if(Number(PAdded[item.Cod].Cantidades)+Number(item.Cantidad/item.UMedida)>(item.Inventario)){
            await TheAlert('No hay suficiente inventario.');
            setSBText('')
            document.getElementById('NPinput').focus();
            return;
        }
        let theOrder = saleTabs[currentTab.key].Order
        // Verificar si el producto ya existe en theOrder
        const productAlreadyExistsIndex = theOrder.findIndex(
            (prod) => prod.Cod === item.Cod && prod.Medida === item.Medida
        );
        if(productAlreadyExistsIndex === -1){
            //*Product doesnt exist
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
            setSelectedfila(saleTabs[currentTab.key].Order.length - 1);
        } else {
            //saleTabs[currentTab.key].Order[productAlreadyExistsIndex].Cantidad = theOrder[productAlreadyExistsIndex].Cantidad + item.Cantidad
            theOrder[productAlreadyExistsIndex].Cantidad += item.Cantidad;
            setOrderslist([...theOrder]);
            setSelectedfila(productAlreadyExistsIndex);
        }
        PAdded[item.Cod].Cantidades = Number(PAdded[item.Cod].Cantidades)+Number(item.Cantidad/item.UMedida)
        //paddedItem.Cantidades = Number(paddedItem.Cantidades)+item.Cantidad;
        console.log(PAdded);
        localStorage.setItem('PAdded', JSON.stringify(PAdded));
        console.log(item);
        setSBText('');
        document.getElementById('NPinput').focus();
        document.getElementById('NPinput').select();
    }

    const askToAddProduct = (item) => {
        if (item.Clase === 0){
            let theProduct = {...item};
            theProduct.Medida = '';
            theProduct.Cantidad = 1;
            theProduct.UMedida = 1;
            addProduct(theProduct);
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
        st[currentTab.key].Order = orderslist;
        setSaleTabs(st);
        sumarTotal();
        localStorage.setItem('ticketsJson', JSON.stringify(saleTabs));
        // eslint-disable-next-line
    }, [orderslist]);
    
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);
    
    useEffect(() => {
        selectedTabRef.current = currentTab;
        // eslin-disable-next-line
    }, [currentTab]);

    useEffect(() => {
        localStorage.setItem('ticketsJson', JSON.stringify(saleTabs));
    }, [saleTabs]);

    useEffect(() => {
        if(sBText === '' || !showFL){
            selectedFLIRef.current = 0;
            setSelectedFLI(0);
        }
        // eslint-disable-next-line
    }, [sBText, showFL]);

    useEffect(() => {
        invListRef.current = invList
        // eslint-disable-next-line
    }, [invList]);

    useEffect(() => {
        asktoaddRef.current = askToAddProduct
        // eslint-disable-next-line
    }, [currentTab]);
    
    useEffect(() => {
        setSection('Ventas');
        fetchInventoryList();
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
                localStorage.setItem('PAdded', JSON.stringify({}));
                setSaleTabs({
                    "1": { "Customer": {},
                            "Order": []
                    }
                });
                setOrderslist([]);
                setCurrentTab({"index": 0, "key": 1});
                setTabsHistory(1);
                setCustomer("Por asignar");
                console.log('ResetTickets and showStarCash');
            }
        }
        StartCahs()
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
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
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase(), setInvList);selectedFLIRef.current = 0}}
                        style={{width: '500px'}}
                        onFocus={(e)=>{setShowFL(true);isEditingRef.current=true;e.target.select();}}
                        onBlur={()=>{isEditingRef.current=false;}}
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
                        <div id='flId' className="FloatingList" ref={nodeRef}>
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
                <div id='tabsId' className="tabs" tabIndex={0}>
                    <div className='tabButtons'>
                        {Object.keys(saleTabs).map((tabNumber, index) => (
                            <div className='tabButtonModel' key={tabNumber} onClick={()=>{
                                changeTab(parseInt(tabNumber), index);
                                document.getElementById(`radio${tabNumber}`).checked = true;
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