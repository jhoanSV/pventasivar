import React, { useEffect } from 'react';
import "./_inventory.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../jsonTest.json';

export function Inventory(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Inventario')

        // eslint-disable-next-line
    }, []);

    const ctHeaders = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '131px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '223px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Categoria',
            key: 'categoria',
            defaultWidth: '223px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Costo',
            key: 'costo',
            defaultWidth: '135.5px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Precio compra',
            key: 'precio_compra',
            defaultWidth: '0px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Ver',
            key: null,
            defaultWidth: '0px',
            function: null,
            type: 'BIcon',
            var1: 'bi bi-pencil-square'
        }
    ]

    return (
        <div class="Inventory">
            <div className="Row">
                <div className="Colmn1">
                    <label>Costo del inventario</label>
                    <label>$000.000,00</label>
                </div>
                <div className="Colmn2">
                    <label>Cantidad de productos en el inventario</label>
                    <label>Muchos productos</label>
                </div>
            </div>
            <div className='tableContainer'>
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                />
            </div>
        </div>
    )
}