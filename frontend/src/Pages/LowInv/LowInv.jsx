import './_LowInv.scss';
import React, { useEffect, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import p_json from '../../products_json_test.json'
import { useNavigate } from 'react-router-dom';

export const LowInv = () => {
    
    const { setSection } = useTheContext();
    const navigate = useNavigate()
    const [lista, setLista] = useState();
    //const [imgSrc, setImgSrc] = useState();
    const [limit, setLimit] = useState(20);
    let timeout;

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Cod_de_barras.toLowerCase() === (text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        let list = p_json;
        if (text !== ''){
            list = list.filter((itemL)=>filterByText(itemL, text))
            setLista(list)
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
            <div className='backContainer'>
                <button className='btnStnd btn1' onClick={()=>{navigate(-1)}}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <div className="Row" style={{padding: '0 40px'}}>
                <label style={{marginRight: '10px'}}>Buscar:</label>
                <input type="text" placeholder='Buscar' style={{width: '35%', marginBottom: '10px'}}
                    onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}/>
            </div>
            <div className="productsContainer">
                { lista &&
                    <>
                        {lista.slice(0,limit).map((product, index) => {
                            return (
                                <div key={index + '' + product.Cod} style={{position: 'relative', width: '154px', height: '200px'}}>
                                    <div className='caja-product'>
                                        <div className='detailBox'>
                                            <div className='MBimgContainer'>
                                                <picture>
                                                    <source
                                                        type="image/avif"
                                                        srcSet={`https://sivarwebresources.s3.amazonaws.com/AVIF/${product.Cod}.avif`}
                                                    />
                                                    <img
                                                        src={`https://sivarwebresources.s3.amazonaws.com/AVIF/${product.Cod}.avif`}
                                                        alt="imgProducto"
                                                        decoding="async"
                                                    />
                                                </picture>
                                            </div>
                                            <strong>{product.Descripcion}</strong>
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