import React, { useEffect, useState } from 'react';
import "./_customerlist.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
//Para testeo
import jsonTest from '../../jsonTest.json';
import { TableComponent } from '../../Components';
import { GeneralModal } from '../../Components/Modals/GeneralModal';

export function Customerlist(){

    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [show1, setShow1] = useState(false);
    const navigate = useNavigate()
    const { setSection } = useTheContext();

    const Popop1 = () => {
        
        return(
            <>
                Escriba "eliminar" para confirmar la eliminación
                <input type='text'></input>
                <div style={{display: 'flex', gap: '5px'}}>
                    <button className='btnStnd btn1' onClick={() => setShow1(false)}>Cancelar</button>
                    <button className='btnStnd btn1' onClick={() => DeleteFunction()}>Eliminar</button>
                </div>
            </>
        )
    }

    const verFunction = () =>{
        navigate('/Newcustomer', { state: selected[0] })
    }

    const DeleteFunction = () =>{
        alert('Elimineishon')
    }

    const deselect = () =>{
        setSelected([])
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
                <div className='CLdiv2' style={{position: 'relative'}}>
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
                    <button className='btn1Stnd' onClick={()=>(setShow1(true))}
                        disabled={selected.length === 0}>
                        <i className='bi bi-trash-fill'/>
                    </button>
                    {show1 && <GeneralModal show={setShow1} Contenido={Popop1}/>}
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
                doubleClickFunct={verFunction}
            />
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newcustomer')}}>Crear nuevo cliente</button>
            <button className='btnStnd btn1'>Exportar a Excel</button>
        </section>
    );
}