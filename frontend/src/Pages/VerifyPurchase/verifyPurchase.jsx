import React, { useEffect, useState } from 'react';
import "./_verifyPurchase.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist } from '../../Components';
import { TheInput } from '../../Components/InputComponent/TheInput';
//es un json de prueba
import jsonTest from '../../order_test.json';

export function VerifyPurchase(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();
    const [order, setOrder] = useState(jsonTest);
    const [total, setTotal] = useState(0);
    const [showModalChangeprice, setShowModalChangeprice] = useState(true);


    useEffect(() => {
        setSection('Verificar orden')
        totalSum()
        // eslint-disable-next-line
    }, []);
    
    const deselect = () =>{
        setSelected([])
    };

    const verFunction = () =>{
        navigate('/NewProduct', { state: selected[0]})
    };

    const checkbox = () =>{
        //This function verify if the client has selected verify the product
        console.log('it chanched correctly')
    };


    const ctHeaders = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '300px',
            type: 'text',
        },
        {
            header: 'Vr. Unitario',
            key: 'vrUnitario',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Diferencia',
            key: 'diferencia',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Existencia',
            key: 'existencia',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'verificado',
            key: 'verificado',
            defaultWidth: '223px',
            type: 'text',
        }
    ]

    const row = (item, isSelected, columnsWidth) => {
        const comparator = (value1, value2) => {
            if (value1>value2){
                return <i class="bi bi-caret-up-fill" style={{color: 'green'}}></i>
            } else if (value1<value2){
                return <i class="bi bi-caret-down-fill" style={{color: 'red'}}></i>
            } else {
                return <label>=</label>
            }
        }
        return (
            <tbody
                onClick={()=>{console.log(item)}}
                onDoubleClick={()=>{setShowModalChangeprice(true)}}>
                <div style={{width: columnsWidth[0]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.cantidad}</label>
                </div>
                <div style={{width: columnsWidth[1]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.cod}</label>
                </div>
                <div style={{width: columnsWidth[2]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.descripcion}</label>
                </div>
                <div style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.vrUnitario)}</label>
                </div>
                <div style={{width: columnsWidth[4], alignItems: 'center' }}>
                    {comparator(item.vrUnitario, item.vrUnitarioSistem)}
                </div>
                <div style={{width: columnsWidth[5]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.vrUnitario * item.cantidad)}</label>
                </div>
                <div style={{width: columnsWidth[6]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.existencia}</label>
                </div>
                <div style={{width: columnsWidth[7]}}>
                    <input
                        type="checkbox"
                        onChange={()=>checkbox()}></input>
                </div>
            </tbody>
        )
    }

    const totalSum = () => {
        let suma = 0;
        order.map((item, index) => (
            suma += item.cantidad * item.vrUnitario
        ))
        setTotal(suma)
    }

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const ChangePrice = (codProduct) =>{
        const data = {
            "cantidad": 3,
            "cod": "TNC25",
            "descripcion": "Motoreductor amarillo dlble eje",
            "vrUnitario": 5500,
            "vrUnitarioSistem": 5400,
            "diferencia": -100,
            "vrTotal": 3000,
            "estado": 0,
            "existencia": 4
        }
        return (
            <div>
                <div>
                    <div>
                        <label className='subtitle'>Codigo:</label>
                        <label className='subtitle'>{codProduct}</label>
                    </div>
                </div>
                <div >
                    <label className='subtitle'>order.descripcion</label>
                </div>
                <div className='Rows'>
                    <div className='column1'>
                        <label className='subtitle'>Inventario actual:</label>
                    </div>
                    <div className='column2'>
                        <label>order.invMinimo</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Minimo:</label>
                    </div>
                    <div className='column2'>
                        <label>order.invMinimo</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Maximo:</label>
                    </div>
                    <div className='column2'>
                        <label>order.invMaximo</label>
                    </div>
                    <div className='column1'>
                        <label className='subtitle'>Consto actual:</label>
                    </div>
                    <label className='column2'>$ order.constoActual</label>
                </div>
                <div className='form-container'>
                    <div className='form-row'>
                        <label className='subtitle'>Cantidad de compra:</label>
                        <TheInput numType='nat'>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Nuevo costo:</label>
                        <TheInput numType='real'>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Ganancia:</label>
                        <TheInput numType='real'>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>Nuevo precio de venta:</label>
                        <TheInput numType='real'>
                        </TheInput>
                    </div>
                    <div className='form-row'>
                        <label className='subtitle'>precio venta:</label>
                        <label>$ 000</label>
                    </div>
                </div>
                <div>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{}}
                            >
                            aceptar
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{setShowModalChangeprice(false)}}
                        >
                            cancelar
                    </button>
                </div>
            </div>
        )

    };

    return (
        <div class="ShoppingList">
            <div className='Titles'>
                <h2>Numero de compra</h2>
                <h2>000</h2>
            </div>
            <div className='Row'>
                <button className='btn1Stnd' onClick={()=>(verFunction())}
                            disabled={(selected.length === 0 || selected.length > 1)}>
                            <i className='bi bi-trash-fill'/>
                        </button>
                <label>Modificar</label>
            </div>
            <div className='Table'>
                <Flatlist
                    data={order}
                    row={row}
                    headers={ctHeaders}
                />
            </div>
            <div>
            <button className='btnStnd btn1'
                    style={{marginLeft: '20px'}}
                    onClick={()=>{navigate('/AddInventory');setSection('Agregar al inventario')}}
                >
                    Recepcionar pedido
            </button>
            </div>
            <div className='Finantialdata'>
                <div className="Row">
                    <div className='column'>
                        <label style={{fontWeight: 600}}>N° pre-factura:</label>
                    </div>
                    <div className='column'>
                        <label>000000</label>
                    </div>
                </div>
                <div className="Row">
                    <div className='column'>
                        <label style={{fontWeight: 600}}>Utilidad:</label>
                    </div>
                    <div className='column'>
                        <label>$ {Formater(total)}</label>
                    </div>
                </div>
            </div>
            {showModalChangeprice && ChangePrice('001')}
        </div>
    )
}