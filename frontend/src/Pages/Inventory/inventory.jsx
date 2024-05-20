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
            header: 'Costo',
            key: 'costo',
            defaultWidth: '223px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '135.5px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Precio venta',
            key: 'precio_venta',
            defaultWidth: '0px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Existencia',
            key: 'exitencia',
            defaultWidth: '0px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Inv. minimo',
            key: 'inv_minimo',
            defaultWidth: '0px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Inv. maximo',
            key: 'inv_maximo',
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
        },
        {
            header: 'Modificar',
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
                    <div>
                        <label>Costo del inventario</label>
                    </div>
                    <label>$000.000,00</label>
                </div>
                <div className="Colmn2">
                    <div>
                        <label>Cantidad de productos en el inventario</label>
                    </div>
                    <label>Muchos productos</label>
                </div>
            </div>
            <div classname="Row">
                <label>Buscar:</label>
                <input type="text" placeholder='Buscar'/>
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