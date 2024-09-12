import React, { useEffect, useRef, useState } from 'react';
import "./_inventory.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TableComponent } from '../../Components';
import { Inventory as ListInv } from '../../api';
import { Formater } from '../../App';

export function Inventory(){

    const navigate = useNavigate()
    const [invList, setInvList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [inventoryCost, setInventoryCost] = useState(0);
    const refList = useRef([]);
    //const [multiSelect, setMultiSelect] = useState(false);
    const { setSection, usD, setSomeData } = useTheContext();

    const InvHeaders = [
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
            header: 'Costo',
            key: 'PCosto',
            defaultWidth: '223px',
            type: 'coin',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'Precio venta',
            key: 'PVenta',
            defaultWidth: '0px',
            type: 'coin',
        },
        {
            header: 'Existencia',
            key: 'Inventario',
            defaultWidth: '0px',
            type: 'formater',
        },
        {
            header: 'Inv. minimo',
            key: 'InvMinimo',
            defaultWidth: '0px',
            type: 'formater',
        },
        {
            header: 'Inv. maximo',
            key: 'InvMaximo',
            defaultWidth: '0px',
            type: 'formater',
        }
    ]

    const filterByText = (item, text) =>
        item.Cod.toString().includes(text) ||
        item.Descripcion.toLowerCase().includes(text);

    const SearchHandle = (text) =>{
        let c = refList.current;
        if (text !== ''){
            //c = c.filter((i)=>filterByText(i, text))
            setInvList(c.filter((i)=>filterByText(i, text)));
        }else{
            fetchInvList();
        }
    }

    const sumInventoryCost = (theList) => {
        let suma = 0;
        if (theList && theList.length > 0) {theList.forEach((item, index) => (
            suma += item.PCosto * item.Inventario
        ))}
        setInventoryCost(suma)
    };

    const DeleteFunction = () =>{
        console.log(selected[0]);
        if(selected[0].Inventario > 0){
            alert('No se puede eliminar un producto con existencias');
        }else{
            alert('Esta característica aún no está disponible');
        }
    }

    // const deselect = () =>{
    //     setSelected([])
    //? para después}

    const verFunction = () =>{
        setSomeData({...selected[0]});
        navigate('/NewProduct');
    }

    const fetchInvList = async() =>{
        const list = await ListInv({
            "IdFerreteria": usD.Cod
        })
        console.log(list);
        if(list){
            setInvList(list);
            refList.current = list;
            sumInventoryCost(list);
        }
    }

    useEffect(() => {
        setSection('Inventario');
        fetchInvList();
        sumInventoryCost();

        // eslint-disable-next-line
    }, []);
    
    return (
        <section className="Inventory">
            <div className="Row fstR">
                <div className='costoInv'>
                    <div>
                        <label>Costo del inventario</label>
                    </div>
                    <label>$ {Formater(inventoryCost)}</label>
                </div>
                <div style={{textAlign: 'center', fontSize: '20px'}}>
                    <div style={{marginTop: '10px'}}>
                        <label>Cantidad de articulos en el inventario</label>
                    </div>
                    <label>{refList.current.length}</label>
                </div>
            </div>
            <div className="Row">
                <label style={{paddingRight: '10px'}}>Buscar:</label>
                <input 
                    type="text"
                    placeholder='Buscar'
                    style={{width: '35%'}}
                    onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                />
                <button className='btnStnd btn1'
                    style={{marginLeft: '20px'}}
                    onClick={()=>{navigate('/LowInv'); setSection('Bajos de inventario')}}
                >
                    Bajos en inventario
                </button>
            </div>
            <div className=''>
                {/* <div className='' style={{padding: '10px 140px'}}> */}
                    {/* <label>Categoria:</label> */}
                    {/* <button className='btnStnd btn1'
                        style={{marginLeft: '20px'}}
                        onClick={()=>{navigate('/Newsupplier');setSection('Nuevo Proveedor')}}
                    >
                        Actualizar varios
                    </button> */}
                {/* </div> */}
                <div className=''>
                    {/* {<button className='btn1Stnd' onClick={()=>(deselect())}
                        disabled={selected.length === 0}>
                        <i className='bi bi-x'/>
                    </button>
                    <label style={{marginRight: '8px', padding: '3px', color: selected.length === 0 ? 'rgb(183 183 183)' : 'black'}}>
                        Seleccionados: {selected.length}
                    </label>} //?Para después */}
                    <button className='btn1Stnd' onClick={()=>(verFunction())}
                        disabled={(selected.length === 0 || selected.length > 1)}
                        style={{fontSize: '22px'}}>
                        <i className='bi bi-eye-fill'/>
                    </button>
                    <button className='btn1Stnd' onClick={()=>(DeleteFunction())}
                        disabled={selected.length === 0}
                        style={{fontSize: '22px'}}>
                        <i className='bi bi-trash-fill'/>
                    </button>
                    {/*<input id='checkmlsct' type="checkbox" className="" onChange={()=>{setMultiSelect(a=>!a);setSelected([])}}/>
                    <label className='noSelect' style={{padding: '3px'}} htmlFor='checkmlsct'>
                        Seleccionar Varios
                    </label>*/}
                    {/*<label className='noSelect' style={{padding: '3px'}} htmlFor='checkmlsct'>
                        Ajuste de inventario
                    </label>*/}
                </div>
            </div>
            <div>
                <TableComponent
                    data={invList}
                    headers={InvHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    doubleClickFunct={verFunction}
                    multiSelect={false}
                />
            </div>
        </section>
    )
}