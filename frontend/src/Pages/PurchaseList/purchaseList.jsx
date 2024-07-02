import React, { useEffect, useState, useRef } from 'react';
import "./_purchaseList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist } from '../../Components';
//es un json de pruebcenter;
import jsonTest from '../../products_json_test.json';

export function PurchaseList(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [stateFilter, setStateFilter] = useState('Todos');
    const [ selectedfila, setSelectedfila] = useState(0);
    const { setSection } = useTheContext();
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const selectedfilaRef = useRef(selectedfila);
    const inputRef = useRef(null);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);

    const handleKeyDown = (event) => {
        if (dataorder.length !== 0) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < dataorder.length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < dataorder.length) {
                setSelectedfila(currentSelectedFila - 1)
            }
        }
    };

    let dataorder = [{
            consecutivo: 13,
            N_orden: 100,
            estado: 'Recibido',
            Fecha: '2024-01-01',
            valor: 1000000,
        },
        {
            consecutivo: 12,
            N_orden: 101,
            estado: 'Por ingresar',
            Fecha: '2024-11-20',
            valor: 560000,
        },
        {
            consecutivo: 11,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 10,
            N_orden: 103,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 9,
            N_orden: 104,
            estado: 'Por ingresar',
            Fecha: '2024-09-20',
            valor: 1000000,
        },
        {
            consecutivo: 8,
            N_orden: 102,
            estado: 'Por ingresar',
            Fecha: '2024-08-20',
            valor: 1000000,
        },
        {
            consecutivo: 7,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-07-20',
            valor: 1000000,
        },
        {
            consecutivo: 6,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-06-20',
            valor: 1000000,
        },
        {
            consecutivo: 5,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-05-20',
            valor: 1000000,
        },
        {
            consecutivo: 4,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-04-20',
            valor: 1000000,
        },
        {
            consecutivo: 3,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-03-20',
            valor: 1000000,
        },
        {
            consecutivo: 2,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-02-20',
            valor: 1000000,
        },
        {
            consecutivo: 1,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2024-01-01',
            valor: 1000000,
        }
    
    ];

    const [orderslist, setOrderslist] = useState(dataorder);

    const deselect = () =>{
        setSelected([])
    };

    const verFunction = () =>{
        navigate('/NewProduct', { state: selected[0]})
    };

    useEffect(() => {
        setSection('Compras')

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        SearchHandle(getInputValue());
    }, [date1, date2, stateFilter]);

    const ctHeaders = [
        {
            header: 'consecutivo',
            key: 'consecutivo',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'N° de orden',
            key: 'N_orden',
            defaultWidth: 131,
            type: 'text',
        },
        ,
        {
            header: 'Estado',
            key: 'estado',
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
            key: 'valor',
            defaultWidth: 223,
            type: 'text',
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
                return item.N_orden.toString().includes(text)
                    && item.estado.toString() === stateFilter
                    && item.Fecha >= new Date(date1)
            } else if (date2!== '' && date1 === '') {
                return item.N_orden.toString().includes(text) && item.estado.toString() === stateFilter && new Date(item.Fecha) <= new Date(date2)
            } else if (date1!== '' && date2!== '') {
                return item.N_orden.toString().includes(text) && item.estado.toString() === stateFilter && new Date(item.Fecha) >= new Date(date1) && new Date(item.Fecha) <= new Date(date2)   
            } else {
                return item.N_orden.toString().includes(text) && item.estado.toString() === stateFilter
            }
        } else {
            if (date1!== '' && date2 === '') {
                return item.N_orden.toString().includes(text)
                    && item.estado.toString() === stateFilter
                    && item.Fecha >= new Date(date1)
            } else if (date2!== '' && date1 === '') {
                return item.N_orden.toString().includes(text) && new Date(item.Fecha) <= new Date(date2)
            } else if (date1!== '' && date2!== '') {
                return item.N_orden.toString().includes(text) && new Date(item.Fecha) >= new Date(date1) && new Date(item.Fecha) <= new Date(date2)   
            } else {
                return item.N_orden.toString().includes(text)
            }
        }
    };



    const SearchHandle = (text) =>{
        let c = dataorder;
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setOrderslist(c)
        }else{
            // here has to be the function that gets called the query again
            c = c.filter((i)=>filterByText(i, text))
            setOrderslist(c)
        }
    };

    const row=(item, isSelected, columnsWidth)=> {
        return (
            <>
                <td style={{width: columnsWidth[0]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.consecutivo}</label>
                </td>
                <td style={{width: columnsWidth[1]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.N_orden}</label>
                </td>
                <td style={{width: columnsWidth[2]}}>
                    <label className={isSelected ? 'selected-label' : ''} style={StateOfTheOrder(item.estado)}>{item.estado}</label>
                </td>
                <td style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Fecha}</label>
                </td>
                <td style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.valor)}</label>
                </td>
            </>
        )
    };

    const handleSelectChange = (event) => {
        const value = event.target.value;
        let c = dataorder;
        setStateFilter(value);
        if (value!== 'Todos'){
            c = c.filter((item)=> item.estado.toString() === value);
            setOrderslist(c)
        } else {
            setOrderslist(dataorder)
        }
        // Execute your custom logic here
        console.log(`Selected value: ${value}`)
        ;
    };

    const filterText = (item, text) => {
        const textMatch = (item) => item.N_orden.toString().includes(text);
        const stateMatch = (item) => stateFilter === 'Todos' || item.estado.toString() === stateFilter;
        const dateMatch = (item) => {
            const itemDate = new Date(item.Fecha);
            const startDateCheck = date1 ? itemDate >= new Date(date1) : true;
            const endDateCheck = date2 ? itemDate <= new Date(date2) : true;
            return startDateCheck && endDateCheck;
        };
        return (item) => textMatch(item) && stateMatch(item) && dateMatch(item);
    };

    // Function to get the input value at any time
    const getInputValue = () => {
        const currentValue = inputRef.current.value.toLowerCase();
        console.log('Current input value:', currentValue);
        return currentValue;
    };
    
    return (
        <section class="ShoppingList">
            <div className='searchSection'>
                <div className='search'>
                    <label
                        style={{'font-weight': '600'}}>Buscar:</label>
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
                        style={{'font-weight': '600'}}>Desde:</label>
                    <input
                        type="date"
                        onChange={(e)=>{setDate1(e.target.value)}}/>
                    <label
                        style={{'font-weight': '600'}}>Hasta:</label>
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
                        onClick={()=>{navigate('/VerifyPurchase');setSection('Verificar orden')}}
                    >
                        Verificar compra
                </button>
                <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{window.location.href = 'https://www.sivar.com.co/';}}
                    >
                        Nueva compra
                </button>
            </div>
            <Flatlist
                data={orderslist}
                row={row}
                headers={ctHeaders}
                selectedRow={selectedfila}
                setSelectedRow={setSelectedfila}
            />
        </section>
    )
}