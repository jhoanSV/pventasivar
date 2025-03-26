import React, { useEffect, useState } from 'react';
import './_ModalBusca.scss';
import { BoxItem } from '../Others/BoxItem';
import { TheAlert } from '../TheAlert';

export const ModalBusca = ({list, click=false, sh}) => {
    
    const [showModalBusca, setShowModalBusca] = useState(false);
    const [limit, setLimit] = useState(0);
    const [lista, setLista] = useState([]);

    const clickFunct = async(item) =>{
        (Number(item.Inventario)!==0 && click) ? click(item) : await TheAlert('No hay inventario suficiente');
        setShowModalBusca(false);
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
        setLista(list);
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
                                onChange={(e)=>{sh((e.target.value).toLowerCase(), setLista)}}
                            />
                            <div className="productsContainer MB">
                                {
                                    lista.slice(0,limit).map((product, index) => {
                                        return (
                                            <BoxItem
                                                key={index+''+product.Cod}
                                                Codigo={product.Cod}
                                                Descripcion={product.Descripcion}
                                                Agotado={product.Agotado}
                                                simpleFunct={()=>clickFunct(product)}
                                            />
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
