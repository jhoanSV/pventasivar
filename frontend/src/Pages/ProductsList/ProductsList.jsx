import React, { useEffect, useState } from 'react';
import "./_ProductsList.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
//es un json de prueba
import jsonTest from '../../products_json_test.json';
import { ModalBusca } from '../../Components/Modals/ModalBusca';

export const ProductsList = () => {

    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);
    const [contentList, setContentList] = useState(jsonTest);
    //const [multiSelect, setMultiSelect] = useState(false);//* De momento se omite esto
    const { setSection, setSomeData} = useTheContext();

    const verFunction = () =>{
        //navigate('/NewProduct', { state: selected[0]})        
        setSomeData({...selected[0]})
        navigate('/NewProduct')
    }

    const filterByText = (item, text) =>
        item.cod.toString().includes(text) ||
        item.cod_de_barras.toLowerCase() === (text) ||
        item.descripcion.toLowerCase().includes(text);        

    const SearchHandle = (text) =>{
        let c = jsonTest;
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setContentList(c)
        }else{
            setContentList(jsonTest)
        }
    }

    const Test1 = (i) =>{
        return(
            <>
                {i['item']['cod'] &&
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
            key: 'cod',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Cod de barras',
            key: 'cod_de_barras',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Categoria',
            key: 'categoria',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'P. Costo',
            key: 'pcosto',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'P. Venta',
            key: 'pventa',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Pre Compra',
            key: 'pre_compra',
            defaultWidth: '0px',
            type: 'other',
        }
    ]

    useEffect(() => {
        setSomeData(null)
        setSection('Listado de productos')
        // eslint-disable-next-line
    }, []);

    return (
        <section className="Productslist">
            <div className='plfdiv'>{/*product list first div*/}
                <div>
                    <label>Buscar:</label>
                    <input type="text" placeholder='Buscar'
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                     />
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newproduct')}}
                    >
                        Nuevo producto
                    </button>
                    <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Inventory');setSection('Inventario')}}
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