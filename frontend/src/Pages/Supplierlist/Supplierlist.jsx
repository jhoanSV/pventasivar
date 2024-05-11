import React, { useEffect } from 'react';
import './_Suplierlist.scss';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';
//test
import jsonTest from '../../jsonTest.json';
import { TableComponent } from '../../Components';

export const Supplierlist = () => {

    const { setSection } = useTheContext();
    const navigate = useNavigate();

    const verFunction = () =>{
        alert('viendo jsjs')
    }

    const ModifyFunction = () =>{
        alert('modificando jsjs')
    }

    const DeleteFunction = () =>{
        alert('eliminando jsjs')
    }

    const stHeaders = [
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
            defaultWidth: '0px',
            function: verFunction,
            type: 'BIcon',
            var1: 'bi bi-eye-fill'
        },
        {
            header: 'Modificar',
            key: null,
            defaultWidth: '0px',
            function: ModifyFunction,
            type: 'BIcon',
            var1: 'bi bi-pencil-square'
        },
        {
            header: 'Eliminar',
            key: null,
            defaultWidth: '0px',
            function: DeleteFunction,
            type: 'BIcon',
            var1: 'bi bi-trash-fill'
        }
    ]

    useEffect(() => {
        setSection('Lista de Proveedores')

        // eslint-disable-next-line
    }, []);

    return (
        <section className="SupplierList">
            <div className='SLdiv1'>
                <div>                    
                    <label>Filtrar por: </label>
                    <select>
                        <option value="1">No se 1</option>
                        <option value="2">No se 2</option>
                        <option value="2">No se 3 jsjs</option>
                    </select>
                </div>
                <input type="text" style={{width: '56%'}}/>                
            </div>
            <div className='tableContainer'>
                <TableComponent
                    data={jsonTest}
                    headers={stHeaders}
                />                
            </div>
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newsupplier')}}>Crear nuevo proveedor</button>
        </section>
    );
}