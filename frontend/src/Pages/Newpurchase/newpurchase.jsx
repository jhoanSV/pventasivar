import React from 'react';
import "./_newpurchase.scss";

export function Newpurchase(){
    return (
        <div className="newpurchase">
            <section className='search-product'>
                <label>
                    Ingrese c&oacute;digo del producto:{' '}
                </label>
                <input type='text'/>
                {'  '}
                <button className='btnStnd btn1'>Agregar productos</button>
            </section>
            <section>
            </section>
        </div>
    )
}