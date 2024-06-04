import React, { useEffect, useState } from 'react';
import './_ModalBusca.scss';
import p_json from '../../products_json_test.json';

export const ModalBusca = () => {
    
    const [showModalBusca, setShowModalBusca] = useState(false);
    // eslint-disable-next-line
    const [limit, setLimit] = useState(5);
    const [lista, setLista] = useState();

    const P_query = () =>{
        setLista(p_json)
    }

    const filterByText = (item, text) =>
        item.cod.toString().includes(text) ||
        item.cod_de_barras.toLowerCase() === (text) ||
        item.descripcion.toLowerCase().includes(text);        

    const SearchHandle = (text) =>{
        let c = p_json;
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setLista(c)
        }else{
            setLista(p_json)
        }
    }

    useEffect(() => {
        P_query()
        // eslint-disable-next-line
    }, []);

    return (
        <div className='sb-container'>
            <button className='btnStnd btn1' onClick={()=>setShowModalBusca(true)}>Buscar</button>
            { showModalBusca &&
                <div className="theModalContainer">
                    <div className="theModal-content" style={{ width: '50%', height: '76%', position: 'relative' }}>
                        <div className='theModal-body scrollable'>
                            <button
                                className='btn1Stnd'
                                onClick={() => {setShowModalBusca(false)}}
                                style={{position: 'absolute', right: '0', top: '0'}}>
                                <i className='bi bi-x-lg'/>
                            </button>
                            <input
                                type='text'
                                placeholder='Buscar'
                                onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                            />
                            <div className="productsContainer">
                                {
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
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
