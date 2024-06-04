import React, {useEffect, useState, useRef} from 'react';
import { TableComponent, Flatlist } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
import "./_sales.scss";
import jsonTest from '../../tickets-text.json';


export function Sales(){
    const [buttonCount, setButtonCount] = useState(1); // Initial button count
    const [tabindex, setTabindex] = useState(1);
    const [total, setTotal] = useState(0);
    const [orderslist, setOrderslist] = useState(jsonTest[1])
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedfila, setSelectedfila] = useState(0);
    const [changeQuantity, setChangeQuantity] = useState(null);
    const [changePventa, setChangePventa] = useState(null);
    const selectedfilaRef = useRef(selectedfila);


    useEffect(() => {
        sumarTotal()
    }, [orderslist]);
    
    useEffect(() => {
        console.log("selectedRow changed: ", selectedfila);
    }, [selectedfila]);
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);

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
        const currentSelectedFila = selectedfilaRef.current;
        console.log(event.key)
        if (event.key === '+') {
            updateCantidad(currentSelectedFila, 1)
        } else if (event.key === '-') {
            updateCantidad(currentSelectedFila,-1)
        } else if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < jsonTest[tabindex].length) {
            setSelectedfila(currentSelectedFila + 1)
        } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < jsonTest[tabindex].length) {
            setSelectedfila(currentSelectedFila - 1)
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
                    <td style={{width: columnsWidth[4]}} onDoubleClick={()=>setChangePventa(index)}>
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
        setButtonCount(prevCount => {
            const newCount = prevCount + 1;
            jsonTest[newCount] = []
            changeTab(newCount)
            //setSelectedButton(newCount); // Automatically select the new radio button
            return newCount;
        });
    };


    const sumarTotal = () => {
        let suma = 0;
        if (orderslist && orderslist.length > 0) {orderslist.forEach((item, index) => (
            suma += item.pVenta * item.Cantidad
        ))}
        setTotal(suma)
    }

    return (
        <div>
            <div className="Search">
                <label>Ingrese el codigo del producto</label>
                <input
                    type="text"
                    id='NPinput'
                    placeholder="Codigo del producto"
                    style={{width: '500px'}}/>
                <button className="btnStnd btn1">Buscar</button>
            </div>
            <div className="tabs">
                <div className='tabButtons'>
                        {[...Array(buttonCount)].map((_, index) => (
                            <div className='tabButtonModel' key={index}>
                                    <input
                                        type="radio"
                                        id={`radio${index + 1}`}
                                        name="dynamicRadioGroup"
                                        className='tabButton'
                                        checked={selectedButton === index + 1}
                                        onChange={() => changeTab(index + 1)}
                                    />
                                    <label className='tab-rb-label' htmlFor={`radio${index + 1}`}>
                                        {index + 1}
                                    </label>
                                {/*<label htmlFor={`radio${index + 1}`}></label>*/}
                                <button className="tab-btn-close" onClick={() => {}}>x</button>
                            </div>
                        ))}
                        <button onClick={()=>{createButton()}} className='add-tab'>+</button>
                </div>
                <Flatlist
                    data={orderslist}
                    headers={ctHeaders}
                    row={RowOrder}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                />
            </div>
            <div>
                <button className="btnStnd btn1">F2-Cobrar</button>
                <label>$ {Formater(total)}</label>
            </div>
        </div>
    );
}