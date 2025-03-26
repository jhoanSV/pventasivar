import React, { useEffect, useState, useRef } from 'react';
import "./_purchaseList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { Flatlist } from '../../Components';
import { PurchaseList as listaCompras } from '../../api';

export function PurchaseList(){

    const navigate = useNavigate()
    const [stateFilter, setStateFilter] = useState('Todos');
    const [ selectedfila, setSelectedfila] = useState(0);
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [ordersList, setOrdersList] = useState([]);
    const OrdersRef = useRef([]);
    const selectedfilaRef = useRef(selectedfila);
    const inputRef = useRef(null);
    const { setSection, usD, setSomeData } = useTheContext();

    const handleKeyDown = (event) => {
        if (ordersList.length !== 0) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < ordersList.length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < ordersList.length) {
                setSelectedfila(currentSelectedFila - 1)
            }
        }
    };

    const fetchPurchaseList = async() => {
        const res = await listaCompras({
            'IdFerreteria' : usD.Cod
        })
        console.log(res);
        OrdersRef.current = res
        setOrdersList(res)
    }

    const ctHeaders = [
        {
            header: 'Consecutivo',
            key: 'ConInterno',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'N° de orden',
            key: 'NPreFactura',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Estado',
            key: 'Estado',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Fecha',
            key: 'Fecha',
            defaultWidth: 223,
            type: 'text',
        },
        {
            header: 'Valor',
            key: 'Total',
            defaultWidth: 223,
            type: 'date',
        }   
    ]

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const StateOfTheOrder = (theState) => {
        // This function gives the color of the state of the order deppending on its value.
        console.log(theState);
        if (theState === 'Recibido'){
            return {color: 'green'}
        }else if (theState === 'Por ingresar'){
            return {color: 'red'}
        }else{
            return {color: 'black'}
        }
    };

    const filterByText = (item, text) => {
        // Filter the data depending on the text of the searcher
        if (stateFilter!== 'Todos'){
            console.log('fecha 1 ' + date1 + ' fecha 2 ' + date2)
            if (date1!== '' && date2 === '') {
                return item.NPreFactura.toString().includes(text)
                    && item.Estado.toString() === stateFilter
                    && item.Fecha >= new Date(date1)
            } else if (date2!== '' && date1 === '') {
                return item.NPreFactura.toString().includes(text) && item.Estado.toString() === stateFilter && new Date(item.Fecha) <= new Date(date2)
            } else if (date1!== '' && date2!== '') {
                return item.NPreFactura.toString().includes(text) && item.Estado.toString() === stateFilter && new Date(item.Fecha) >= new Date(date1) && new Date(item.Fecha) <= new Date(date2)   
            } else {
                return item.NPreFactura.toString().includes(text) && item.Estado.toString() === stateFilter
            }
        } else {
            if (date1!== '' && date2 === '') {
                return item.NPreFactura.toString().includes(text)
                    && item.Estado.toString() === stateFilter
                    && item.Fecha >= new Date(date1)
            } else if (date2!== '' && date1 === '') {
                return item.NPreFactura.toString().includes(text) && new Date(item.Fecha) <= new Date(date2)
            } else if (date1!== '' && date2!== '') {
                return item.NPreFactura.toString().includes(text) && new Date(item.Fecha) >= new Date(date1) && new Date(item.Fecha) <= new Date(date2)   
            } else {
                return item.NPreFactura.toString().includes(text)
            }
        }
    };

    const SearchHandle = (text) =>{
        let c = OrdersRef.current;
        console.log(c);
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setOrdersList(c)
        }else{
            // here has to be the function that gets called the query again
            fetchPurchaseList()
        }
    };

    const dateFormater = (date) =>{
        const theDate = new Date(date);
        const day = theDate.getDate();
        const month = theDate.getMonth() + 1;
        const year = theDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const row=(item, isSelected, columnsWidth)=> {
        return (
            <>
                <td style={{width: columnsWidth[0]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.ConInterno}</label>
                </td>
                <td style={{width: columnsWidth[1]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.NPreFactura}</label>
                </td>
                <td style={{width: columnsWidth[2]}}>
                    <label className={isSelected ? 'selected-label' : ''} style={StateOfTheOrder(item.Estado)}>{item.Estado}</label>
                </td>
                <td style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{dateFormater(item.Fecha)}</label>
                </td>
                <td style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.Total)}</label>
                </td>
            </>
        )
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        let c = OrdersRef.current;
        setStateFilter(value);
        if (value!== 'Todos'){
            c = c.filter((item)=> item.Estado.toString() === value);
            console.log(c);
            //setOrdersList(c)
            setOrdersList(c)
        } else {
            //setOrdersList(ordersList)
            setOrdersList(c)
        }
        // Execute your custom logic here
        console.log(`Selected value: ${value}`);
    };

    // const filterText = (item, text) => { //* No se para que es esta funcion jsjs
    //     const textMatch = (item) => item.NPreFactura.toString().includes(text);
    //     const stateMatch = (item) => stateFilter === 'Todos' || item.Estado.toString() === stateFilter;
    //     const dateMatch = (item) => {
    //         const itemDate = new Date(item.Fecha);
    //         const startDateCheck = date1 ? itemDate >= new Date(date1) : true;
    //         const endDateCheck = date2 ? itemDate <= new Date(date2) : true;
    //         return startDateCheck && endDateCheck;
    //     };
    //     return (item) => textMatch(item) && stateMatch(item) && dateMatch(item);
    // };

    // Function to get the input value at any time
    const getInputValue = () => {
        const currentValue = inputRef.current.value.toLowerCase();
        console.log('Current input value:', currentValue);
        return currentValue;
    };
    const verPurchase = () =>{
        navigate('/VerifyPurchase');
        setSection('Verificar Compra');
        setSomeData(ordersList[selectedfila]);
    }
    
    useEffect(() => {
        SearchHandle(getInputValue());
        setSomeData(null);
        // eslint-disable-next-line
    }, [date1, date2]);

    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        setSection('Compras');
        fetchPurchaseList();
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    
    return (
        <section className="ShoppingList">
            <div className='searchSection'>
                <div className='search'>
                    <label
                        style={{fontWeight: '600'}}>Buscar:</label>
                    <input
                        type="text"
                        className="searcher"
                        id="buscar"
                        placeholder='Buscar facura'
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                        ref={inputRef}/>
                </div>

                <div className='searchDate'>
                    <label
                        style={{fontWeight: '600'}}>Desde:</label>
                    <input
                        type="date"
                        onChange={(e)=>{setDate1(e.target.value)}}/>
                    <label
                        style={{fontWeight: '600'}}>Hasta:</label>
                    <input
                        type="date"
                        onChange={(e)=>{setDate2(e.target.value)}}/>
                </div>
            </div>
            <div className='ButtonActios'>
                <label>Filtrar por:</label>
                <select id='filterById' onChange={handleSelectChange}>
                    <option value='Recibido'>Recibido</option>
                    <option value='Por ingresar'>Por ingresar</option>
                    <option value='Todos'>Todos</option>
                </select>
                <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/AddInventory');setSection('Agregar al inventario')}}
                    >
                        Agregar a inventario
                </button>
                <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{verPurchase()}}
                    >
                        Verificar compra
                </button>
                <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/LowInv');setSection('Nueva Compra')}}
                    >
                        Nueva compra
                </button>
            </div>
            <Flatlist
                data={ordersList}
                row={row}
                headers={ctHeaders}
                selectedRow={selectedfila}
                setSelectedRow={setSelectedfila}
                doubleClick={()=>{verPurchase()}}
            />
        </section>
    )
}