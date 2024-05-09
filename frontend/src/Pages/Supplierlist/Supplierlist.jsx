import React, { useEffect } from 'react';
import './_Suplierlist.scss';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';

export const Supplierlist = () => {

    const { setSection } = useTheContext();
    const navigate = useNavigate();

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
            </div>
            
            <button className='btnStnd btn1' onClick={()=>{navigate('/Newsupplier')}}>Crear nuevo proveedor</button>
        </section>
    );
}