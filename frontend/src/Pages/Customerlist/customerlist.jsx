import React, { useEffect, useRef, useState } from 'react';
import "./_customerlist.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
import { GeneralModal } from '../../Components/Modals/GeneralModal';
import { Clientlist } from '../../api';
import * as XLSX from 'xlsx';
export function Customerlist(){

    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [show1, setShow1] = useState(false);
    const [contentList, setContentList] = useState([]);
    const refList = useRef([]);
    const navigate = useNavigate();
    const { setSection, setSomeData, usD } = useTheContext();

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
        setSomeData({...selected[0]})
        navigate('/NewCustomer')
    }

    const DeleteFunction = () =>{
        alert('Elimineishon')
    }

    const deselect = () =>{
        setSelected([])
    }

    const ctHeaders = [
        {
            header: 'NIT/CC',//*Nombre de cabecera
            key: 'NitCC',//*llave para acceder al dato del JSON
            defaultWidth: '131px',//*Ancho por defecto
            type: 'text',//*Tipo de celda
        },
        {
            header: 'Nombre',
            key: 'Nombre',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Apellidos',
            key: 'Apellido',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Telefono 1',
            key: 'Telefono1',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'E-mail',
            key: 'Correo',
            defaultWidth: '135.5px',
            type: 'text',
        }
    ]

    const filterByText = (item, text) =>
        item.NitCC.toLowerCase().includes(text) ||
        item.Nombre.toLowerCase().includes(text) ||
        item.Apellido.toLowerCase().includes(text) ||
        item.Barrio.toLowerCase().includes(text) ||
        item.Correo.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        let c = refList.current;
        if (text !== ''){
            setContentList(c.filter((i)=>filterByText(i, text)));
        }else{            
            CustomerFetch()
        }
    }

    const CustomerFetch = async() =>{
        const listado = await Clientlist({
            "IdFerreteria" : usD.Cod
        })
        if(listado){
            setContentList(listado)
            refList.current = listado;
        };
        console.log(listado);
    }

    const exportXl = () =>{
        const theList = contentList.map(({ NitCC, Nombre, Apellidos, Telefono1, Correo }) => ({ NitCC, Nombre, Apellidos, Telefono1, Correo }));
        const worksheet = XLSX.utils.json_to_sheet(theList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
        XLSX.writeFile(workbook, "Lista Clientes.xlsx",);
    }

    useEffect(() => {
        setSection('Lista de Clientes')
        setSomeData(null)
        CustomerFetch()

        // eslint-disable-next-line
    }, []);

    return (
        <section className="CustomerList">
            <div className='actionsContainer'>
                <div className='CLdiv1'>
                    <div>
                        <label style={{marginRight: '10px'}}>Filtrar/Buscar: </label>
                    </div>
                    <input type="text" style={{width: '56%'}}
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                    />
                    {/* {<button className='btnStnd btn1' onClick={()=>{navigate('/BalanceReport')}}>Reporte de saldos</button>} */}
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
                data={contentList}
                headers={ctHeaders}
                selected={selected}
                setSelected={setSelected}
                multiSelect={multiSelect}
                doubleClickFunct={verFunction}
            />
            <div style={{marginTop: '10px'}}>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{navigate('/Newcustomer')}}
                    style={{marginRight: '20px'}}
                >Crear nuevo cliente</button>
                <button className='btnStnd btn1' onClick={()=>exportXl()}>Exportar a Excel</button>
            </div>
        </section>
    );
}