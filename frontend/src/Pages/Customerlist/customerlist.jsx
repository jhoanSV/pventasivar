import React, { useEffect, useState } from 'react';
import "./_customerlist.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
//Para testeo
import jsonTest from '../../jsonTest.json';
import { TableComponent } from '../../Components';

export function Customerlist(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();

    const verFunction = () =>{
        alert('viendo jsjs')
    }

    const DeleteFunction = () =>{
        alert('eliminando jsjs')
    }

    const [selected, setSelected] = useState([]);

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

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    return (
        <section className="CustomerList">
            <div className='actionsContainer'>
                <div className='CLdiv1'>
                    <div>
                        <label>Filtrar/Buscar: </label>
                    </div>
                    <input type="text" style={{width: '56%'}}/>
                    <button className='btnStnd btn1'>Reporte de saldos</button>
                </div>
                <div className='CLdiv2'>
                    <label style={{marginRight: '8px', padding: '3px'}}>
                        Seleccionados: {'0'}
                    </label>                    
                    <button className='btn1Stnd' disabled={(selected.length === 0 || selected.length > 1)}>
                        <i className='bi bi-eye-fill'/>
                    </button>
                    <button className='btn1Stnd' disabled={selected.length === 0}>
                        <i className='bi bi-trash-fill'/>
                    </button>
                </div>
            </div>
            <div className='tableContainer'>
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                    setSlct={setSelected}
                />
            </div>
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newcustomer')}}>Crear nuevo cliente</button>
            <button className='btnStnd btn1'>Exportar a Excel</button>
        </section>
    );
}