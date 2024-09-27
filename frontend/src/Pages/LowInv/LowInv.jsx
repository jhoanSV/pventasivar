import './_LowInv.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useTheContext } from '../../TheProvider';
//import p_json from '../../products_json_test.json'
import { useNavigate } from 'react-router-dom';
import { BoxItem } from '../../Components/Others/BoxItem';
import { AddPurchaseModal } from '../../Components';
import { ShoppingList } from '../../api';

export const LowInv = () => {
    
    const { usD, section, setSection } = useTheContext();
    const navigate = useNavigate()
    const [lista, setLista] = useState();
    //const [imgSrc, setImgSrc] = useState();
    const [limit, setLimit] = useState(20);
    //const [show, setShow] = useState(false);
    const refList = useRef([]);

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        let list = refList.current;
        if (text !== ''){
            list = list.filter((itemL)=>filterByText(itemL, text))
            setLista(list);
            setLimit(20);
        }else{
            lInv_query();
            setLimit(20);
        }
    }

    const lInv_query = async() =>{
        const shppList = await ShoppingList({
            "IdFerreteria": usD.Cod,
            "Compras": section === 'Nueva Compra' ? true : section === 'Bajos de inventario' ? false : true
        })
        if(shppList){
            if(section!=='Bajos de inventario') setSection('Nueva Compra');
            const a = shppList.filter(obj => obj.SVenta === 1);
            const b = shppList.filter(obj => obj.SVenta !== 1);

            // Concatenar los arrays para tener los de SVenta: 1 primero
            const ab = [...a, ...b];
            setLista(ab);
            refList.current = ab;
            console.log(ab);
        }
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
        console.log('cambia section');
        lInv_query();
        // eslint-disable-next-line
    }, [section]);

    useEffect(() => {
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
                                    SVenta={product.SVenta}
                                    Agotado={product.Agotado}
                                    categoria={product.Categoria}
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