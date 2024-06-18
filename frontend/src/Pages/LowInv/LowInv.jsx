import './_LowInv.scss';
import React, { useEffect, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import p_json from '../../products_json_test.json'
import { useNavigate } from 'react-router-dom';

export const LowInv = () => {
    
    const { setSection } = useTheContext();
    const navigate = useNavigate()
    const [lista, setLista] = useState();
    const [limit, setLimit] = useState(20);

    const filterByText = (item, text) =>
        item.cod.toString().includes(text) ||
        item.cod_de_barras.toLowerCase() === (text) ||
        item.descripcion.toLowerCase().includes(text);        

    const SearchHandle = (text) =>{
        let c = p_json;
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setLista(c)
            setLimit(20)
        }else{
            setLista(p_json)
            setLimit(20)
        }
    }

    const lInv_query = () =>{
        setLista(p_json)
    }    

    const observeT3 = () =>{
        const obsT = document.getElementById('obsTrigger3')
        const observer = new IntersectionObserver((entry)=>{
            if(entry[0].isIntersecting){
                setLimit(prevLim =>prevLim+10)
            }
        })
        observer.observe(obsT)
    }

    useEffect(() => {
        setSection('Bajos de inventario');
        lInv_query();
        setLimit(20);
        observeT3();
        // eslint-disable-next-line
    }, []);

    return (
        <section className='LowInv'>
            <div style={{position: 'fixed', top: '0', right: '0'}}>{limit}</div>
            <div className='backContainer'>
                <button className='btnStnd btn1' onClick={()=>{navigate(-1)}}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <div className="Row">
                <label style={{marginRight: '10px'}}>Buscar:</label>
                <input type="text" placeholder='Buscar' style={{width: '35%', marginBottom: '10px'}}
                    onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}/>
            </div>
            <div className="productsContainer">
                { lista &&
                    <>
                        {lista.slice(0,limit).map((product, index) => {
                            return (
                                <div key={index} style={{position: 'relative', width: '154px'}}>
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
                                </div>
                            );
                        })}                        
                    </>
                }
                <div id='obsTrigger3' style={{height: '10px'}}></div>
            </div>
        </section>
    );
}