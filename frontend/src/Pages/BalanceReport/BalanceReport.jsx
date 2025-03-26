import React, { useEffect, useState } from 'react';
import './_BalanceReport.scss';
import { TableComponent } from '../../Components';
import jsonTest from '../../jsonTest.json';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';

export const BalanceReport = () => {

    const { setSection } = useTheContext()
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate()

    const verFunction = () =>{
        navigate('/AccountState', { state: selected[0] })
    }

    const ctHeaders = [
        {
            header: 'ID/NIT',//*Nombre de cabecera
            key: 'id_nit',//*llave para acceder al dato del JSON
            defaultWidth: '131px',//*Ancho por defecto
            type: 'text',//*Tipo de celda
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
            header: 'Dirección',
            key: 'direccion',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Telefono 1',
            key: 'telefono1',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Limite de credito',
            key: 'limCredito',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Saldo actual',
            key: 'limCredito',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Ultimo Pago',
            key: 'ultimoPago',
            defaultWidth: '135.5px',
            type: 'text',
        }
    ]

    useEffect(() => {
        setSection('Reporte de saldos')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='BReport'>
            <div className='CLdiv1'>
                <div>                    
                    <label style={{marginRight: '10px'}}>Filtrar por:</label>
                    <select id='filterById'>
                        <option value='1'>Saldo</option>
                        <option value='2'>Sin Saldo</option>
                        <option value='3'>Todos</option>
                    </select>
                </div>
                <input type="text" style={{width: '20%'}}/>
                <div>
                    <label>Desde</label>
                    <input type="date"/>
                </div>
                <div>
                    <label>Hasta</label>
                    <input type="date"/>
                </div>
            </div>
            <div className='CLdiv1'>
                Total saldos pendientes: ${'2.000'}
            </div>
            <div className='CLdiv2' style={{position: 'relative'}}> 
                <button className='btn1Stnd' onClick={()=>(verFunction())}
                    disabled={(selected.length === 0 || selected.length > 1)}>
                    <i className='bi bi-eye-fill'/>
                </button>
            </div>
            <TableComponent
                data={jsonTest}
                headers={ctHeaders}
                selected={selected}
                setSelected={setSelected}
                multiSelect={false}
                doubleClickFunct={verFunction}                            
            />
        </section>
    );
}