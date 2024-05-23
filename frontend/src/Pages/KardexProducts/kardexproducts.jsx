import React, {useEffect, useState}from 'react';
import "./_kardexproducts.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
// eslint-disable-next-line
import { TableComponent } from '../../Components';
//es un json de prueba
// eslint-disable-next-line
import jsonTest from '../../jsonTest.json';


export function Kardexproducts(){

    // eslint-disable-next-line
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [selected, setSelected] = useState([]);
    // eslint-disable-next-line
    const [multiSelect, setMultiSelect] = useState(false);
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Kardex de inventario')
        // eslint-disable-next-line
    }, []);
    
    return (
        <div className="Kardexproducts">
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


