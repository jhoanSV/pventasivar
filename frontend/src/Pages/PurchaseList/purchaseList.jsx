import React, { useEffect, useState } from 'react';
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
    const [stateFilter, setStateFilter] = useState('')
    const { setSection } = useTheContext();
    let dataorder = [{
            consecutivo: 13,
            N_orden: 100,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 12,
            N_orden: 101,
            estado: 'Por ingresar',
            Fecha: '2021-10-10',
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
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 8,
            N_orden: 102,
            estado: 'Por ingresar',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 7,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 6,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 5,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 4,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 3,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 2,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
            valor: 1000000,
        },
        {
            consecutivo: 1,
            N_orden: 102,
            estado: 'Recibido',
            Fecha: '2021-10-10',
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
            return item.N_orden.toString().includes(text) && item.estado.toString() == stateFilter
        } else {
            return item.N_orden.toString().includes(text)
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
            <tbody onClick={()=>{console.log(item)}} onDoubleClick={()=>{console.log("activa el modificar")}}>
                <div style={{width: columnsWidth[0]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.consecutivo}</label>
                </div>
                <div style={{width: columnsWidth[1]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.N_orden}</label>
                </div>
                <div style={{width: columnsWidth[2]}}>
                    <label className={isSelected ? 'selected-label' : ''} style={StateOfTheOrder(item.estado)}>{item.estado}</label>
                </div>
                <div style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Fecha}</label>
                </div>
                <div style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.valor)}</label>
                </div>
            </tbody>
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

    
    return (
        <div class="ShoppingList">
            <div className='searchSection'>
                <div></div>
                <div className='search'>
                    <label
                        style={{'font-weight': '600'}}>Buscar:</label>
                    <input
                        type="text"
                        className="searcher"
                        id="buscar"
                        placeholder='Buscar facura'
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}/>
                </div>

                <div className='searchDate'>
                    <label
                        style={{'font-weight': '600'}}>Desde:</label>
                    <input
                        type="date"/>
                    <label
                        style={{'font-weight': '600'}}>Hasta:</label>
                    <input
                        type="date"
                        />
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
            <div className='Table'>               
                {/*<TableComponent
                    data={orderslist}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={multiSelect}
                />*/}
                <Flatlist
                    data={orderslist}
                    row={row}
                    headers={ctHeaders}
                />
            </div>
        </div>
    )
}