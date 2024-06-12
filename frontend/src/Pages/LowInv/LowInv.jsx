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
        <section>
            <div className="productsContainer">
                { lista &&
                    lista.slice(0,limit).map((product, index) => {
                        return (
                            <div className='caja-product' key={index}>
                                <div className='MBimgContainer'>
                                    <picture>
                                        {/* {<source
                                            type="image/avif"
                                            //srcSet={imgSrc}
                                        />} */}
                                        <img
                                            src='https://random-image-pepebigotes.vercel.app/api/random-image'
                                            alt="imgProducto"
                                            decoding="async"
                                        />
                                    </picture>
                                </div>
                                <strong>{product.descripcion}</strong>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
}