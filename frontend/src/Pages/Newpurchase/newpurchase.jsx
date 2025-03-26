import React, { useEffect } from 'react';
import "./_newpurchase.scss";
import { useTheContext } from '../../TheProvider';

export function Newpurchase(){

    //const navigate = useNavigate()
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Nueva Venta')

        // eslint-disable-next-line
    }, []);

    return (
        <div className="newpurchase">
            <section className='search-product'>
                <label>
                    Ingrese c&oacute;digo del producto:{' '}
                </label>
                <input id='NPinput' type='text'/>
                {'  '}
                <button className='btnStnd btn1'>Agregar productos</button>
            </section>
            <section>
            </section>
        </div>
    )
}