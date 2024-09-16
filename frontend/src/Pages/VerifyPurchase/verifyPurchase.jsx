import React, { useEffect, useState, useRef } from 'react';
import "./_verifyPurchase.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { Flatlist, TheAlert } from '../../Components';
import { ChangePurchasePro } from '../../Components/Modals/ChangePurchasePro';
//es un json de prueba
import { AddPurchase, PurchaseDetail, UpdateVefiedPurchase } from '../../api';

export function VerifyPurchase(){

    const navigate = useNavigate()
    const [order, setOrder] = useState([]);
    const [total, setTotal] = useState(0);
    const [showModalChangeprice, setShowModalChangeprice] = useState(false);
    const [selectedfila, setSelectedfila] = useState(0);
    const selectedfilaRef = useRef(selectedfila);
    const dataSelected = useRef();
    const { setSection, someData, usD } = useTheContext();
    
    /*const deselect = () =>{ //* Deseleccionar por si algo
        setSelected([])
    };*/

    const ctHeaders = [
        {
            header: 'Cantidad',
            key: 'Cantidad',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: '131px',
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Descripcion',
            defaultWidth: '300px',
            type: 'text',
        },
        {
            header: 'Vr. Unitario',
            key: 'PCosto',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Diferencia',
            key: 'diferencia',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Total',
            key: 'total',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Inventario',
            key: 'Inventario',
            defaultWidth: '223px',
            type: 'text',
        }
    ];
    if(someData.Estado === 'Por ingresar')ctHeaders.push({
        header: 'verificado',
        key: 'Verificado',
        defaultWidth: '223px',
        type: 'text',
    });

    const handleKeyDown = (event) => {
        if (order.length !== 0) {
            const currentSelectedFila = selectedfilaRef.current;
            if (event.key === 'ArrowDown' && currentSelectedFila + 1 >= 0 && currentSelectedFila + 1 < order.length) {
                setSelectedfila(currentSelectedFila + 1)
            } else if (event.key === 'ArrowUp' && currentSelectedFila - 1 >= 0 && currentSelectedFila - 1 < order.length) {
                setSelectedfila(currentSelectedFila - 1)
            }
        }
    };

    const row = (item, isSelected, columnsWidth) => {
        const comparator = (value1, value2) => {
            if(value2 === null){
                return <div className='comparatorContainer'><i className="bi bi-stars"></i></div>
            }
            if (value1>value2){
                return <div className='comparatorContainer'><i className="bi bi-caret-up-fill" style={{color: 'red'}}></i></div>
            } else if (value1<value2){
                return <div className='comparatorContainer'><i className="bi bi-caret-down-fill" style={{color: 'green'}}></i></div>
            } else {
                return <div className='comparatorContainer'><label>=</label></div>
            }
        }
        const handleChekedvp = async(e) => {
            console.log(order[isSelected]);
            if(order[isSelected].PVenta !== null || e.target.checked === false){
                const res = await UpdateVefiedPurchase({
                    "Verificado": (e.target.checked),
                    "IdFerreteria": 242,
                    "NPreFactura": 10725,
                    "Cod" : item.Cod
                });
                console.log(res);
            }else{
                e.target.checked = false;
                TheAlert('El precio de venta de "' + order[isSelected].Descripcion + '" no puede estar vacío ');
            }
        }
        return (
            <>
                <td style={{width: columnsWidth[0]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Cantidad}</label>
                </td>
                <td style={{width: columnsWidth[1]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Cod}</label>
                </td>
                <td style={{width: columnsWidth[2]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Descripcion}</label>
                </td>
                <td style={{width: columnsWidth[3]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.PCosto)}</label>
                </td>
                <td style={{width: columnsWidth[4], alignItems: 'center' }}>
                    {comparator(item.PCosto, item.PCostoLP)}
                </td>
                <td style={{width: columnsWidth[5]}}>
                    <label className={isSelected ? 'selected-label' : ''}>$ {Formater(item.PCosto * item.Cantidad)}</label>
                </td>
                <td style={{width: columnsWidth[6]}}>
                    <label className={isSelected ? 'selected-label' : ''}>{item.Inventario}</label>
                </td>
                {someData.Estado === 'Por ingresar' &&
                    <td style={{width: columnsWidth[7]}}>
                        <input
                            id={`id${item.Cod}`}
                            type="checkbox"
                            defaultChecked={item.Verificado}
                            onChange={(e)=>{handleChekedvp(e)}}
                            />
                    </td>
                }
            </>
        )
    }

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const totalSum = () => {
        let suma = 0;
        order.map((item, index) => (
            suma += item.Cantidad * item.PCosto
        ))
        setTotal(suma)
    }

    const fetchOrderData = async() =>{
        console.log('Estado: '+someData.Estado);
        const orderDetail = await PurchaseDetail({
            "IdFerreteria": usD.Cod,
            "Consecutivo": someData.Consecutivo,
            "NPreFactura" : someData.NPreFactura,
            "Estado" : someData.Estado
        });
        console.log(orderDetail);
        if(orderDetail){
            setOrder(orderDetail)
        }
    }

    const verifyProduct = () =>{
        setShowModalChangeprice(true);
        dataSelected.current = order[selectedfila];
    }

    const recepcionar = async() =>{
        const allVerified = order.every(item => item.Verificado === 1);
        if(allVerified){
            const theOrder = order.map(item => ({
                "ConsecutivoProd" : item.ConsecutivoProd,
                "Cantidad": item.Cantidad,
                "Cod": item.Cod,
                "Descripcion": item.Descripcion,
                "PCosto": item.PCosto,
                "PCostoLP": item.PCostoLP,//*Precio anterior a la factura (PCosto)
                "PVenta": item.PVenta,
                "Iva": item.Iva
            }));
            const fecha = new Date()
            const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds()
            console.log({
                "IdFerreteria": usD.Cod,
                "Fecha": today,
                "CodResponsable": usD.Cod,
                "Responsable": usD.Contacto,
                "Consecutivo": someData.Consecutivo,
                "Order": theOrder,
            });
            const res = await AddPurchase({
                "IdFerreteria": usD.Cod,
                "Fecha": today,
                "CodResponsable": usD.Cod,
                "Responsable": usD.Contacto,
                "Consecutivo": someData.Consecutivo,
                "Order": theOrder,
            });
            console.log(res);
            if(res && res.message === 'Transacción completada con éxito'){
                TheAlert('Producto recepcionado con éxito');
                navigate(-1);
            } else {
                TheAlert('Ocurrió un error inesperado al recepcionar pedido');
            }
        } else {
            TheAlert('Todos los productos deben estar verificados');
        }
    }
    
    useEffect(() => {
        selectedfilaRef.current = selectedfila;
    }, [selectedfila]);

    useEffect(() => {
        console.log(dataSelected.current);        
    }, [dataSelected]);

    useEffect(() => {
        totalSum();
        // eslint-disable-next-line
    }, [order]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        setSection('Verificar compra');
        fetchOrderData();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <section className="ShoppingList">
            <div className='Titles'>
                <h2>Factura</h2>
                <h2>{someData.NPreFactura}</h2>
            </div>
            <div className='Row'>
                <button className='btn1Stnd' onClick={()=>(verifyProduct())}
                    disabled={(selectedfila.length === 0)}>
                    <i className='bi bi-eye-fill'/>
                </button>
                {someData.Estado === 'Por ingresar' ?
                    <label>Modificar</label>
                :
                    <label>Detalles</label>
                }
            </div>
            <div className='Table'>
                <Flatlist
                    data={order}
                    row={row}
                    headers={ctHeaders}
                    selectedRow={selectedfila}
                    setSelectedRow={setSelectedfila}
                    doubleClick={()=>{verifyProduct()}}
                />
            </div>
            <div style={{marginTop: '10px'}}>
                {someData.Estado === 'Por ingresar' &&
                    <button className='btnStnd btn1'
                        style={{marginRight: '20px'}}
                        onClick={()=>{someData.Estado === 'Por ingresar' && recepcionar()}}>
                            Recepcionar pedido
                    </button>
                }
                <button className='btnStnd btn1'
                    onClick={()=>{navigate(-1)}}
                    >
                        cancelar
                </button>
            </div>
            <div className='Finantialdata'>
                <div className="Row">
                    <div className='column'>
                        <label style={{fontWeight: 600}}>N° pre-factura:</label>
                    </div>
                    <div className='column'>
                        <label>000000</label>
                    </div>
                </div>
                <div className="Row">
                    <div className='column'>
                        <label style={{fontWeight: 600}}>Utilidad:</label>
                    </div>
                    <div className='column'>
                        <label>$ {Formater(total)}</label>
                    </div>
                </div>
            </div>
            {showModalChangeprice && <ChangePurchasePro data={dataSelected.current} show={setShowModalChangeprice} width='450px' height='400px'/>}
        </section>
    )
}