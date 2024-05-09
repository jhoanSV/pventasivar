import React, { useEffect } from 'react';
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

    const ctHeaders = [
        {
            header: 'ID/NIT',
            key: 'id_nit',
            defaultWidth: '131px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Nombre',
            key: 'nombre',
            defaultWidth: '223px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Apellidos',
            key: 'apellido',
            defaultWidth: '223px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Telefono 1',
            key: 'telefono1',
            defaultWidth: '135.5px',
            function: null,
            type: 'text',
            var1: null
        },
        {
            header: 'Ver',
            key: null,
            defaultWidth: '57px',
            function: verFunction,
            type: 'BIcon',
            var1: 'bi bi-eye-fill'
        }
    ]

    useEffect(() => {
        setSection('Lista de Clientes')

        // eslint-disable-next-line
    }, []);

    return (
        <section className="CustomerList">
            <div className='CLdiv1'>
                <div>                    
                    <label>Filtrar por: </label>
                    <select>
                        <option value="1">No se 1</option>
                        <option value="2">No se 2</option>
                        <option value="2">No se 3 jsjs</option>
                    </select>
                </div>
                <input type="text" style={{width: '56%'}}/>
                <button className='btnStnd btn1'>Estado de cuenta</button>
            </div>
            <div className='tableContainer'>
                <TableComponent
                    data={jsonTest}
                    headers={ctHeaders}
                />
            </div>
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newcustomer')}}>Crear nuevo cliente</button>
            <button className='btnStnd btn1'>Exportar a Excel</button>
        </section>
    );
}