import React, {useEffect, useState, useRef} from 'react';
import { Flatlist, ModalBusca } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { ConfirmSaleModal } from '../../Components/Modals/ConfirmSaleModal';
import { UserConfirm } from '../../Components/Modals/UserConfirm';
import { SignClient } from '../../Components/Modals/SignClient';
import { SalesOfTheDay } from '../../Components/Modals/SalesOfTheDay';
import "./_sales.scss";
import jsonTest from '../../tickets-text.json';
import { useTheContext } from '../../TheProvider';
import { Inventory } from '../../api';
import { CSSTransition } from 'react-transition-group';

export function Sales(){
    //*---------------------
    const [saleTabs, setSaleTabs] = useState(jsonTest);
    const [currentTab, setCurrentTab] = useState(0);
    const [tabsHistory, setTabsHistory] = useState(Object.keys(saleTabs).length);
    //*---------------------
    const [ total, setTotal] = useState(0);
    const [ orderslist, setOrderslist] = useState(jsonTest[1])
    const [ showConfirmar, setShowConfirmar] = useState(false);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ changeQuantity, setChangeQuantity] = useState(null);
    const [ changePventa, setChangePventa] = useState(null);
    const [ confirmUser, setConfirmUser] = useState(false);
    const [ searchClient, setSearchClient] = useState(false);
    const [ showSalesOfTheDay, setShowSalesOfTheDay] = useState(false);
    const [showFL, setShowFL] = useState(false);
    const [limit, setLimit] = useState(0);
    const [sBText, setSBText] = useState('');
    const [invList, setInvList] = useState([]);
    const nodeRef = useRef(null);
    const refList = useRef([]);
    const selectedfilaRef = useRef(selectedfila);
    const selectedTabRef = useRef(currentTab);
    const { setSection, usD } = useTheContext();

    const handleKeyDown = (event) => {
        const currentSelectedTab = selectedTabRef.current;
        if (saleTabs[currentSelectedTab].length !== 0) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === '+') {
                updateCantidad(currentSelectedFila, 1)
            } else if (event.key === '-') {
                updateCantidad(currentSelectedFila,-1)
            } else if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < saleTabs[currentTab].length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < saleTabs[currentTab].length) {
                setSelectedfila(currentSelectedFila - 1)
            } else if (event.key === 'Delete') {
                saleTabs[currentSelectedTab].splice(currentSelectedFila, 1)
                const updatedOrdersList = [...saleTabs[currentTab]];
                // Actualiza el estado con la nueva lista
                setOrderslist(updatedOrdersList);
            }
        }
    };

    const onblurChangeCuantity = (row, amount) => {
        if (amount > 0) {
            saleTabs[currentTab][row].Cantidad = amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...saleTabs[currentTab]];
            // Actualiza el estado con la nueva lista
            setOrderslist(updatedOrdersList);
        }
        setChangeQuantity(null)
    };

    const onblurChangePv = (row, amount) => {
        if (amount > 0) {
            const theValue = amount
            let withoutFormat = theValue.replace(/\./g, '')
            saleTabs[currentTab][row].pVenta = withoutFormat
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...saleTabs[currentTab]];
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
                    <td style={{width: columnsWidth[0]}} onDoubleClick={()=>{setChangeQuantity(index)}}>
                        { isEditing ? (
                            <TheInput
                                id = {'i'+ rowIndex}
                                numType ='nat'
                                val = {item.Cantidad}
                                sTyle = {{width: columnsWidth[0]}}
                                onblur = {(e) => onblurChangeCuantity(rowIndex, e)}
                                autofocus={true}
                            /> ) :
                        ( 
                            <label>{item.Cantidad}</label>
                        )}
                    </td>
                    <td style={{width: columnsWidth[1]}}>
                        <label>{item.Codigo}</label>
                    </td>
                    <td style={{width: columnsWidth[2]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{width: columnsWidth[3]}}>
                        <label>{item.UM}</label>
                    </td>
                    <td style={{width: columnsWidth[4]}} onDoubleClick={()=>setConfirmUser(true)}>
                        { isEditingPv ? (
                            <TheInput
                                id = {'i'+ rowIndex}
                                numType ='real'
                                val = {item.pVenta}
                                sTyle = {{width: columnsWidth[0]}}
                                onblur = {(e) => onblurChangePv(rowIndex, e)}
                                autofocus={true}
                            /> ) :
                        ( 
                            <label>$ {Formater(item.pVenta)}</label>
                        )}
                    </td>
                    <td style={{width: columnsWidth[5]}}>
                        <label>$ {Formater(item.pVenta * item.Cantidad)}</label>
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
        if (saleTabs[currentTab][selectedRow].Cantidad + amount > 0) {
            saleTabs[currentTab][selectedRow].Cantidad += amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            console.log('fila al aumentar ' + selectedRow)
            const updatedOrdersList = [...saleTabs[currentTab]];
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
            suma += item.pVenta * item.Cantidad
        ))}
        setTotal(suma)
    };

    const changeTab = (Num, index) => {
        console.log('Num: '+ Num + ' index: ' + index);
        if(Num===null){
            console.log('Cambio por borranding');
            setOrderslist(Object.entries(saleTabs)[index][1]);
        }else{
            setOrderslist(saleTabs[Num]);
        }
        setCurrentTab(index);
        if (Num !== null && saleTabs[Num].length !== 0) {
            setSelectedfila(saleTabs[Num].length - 1);
        } else if ( Num !== null && saleTabs[Num].length === 0 ) {
            setSelectedfila(null);
        }
    };

    const createButton = () => {
        let tabLen = Object.keys(saleTabs).length
        if (tabLen < 16) {
            //saleTabs[tabLen + 1] = [];
            saleTabs[tabsHistory + 1] = [{
                    "Cantidad": 50,
                    "Codigo": `a${tabsHistory}`,
                    "Descripcion": "chazo anclaje 1/4 x 1 3/8",
                    "UM": "cm",
                    "Medida": 100,
                    "pCosto": 100,
                    "pVenta": 260
                }];
            console.log("create button: " + (tabLen));
            changeTab((tabsHistory + 1), (Object.keys(saleTabs).length)-1);
            setTabsHistory(tabsHistory + 1);
            /*setButtonCount(prevCount => {
                jsonTest[prevCount + 1] = [];
                return (prevCount + 1);
            });
            setTabButtons(prevButtons => ({ ...prevButtons, [buttonCount + 1]: true }));*/
        }
    };

    const closeTab = (tabNumber, index) => {
        console.log('close: ' + index);
        console.log('tab to close: ' + tabNumber);
        console.log(saleTabs);
        console.log('tabNumber in jsonTest ' + (tabNumber in saleTabs));
        if (Object.keys(saleTabs).length > 1 && (tabNumber in saleTabs)) {
            console.log('entro en cerrar el tab')
            //const newTabButtons = { ...tabButtons };
            delete saleTabs[tabNumber];
            console.log(saleTabs);
            console.log('index: '+index+' current Tab: '+currentTab);
            if(index < currentTab){
                setCurrentTab(index-1);
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

    useEffect(() => {
        sumarTotal();
        // eslint-disable-next-line
    }, [orderslist]);
    
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);
    
    useEffect(() => {
        console.log('the current ' +currentTab);
        selectedTabRef.current = currentTab;
    }, [currentTab]);
    
    useEffect(() => {
        setSection('Ventas');
        fetchInventoryList();
        setLimit(20);
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <section className='Sales'>
            <div className="Search">
                <div style={{position: 'relative'}}>
                    <input
                        type="text"
                        id='NPinput'
                        placeholder="Codigo del producto"
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                        style={{width: '500px'}}
                        onFocus={()=>setShowFL(true)}
                        onBlur={()=>setShowFL(false)}
                    />
                    <CSSTransition
                        timeout={200}
                        in={sBText !== '' && showFL}
                        nodeRef={nodeRef}
                        classNames="FLA"
                        unmountOnExit
                        >
                        <div className="FloatingList" ref={nodeRef}>
                            {invList.slice(0,limit).map((item, index) =>
                                <div key={index} className='flItem' onClick={(e)=>{/*document.getElementById('NPinput').value = e.currentTarget.innerText*/console.log(document.getElementById('NPinput'));console.log(e.currentTarget.innerText);}}>
                                    {item.Descripcion}
                                </div>
                            )}
                        </div>
                    </CSSTransition>
                    {/*(sBText !== '' && showFL) &&
                    */}
                </div>
                <ModalBusca/>
            </div>
            <div style={{padding: '0px 70px'}}>
                <button
                    className="btnStnd btn1"
                    onClick={()=>setSearchClient(true)}>Asignar cliente</button>
                <div className="tabs">
                    <div className='tabButtons'>
                        {Object.keys(saleTabs).map((tabNumber, index) => (
                            <div className='tabButtonModel' key={tabNumber}>
                                <input
                                    type="radio"
                                    id={`radio${tabNumber}`}
                                    name="dynamicRadioGroup"
                                    className='tabButton'
                                    checked={currentTab === index}
                                    onChange={() => changeTab(parseInt(tabNumber), index)}
                                />
                                <label className='tab-rb-label' htmlFor={`radio${tabNumber}`} style={{userSelect: 'none'}}>
                                    {tabNumber}
                                </label>
                                <button className="tab-btn-close"  style={{userSelect: 'none'}} onClick={() => closeTab(parseInt(tabNumber), (index))}>x</button>
                            </div>
                        ))}
                            <button onClick={()=>{createButton()}} className='add-tab'>+</button>
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
                    <label>$ {Formater(total)}</label>
                </div>
                <label>{orderslist.length} productos en el ticket actual</label>
                <button className="btnStnd btn1" onClick={()=>setShowSalesOfTheDay(true)}>Ventas del dia y devoluciones</button>
                { showConfirmar && <ConfirmSaleModal orderslist={orderslist} show={setShowConfirmar}/>}
                { confirmUser && <UserConfirm show={setConfirmUser} confirmed={()=>setChangePventa(selectedfila)}/>}
                { searchClient && <SignClient show={setSearchClient} retornar={()=>{}}/>}
                { showSalesOfTheDay && <SalesOfTheDay show={setShowSalesOfTheDay} />}
            </div>
        </section>
    );
}