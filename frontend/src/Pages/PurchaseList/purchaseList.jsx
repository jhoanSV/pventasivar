import React, { useEffect, useState } from 'react';
import "./_purchaseList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../products_json_test.json';

export function PurchaseList(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();

    const deselect = () =>{
        setSelected([])
    }

    const verFunction = () =>{
        navigate('/NewProduct', { state: selected[0]})
    }

    useEffect(() => {
        setSection('Compras')

        // eslint-disable-next-line
    }, []);

    const ctHeaders = [
        {
            header: 'consecutivo',
            key: 'consecutivo',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'N° de orden',
            key: 'N_orden',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Fecha',
            key: 'Fecha',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Valor',
            key: 'valor',
            defaultWidth: '223px',
            type: 'text',
        }   
    ]

    return (
        <div class="ShoppingList">
            <div>
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
            <div>                
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={multiSelect}
                />
            </div>
        </div>
    )
}