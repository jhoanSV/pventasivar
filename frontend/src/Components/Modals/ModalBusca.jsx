import React, { useEffect, useState } from 'react';
import './_ModalBusca.scss';
import p_json from '../../products_json_test.json';

export const ModalBusca = () => {
    
    const [showModalBusca, setShowModalBusca] = useState(false);
    const [limit, setLimit] = useState(0);
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
            setLimit(10)
        }else{
            setLista(p_json)
            setLimit(10)
        }
    }

    const observeT2 = () =>{
        if(showModalBusca){
            const obsT = document.getElementById('obsTrigger2')
            const observer = new IntersectionObserver((entry)=>{
                if(entry[0].isIntersecting){
                    setLimit(prevLim =>prevLim+10)
                }
            })
            observer.observe(obsT)
        }
    }
        
    useEffect(() => {
        setLimit(20);
        observeT2();
        P_query();
        // eslint-disable-next-line
    }, [showModalBusca]);

    return (
        <div className='sb-container'>
            <button className='btnStnd btn1' onClick={()=>setShowModalBusca(true)}>Buscar</button>
            { showModalBusca &&
                <div className="theModalContainer">
                    <div className="theModal-content" style={{ width: '50%', height: '85%', position: 'relative' }}>
                        <div className='theModal-body' style={{height: '100%'}}>
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
                            <div className="productsContainer MB">
                                {
                                    lista.slice(0,limit).map((product, index) => {
                                        return (
                                            <div key={index} style={{position: 'relative', width: '154px'}}>
                                                <div className='caja-product'>
                                                    <div className="detailBox">
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
                                            </div>
                                        );
                                    })
                                }
                                <div id='obsTrigger2' style={{height: '10px'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
