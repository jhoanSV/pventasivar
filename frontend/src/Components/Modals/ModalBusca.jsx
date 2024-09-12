import React, { useEffect, useState } from 'react';
import './_ModalBusca.scss';
import p_json from '../../products_json_test.json';
import { BoxItem } from '../Others/BoxItem';
import { AddPurchaseModal } from './AddPurchaseModal';

export const ModalBusca = ({list, click=false, sh}) => {
    
    const [showModalBusca, setShowModalBusca] = useState(false);
    const [limit, setLimit] = useState(0);
    const [lista, setLista] = useState([]);

    /*const P_query = () =>{
        setLista(p_json)
    }*/

    const clickFunct = (item) =>{
        (Number(item.Inventario)!==0 && click) ? click(item) : alert('No hay invetario suficiente')
        setShowModalBusca(false)
    }

    /*const filterByText = (item, text) =>
        item.Cod.toString().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        let c = [...lista];
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setLista(c)
            setLimit(10)
        }else{
            setLista(p_json)
            setLimit(10)
        }
    }*/

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
        //P_query();
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
