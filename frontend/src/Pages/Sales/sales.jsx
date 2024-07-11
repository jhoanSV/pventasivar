import React, {useEffect, useState, useRef} from 'react';
import { TableComponent, Flatlist } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
import { ConfirmSaleModal } from '../../Components/Modals/ConfirmSaleModal';
import { UserConfirm } from '../../Components/Modals/UserConfirm';
import { SignClient } from '../../Components/Modals/SignClient';
import { SalesOfTheDay } from '../../Components/Modals/SalesOfTheDay';
import "./_sales.scss";
import jsonTest from '../../tickets-text.json';
import { useTheContext } from '../../TheProvider';


export function Sales(){
    const [ buttonCount, setButtonCount] = useState(1); // Initial button count
    const [ tabindex, setTabindex] = useState(1);
    const [ total, setTotal] = useState(0);
    const [ orderslist, setOrderslist] = useState(jsonTest[1])
    const [ selectedButton, setSelectedButton] = useState(1);
    const [ showConfirmar, setShowConfirmar] = useState(false);
    const [ selectedfila, setSelectedfila] = useState(0);
    const [ changeQuantity, setChangeQuantity] = useState(null);
    const [ changePventa, setChangePventa] = useState(null);
    const [ tabButtons, setTabButtons] = useState({ 1: true }); // Dictionary to store tab buttons
    const [ confirmUser, setConfirmUser] = useState(false);
    const [ searchClient, setSearchClient] = useState(false);
    const [ showSalesOfTheDay, setShowSalesOfTheDay] = useState(false);
    const selectedfilaRef = useRef(selectedfila);
    const selectedTabRef = useRef(tabindex);
    const { setSection } = useTheContext();

    useEffect(() => {
        sumarTotal()
    }, [orderslist]);
    
    useEffect(() => {
        setSection('Ventas')
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);

    useEffect(() => {
        selectedTabRef.current = tabindex;
    }, [tabindex]);

    const changeTab =(index) => {
        setOrderslist(jsonTest[index])
        setTabindex(index)
        setSelectedButton(index)
        if (jsonTest[index].length !== 0) {
            setSelectedfila(jsonTest[index].length - 1)
        } else if (jsonTest[index].length === 0 ) {
            setSelectedfila(null)
        }
    };

    const handleKeyDown = (event) => {
        const currentSelectedTab = selectedTabRef.current;
        if (jsonTest[currentSelectedTab].length !== 0) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === '+') {
                updateCantidad(currentSelectedFila, 1)
            } else if (event.key === '-') {
                updateCantidad(currentSelectedFila,-1)
            } else if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < jsonTest[tabindex].length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < jsonTest[tabindex].length) {
                setSelectedfila(currentSelectedFila - 1)
            } else if (event.key === 'Delete') {
                jsonTest[currentSelectedTab].splice(currentSelectedFila, 1)
                const updatedOrdersList = [...jsonTest[tabindex]];
                // Actualiza el estado con la nueva lista
                setOrderslist(updatedOrdersList);
            }
        }
    };

    const onblurChangeCuantity = (row, amount) => {
        if (amount > 0) {
            jsonTest[tabindex][row].Cantidad = amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...jsonTest[tabindex]];
            // Actualiza el estado con la nueva lista
            setOrderslist(updatedOrdersList);
        }
        setChangeQuantity(null)
    };

    const onblurChangePv = (row, amount) => {
        if (amount > 0) {
            const theValue = amount
            let withoutFormat = theValue.replace(/\./g, '')
            jsonTest[tabindex][row].pVenta = withoutFormat
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            const updatedOrdersList = [...jsonTest[tabindex]];
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
        if (jsonTest[tabindex][selectedRow].Cantidad + amount > 0) {
            jsonTest[tabindex][selectedRow].Cantidad += amount
            // Crea una copia del jsonTest[tabindex] para actualizar el estado
            console.log('fila al aumentar ' + selectedRow)
            const updatedOrdersList = [...jsonTest[tabindex]];
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
        ,
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

    const createButton = () => {
        if (Object.keys(jsonTest).length < 16) {
            setButtonCount(prevCount => {
                const newCount = prevCount + 1;
                jsonTest[prevCount + 1] = [];
                changeTab(newCount)
                return newCount;
            });
            setTabButtons(prevButtons => ({ ...prevButtons, [buttonCount + 1]: true }));
        }
    };


    const sumarTotal = () => {
        let suma = 0;
        if (orderslist && orderslist.length > 0) {orderslist.forEach((item, index) => (
            suma += item.pVenta * item.Cantidad
        ))}
        setTotal(suma)
    };

    const closeTab = (tabNumber) => {
        console.log(tabNumber)
        if (Object.keys(jsonTest).length > 1 && tabNumber in jsonTest) {
            console.log('entro en cerrar el tab')
            const newTabButtons = { ...tabButtons };
            delete newTabButtons[tabNumber];
            setTabButtons(newTabButtons);
            changeTab(selectedButton === tabNumber ? 1 : selectedButton)
            setSelectedButton(selectedButton === tabNumber ? 1 : selectedButton);
        }
    };

    return (
        <section className='Sales'>
            <div className="Search">
                <div className='elipsisText lines2' style={{maxHeight: '42px'}}>
                    <label>Ingrese el codigo del producto</label>
                </div>
                <div className='inputSearchPContainer'>
                    <input
                        type="text"
                        id='NPinput'
                        placeholder="Codigo del producto"
                        style={{width: '500px'}}/>
                </div>
                <button className="btnStnd btn1">Buscar</button>
            </div>
            <div style={{padding: '0px 70px'}}>
                <button
                    className="btnStnd btn1"
                    onClick={()=>setSearchClient(true)}>Asignar cliente</button>
                <div className="tabs">
                    <div className='tabButtons'>
                        {Object.keys(tabButtons).map(tabNumber => (
                            <div className='tabButtonModel' key={tabNumber}>
                                <input
                                    type="radio"
                                    id={`radio${tabNumber}`}
                                    name="dynamicRadioGroup"
                                    className='tabButton'
                                    checked={selectedButton === parseInt(tabNumber)}
                                    onChange={() => changeTab(parseInt(tabNumber))}
                                />
                                <label className='tab-rb-label' htmlFor={`radio${tabNumber}`} style={{userSelect: 'none'}}>
                                    {tabNumber}
                                </label>
                                <button className="tab-btn-close"  style={{userSelect: 'none'}} onClick={() => closeTab(parseInt(tabNumber))}>x</button>
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
                <label>{jsonTest[tabindex].length} productos en el ticket actual</label>
                <button className="btnStnd btn1" onClick={()=>setShowSalesOfTheDay(true)}>Ventas del dia y devoluciones</button>
                { showConfirmar && <ConfirmSaleModal orderslist={orderslist} show={setShowConfirmar}/>}
                { confirmUser && <UserConfirm show={setConfirmUser} confirmed={()=>setChangePventa(selectedfila)}/>}
                { searchClient && <SignClient show={setSearchClient} retornar={()=>{}}/>}
                { showSalesOfTheDay && <SalesOfTheDay show={setShowSalesOfTheDay} />}
            </div>
        </section>
    );
}