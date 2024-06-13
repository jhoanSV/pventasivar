import './_LowInv.scss';
import React, { useEffect, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import p_json from '../../products_json_test.json'

export const LowInv = () => {
    
    const { setSection } = useTheContext();
    const [lista, setLista] = useState();
    // eslint-disable-next-line
    const [limit, setLimit] = useState(20);

    const lInv_query = () =>{
        setLista(p_json)
    }    

    useEffect(() => {
        setSection('Bajos de inventario');
        lInv_query();

        // eslint-disable-next-line
    }, []);

    return (
        <section className='LowInv'>
            <div className='backContainer'>
                <button className='btnStnd btn1'>
                    <i className="bi bi-caret-left-square-fill"></i>
                </button>
            </div>
            <div className="Row">
                <label style={{marginRight: '10px'}}>Buscar:</label>
                <input type="text" placeholder='Buscar' style={{width: '35%', marginBottom: '10px'}}/>
            </div>
            <div className="productsContainer">
                { lista &&
                    lista.slice(0,limit).map((product, index) => {
                        return (
                            <div className='caja-product'>
                                <div className='detailBox' key={index}>
                                    <div className='MBimgContainer'>
                                        <picture>
                                            {/* {<source
                                                type="image/avif"
                                                //srcSet={imgSrc}
                                            />} */}
                                            <img
                                                //src='https://random-image-pepebigotes.vercel.app/api/random-image'
                                                src='https://picsum.photos/200/300'
                                                alt="imgProducto"
                                                decoding="async"
                                            />
                                        </picture>
                                    </div>
                                    <strong>{product.descripcion}</strong>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
}