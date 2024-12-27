import React, { useEffect, useState, useRef } from 'react';
import './_ModalBusca.scss';
import { BoxItem } from '../Others/BoxItem';
import { TheAlert } from '../TheAlert';

export const ModalBusca = ({list, Alias ,click=false, sh}) => {
    
    const [showModalBusca, setShowModalBusca] = useState(false);
    const [limit, setLimit] = useState(0);
    const [lista, setLista] = useState([]);
    const refList = useRef([]);
    const refAliasList = useRef([]);

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
        refList.current = list;
        refAliasList.current = Alias;
        // eslint-disable-next-line
    }, [showModalBusca]);

    const filterProduct = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let proData = refList.current//The whole table "products".
        let aliasData = refAliasList.current//The whole table "alias".
        try {
            if (text === '' || text < 2) {
                setLista(proData);
                return []
            }else{
                console.log('ax2');
                // Define a case-insensitive text filter function
                const filterByText = (item) =>
                item.Cod.toLowerCase().includes(text) ||
                item.Descripcion.toLowerCase().includes(text);
                // Filter products based on the text
                const TFiltro1 = proData.filter(filterByText);
                // Filter aliases based on the text
                const TFiltro2 = aliasData.filter((item) => item.Alias.toLowerCase().includes(text));
                // Extract unique cod values from aliasData
                const CodAlias = [...new Set(TFiltro2.map((item) => item.Cod))];
                // Filter products based on unique cod values
                const aliasProducts = proData.filter((item) => CodAlias.includes(item.Cod));
                // Extract unique cod values from aliasProducts
                //const uniqueAliasProducts = [...new Set(aliasProducts.map((item) => item.cod))];
                // Combine the unique cod values from TFiltro1 and aliasProducts
                const filtro = [...new Set([...TFiltro1, ...aliasProducts])];
                // Convert the json into an array of objects to reorder by score
                const dataArray = filtro.map((value, key) => ({ key, ...value }));
                // Order the array deppending on the score
                dataArray.sort((a, b) => b.Score - a.Scote);
                // Convert the array into a json object
                //!const sortedJson = JSON.stringify(dataArray);
                //sortedJson2 = sortedJson
                setLista(dataArray)
                //setFilteredProducts(sortedJson);
                console.log('dataArray: ', dataArray)
                return dataArray;
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setLista([])
        }
    }

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
                                onChange={(e)=>{filterProduct(e.target.value.toLowerCase())}}
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
                                                categoria={product.Categoria}
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
