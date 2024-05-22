import React, { useEffect, useState } from 'react';
import "./_ProductsList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../products_json_test.json';

export function ProductsList(){

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
        setSection('Listado de productos')

        // eslint-disable-next-line
    }, []);

    const ctHeaders = [
        {
            header: 'Cod',
            key: 'cod',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Cod de barras',
            key: 'cod_de_barras',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Categoria',
            key: 'categoria',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'P. Costo',
            key: 'pcosto',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'P. Venta',
            key: 'pventa',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Pre Compra',
            key: 'pre_compra',
            defaultWidth: '0px',            
            type: 'text',
        }
    ]

    return (
        <div class="Productslist">
            <div className=''>
                <div className='' style={{padding: '10px 140px'}}>
                    <label>Buscar:</label>
                    <input type="text" placeholder='Buscar'/>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newproduct')}}
                    >
                        Nuevo producto
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Inventory');setSection('Inventario')}}
                    >
                        Inventario
                    </button>
                </div>
                <div className=''>
                    {/*<button className='btn1Stnd' onClick={()=>(deselect())}
                        disabled={selected.length === 0}>
                        <i className='bi bi-x'/>
                    </button>
                    <label style={{marginRight: '8px', padding: '3px', color: selected.length === 0 ? 'rgb(183 183 183)' : 'black'}}>
                        Seleccionados: {selected.length}
                    </label>*/}
                    <button className='btn1Stnd' onClick={()=>(verFunction())}
                        disabled={(selected.length === 0 || selected.length > 1)}>
                        <i className='bi bi-eye-fill'/>
                    </button>
                    {/*<input id='checkmlsct' type="checkbox" className="" onChange={()=>{setMultiSelect(a=>!a);setSelected([])}}/>
                    <label className='noSelect' style={{padding: '3px'}} htmlFor='checkmlsct'>
                        Seleccionar Varios
                    </label>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newsupplier');setSection('Nuevo Proveedor')}}
                    >
                        Actualizar varios
                    </button>*/}
                </div>
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