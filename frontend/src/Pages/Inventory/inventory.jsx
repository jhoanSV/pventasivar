import React, { useEffect, useState } from 'react';
import "./_inventory.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../products_json_test.json';

export function Inventory(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Inventario')

        // eslint-disable-next-line
    }, []);

    const InvHeaders = [
        {
            header: 'Cod',
            key: 'cod',
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
            header: 'Costo',
            key: 'costo',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Precio venta',
            key: 'precio_venta',
            defaultWidth: '0px',
            type: 'text',
        },
        {
            header: 'Existencia',
            key: 'existencia',
            defaultWidth: '0px',
            type: 'text',
        },
        {
            header: 'Inv. minimo',
            key: 'inv_minimo',
            defaultWidth: '0px',
            type: 'text',
        },
        {
            header: 'Inv. maximo',
            key: 'inv_maximo',
            defaultWidth: '0px',
            type: 'text',
        }
    ]

    const DeleteFunction = () =>{
        alert('eliminando jsjs')        
    }

    const deselect = () =>{
        setSelected([])
    }

    const verFunction = () =>{
        navigate('/Products', { state: selected[0] })
    }
    
    return (
        <div className="Inventory">
            <div className="Row">
                <div className="Colmn1">
                    <div>
                        <label>Costo del inventario</label>
                    </div>
                    <label>$000.000,00</label>
                </div>
                <div className="Colmn2">
                    <div>
                        <label>Cantidad de articulos en el inventario</label>
                    </div>
                    <label>Muchos productos</label>
                </div>
            </div>
            <div className="Row">
                <label>Buscar:</label>
                <input type="text" placeholder='Buscar'/>
            </div>
            <div className=''>
                <div className='' style={{padding: '10px 140px'}}>
                    <label>Categoria:</label>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newsupplier');setSection('Nuevo Proveedor')}}
                    >
                        Actualizar varios
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{}}
                    >
                        Bajos en inventario
                    </button>
                </div>
                <div className=''>
                    <button className='btn1Stnd' onClick={()=>(deselect())}
                        disabled={selected.length === 0}>
                        <i className='bi bi-x'/>
                    </button>
                    <label style={{marginRight: '8px', padding: '3px', color: selected.length === 0 ? 'rgb(183 183 183)' : 'black'}}>
                        Seleccionados: {selected.length}
                    </label>
                    <button className='btn1Stnd' onClick={()=>(verFunction())}
                        disabled={(selected.length === 0 || selected.length > 1)}>
                        <i className='bi bi-eye-fill'/>
                    </button>
                    <button className='btn1Stnd' onClick={()=>(DeleteFunction())}
                        disabled={selected.length === 0}>
                        <i className='bi bi-trash-fill'/>
                    </button>
                    <input id='checkmlsct' type="checkbox" className="" onChange={()=>{setMultiSelect(a=>!a);setSelected([])}}/>
                    <label className='noSelect' style={{padding: '3px'}} htmlFor='checkmlsct'>
                        Seleccionar Varios
                    </label>
                    <label className='noSelect' style={{padding: '3px'}} htmlFor='checkmlsct'>
                        Ajuste de inventario
                    </label>
                    <button className='btn1Stnd' onClick={()=>(DeleteFunction())}
                        disabled={selected.length === 0}>
                        <i className='bi bi-trash-fill'/>
                    </button>
                </div>
            </div>
            <div>
                <TableComponent
                    data={jsonTest}
                    headers={InvHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={multiSelect}
                />
            </div>
        </div>
    )
}