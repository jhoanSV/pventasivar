import React, { useEffect, useState } from 'react';
import "./_customerlist.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
//Para testeo
import jsonTest from '../../jsonTest.json';
import { TableComponent } from '../../Components';

export function Customerlist(){

    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const navigate = useNavigate()
    const { setSection } = useTheContext();

    const verFunction = () =>{
        navigate('/Newcustomer', { state: selected[0] })
    }

    const DeleteFunction = () =>{
        alert('eliminando jsjs')
    }

    const deselect = () =>{
        setSelected([])
    }

    const ctHeaders = [
        {
            header: 'ID/NIT',
            key: 'id_nit',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Nombre',
            key: 'nombre',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Apellidos',
            key: 'apellido',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Telefono 1',
            key: 'telefono1',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'E-mail',
            key: 'email',
            defaultWidth: '135.5px',
            type: 'text',
        }
    ]

    useEffect(() => {
        setSection('Lista de Clientes')

        // eslint-disable-next-line
    }, []);

    return (
        <section className="CustomerList">
            <div className='actionsContainer'>
                <div className='CLdiv1'>
                    <div>
                        <label>Filtrar/Buscar: </label>
                    </div>
                    <input type="text" style={{width: '56%'}}/>
                    <button className='btnStnd btn1' onClick={()=>{navigate('/BalanceReport')}}>Reporte de saldos</button>
                </div>
                <div className='CLdiv2'>
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
                </div>
            </div>
            <TableComponent
                data={jsonTest}
                headers={ctHeaders}
                selected={selected}
                setSelected={setSelected}
                multiSelect={multiSelect}
            />
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newcustomer')}}>Crear nuevo cliente</button>
            <button className='btnStnd btn1'>Exportar a Excel</button>
        </section>
    );
}