import React, { useEffect } from 'react';
import "./_ProductsList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../jsonTest.json';

export function ProductsList(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Listado de productos')

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
        <div class="Productslist">
            
            <div className='tableContainer'>
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                />
            </div>
        </div>
    )
}