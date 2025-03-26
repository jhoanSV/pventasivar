import React, { useEffect, useRef, useState } from 'react';
import "./_ProductsList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
import { ProductList } from '../../api';
//import { LevenDistance } from '../../App';
//import { ModalBusca } from '../../Components/Modals/ModalBusca';

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), delay);
    };
};

export const ProductsList = () => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [contentList, setContentList] = useState([]);
    const refList = useRef([]);
    const debounceSearch = useRef(null);
    //const [multiSelect, setMultiSelect] = useState(false);//* De momento se omite esto
    const { setSection, setSomeData, usD, setProductCodes} = useTheContext();

    const verFunction = () =>{
        //navigate('/NewProduct', { state: selected[0]})        
        setSomeData({...selected[0]})
        navigate('/NewProduct')
    }

    const filterByText = (item, text) =>
        item.Cod.toString().toLowerCase().includes(text) ||
        item.Descripcion.toLowerCase().includes(text)/* ||
        (text.length > 3 && LevenDistance(item.Descripcion.toLowerCase(), text) < 3);*/

    const SearchHandle = (text) =>{
        let c = refList.current;
        if (text !== ''){
            //c = c.filter((i)=>filterByText(i, text))
            setContentList(c.filter((i)=>filterByText(i, text)));
        }else{
            ProductsFetch();
        }
    }

    const Test1 = (i) =>{
        return(
            <>
                {!(i['item']['IdFerreteria']) &&
                    <picture>
                        <source
                            type="image/avif"
                            srcSet={require('../../Assets/AVIF/LogoSivarB.avif')}
                        />
                        <img
                            style={{width: '100%'}}
                            alt="imgProducto"
                            decoding="async"
                        />
                    </picture>
                }
            </>
        )
    }

    const ctHeaders = [
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Descripcion',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Categoria',
            key: 'Categoria',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'P. Costo',
            key: 'PCosto',
            defaultWidth: '135.5px',
            type: 'coin',
        },
        {
            header: 'P. Venta',
            key: 'PVenta',
            defaultWidth: '135.5px',
            type: 'coin',
        },
        {
            header: 'Pre Compra',
            key: '',
            defaultWidth: '0px',
            type: 'other',
        }
    ]

    const ProductsFetch = async() =>{
        const listado = await ProductList({
            "IdFerreteria" : usD.Cod
        })
        if(listado){
            let codes = []
            setContentList(listado);
            refList.current = listado;
            for(let a in listado){
                codes.push(listado[a].Cod);
            }
            setProductCodes(codes);
        }
    }

    if (!debounceSearch.current) {
        debounceSearch.current = debounce(SearchHandle, 500);
    }

    const handleInputChange = (text) => {
        debounceSearch.current(text); // Llamamos al debounce
    };

    useEffect(() => {
        setSomeData(null)
        setSection('Listado de productos')
        ProductsFetch()
        // eslint-disable-next-line
    }, []);

    return (
        <section className="Productslist">
            <div className='plfdiv'>{/*product list first div*/}
                <div>
                    <label /*onClick={()=>{LevenDistance2('gato', 'gatitos')}}*/>Buscar:</label>
                    <input type="text" placeholder='Buscar'
                        onChange={(e)=>{handleInputChange((e.target.value).toLowerCase())}}
                     />
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newproduct')}}
                    >
                        Nuevo producto
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Inventory')}}
                    >
                        Inventario
                    </button>
                </div>
                <div className=''>
                    <button className='btn1Stnd' onClick={()=>(verFunction())} style={{fontSize: '20px'}}
                        disabled={(selected.length === 0 || selected.length > 1)}>
                        <i className='bi bi-eye-fill'/>
                    </button>
                </div>
            </div>
            {/* <ModalBusca></ModalBusca> */}
            <div>
                <TableComponent
                    data={contentList}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={false}
                    doubleClickFunct={verFunction}
                    Other={Test1}
                />
            </div>
        </section>
    )
}