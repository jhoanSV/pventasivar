import './_LowInv.scss';
import React, { useEffect, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import p_json from '../../products_json_test.json'
import { useNavigate } from 'react-router-dom';
import { BoxItem } from '../../Components/Others/BoxItem';
import { AddPurchaseModal } from '../../Components';

export const LowInv = () => {
    
    const { setSection } = useTheContext();
    const navigate = useNavigate()
    const [lista, setLista] = useState();
    //const [imgSrc, setImgSrc] = useState();
    const [limit, setLimit] = useState(20);
    const [show, setShow] = useState(false);
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
                            return(
                                <BoxItem
                                    key={index+''+product.Cod}
                                    Codigo={product.Cod}
                                    Descripcion={product.Descripcion}
                                    IdFerreteria={product.IdFerreteria}
                                    showModal={(show, theImg)=><AddPurchaseModal
                                        P={product}
                                        Show={show}
                                        img={theImg}
                                    />}
                                />
                            )
                        })}                        
                    </>
                }
                <div id='obsTrigger3' style={{height: '10px'}}></div>
            </div>
        </section>
    );
}