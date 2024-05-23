import React, { useEffect, useState } from 'react';
import "./_verifyPurchase.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent, Flatlist } from '../../Components';
//es un json de prueba
import jsonTest from '../../order_test.json';

export function VerifyPurchase(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();
    const [order, setOrder] = useState(jsonTest);
    const [total, setTotal] = useState(0);

    const deselect = () =>{
        setSelected([])
    }

    const verFunction = () =>{
        navigate('/NewProduct', { state: selected[0]})
    }

    useEffect(() => {
        setSection('Veridicar orden')
        totalSum()
        // eslint-disable-next-line
    }, []);

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
            defaultWidth: '131px',
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

    const row = (item) => {
        const comparator = (value1, value2) => {
            if (value1>value2){
                return <i class="bi bi-caret-up-fill" color='Green'></i>
            } else if (value1<value2){
                return <i class="bi bi-caret-down-fill" color='red'></i>
            } else {
                return <label>=</label>
            }
        }
        return (
            <div style={{display: 'flex'}}>
                <div style={{width: '131px'}}>
                    <label>{item.cantidad}</label>
                </div>
                <div style={{width: '131px'}}>
                    <label>{item.cod}</label>
                </div>
                <div style={{width: '131px'}}>
                    <label>{item.descripcion}</label>
                </div>
                <div style={{width: '223px'}}>
                    <label>$ {item.vrUnitario}</label>
                </div>
                <div style={{width: '223px'}}>
                    {comparator(item.vrUnitario, item.vrUnitarioSistem)}
                </div>
                <div style={{width: '223px'}}>
                    <label>$ {item.vrUnitario * item.cantidad}</label>
                </div>
                <div style={{width: '223px'}}>
                    <label>{item.existencia}</label>
                </div>
                <div style={{width: '223px'}}>
                    <input type="checkbox"></input>
                </div>
            </div>
        )
    }

    const totalSum = () => {
        let suma = 0;
        order.map((item, index) => (
            suma += item.cantidad * item.vrUnitario
        ))
        setTotal(suma)
    }

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
            <div className='table'>                
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={multiSelect}
                    row={row}
                />
            </div>
            <div className='theTable'>
                <thead style={{position: 'sticky', top: '0'}}>
                    <tr>
                        {ctHeaders.map((item, index) =>
                            <th key={index} style={{width: item['defaultWidth']}}>
                                <div className='cellContent'>{item['header']}</div>
                            </th>
                        )}
                    </tr>
                </thead>
                <Flatlist
                    data={jsonTest}
                    row={row}
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
            <div className="Row">
                <div className="Colmn1">
                    <label>N° pre-factura:</label>
                </div>
                <div className="Colmn2">
                    <label>000000</label>
                </div>
            </div>
            <div className="Row">
                <label>Utilidad:</label>
                <label>$ {total}</label>
            </div>
        </div>
    )
}