import './_LowInv.scss';
import React, { useEffect, useRef, useState } from 'react';
import { useTheContext } from '../../TheProvider';
//import p_json from '../../products_json_test.json'
import { useNavigate } from 'react-router-dom';
import { BoxItem } from '../../Components/Others/BoxItem';
import { AddPurchaseModal } from '../../Components';
import { ShoppingList, Alias } from '../../api';

export const LowInv = () => {
    
    const { usD, section, setSection } = useTheContext();
    const navigate = useNavigate()
    const [lista, setLista] = useState();
    //The quantity ob boxes that its showed
    const [limit, setLimit] = useState(20);
    //const [show, setShow] = useState(false);
    const refList = useRef([]);
    const refAliasList = useRef([]);

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        //let list = refList.current;
        if (text !== ''){
            //list = list.filter((itemL)=>filterByText(itemL, text))
            filterProduct(text)
            //setLista(list);
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
        const aliasList1 = await Alias()
        refAliasList.current = aliasList1;
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

    const filterProduct = (text) => {
        //Searh the list of products that includes the text, either because it is in the "products" table or in the "alias" table  
        let proData = refList.current//The whole table "products".
        let aliasData = refAliasList.current//The whole table "alias".
        try {
            if (text === '' || text < 2) {
                setLista([]);
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
            }
        } catch (error) {
            //sortedJson2 = false
            console.log('error-->' + error);
            setLista(false)
        }
      }

    

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
                                    // Si section es "Bajos de inventario", agrega las props Inv e InvMin
                                    {...(section === 'Bajos de inventario' && {
                                        Inv: product.Inventario,
                                        InvMin: product.InvMinimo,
                                        showInv: true,
                                        Height:'215px'
                                    })}
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