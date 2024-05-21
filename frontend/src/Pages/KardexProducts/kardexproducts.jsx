import React, {useEffect, useState}from 'react';
import "./_kardexproducts.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../jsonTest.json';


export function Kardexproducts(){

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Kardex de inventario')
        // eslint-disable-next-line
    }, []);
    
    return (
        <div class="Kardexproducts">
            <div className='Row'>
                <label>Ingrese el codigo del produto</label>
                <div>
                    <input type="textbox" className="npInput" placeholder="Codigo del producto" />
                </div>
                <label>Periodo:</label>
                
            </div>
        </div>
    );
};


