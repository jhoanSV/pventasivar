import React, { useEffect } from 'react';
import "./_InvAdjustment.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';

export function InvAdjustment(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();
    
    useEffect(() => {
        setSection('Ajustes de inventario')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='InvAdjustment'>
            <h1>Nombre del producto</h1>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Cantidad actual:</label>
                </div>
                <div className='Colmn 2'>
                    <label>cantidad</label>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>+/-:</label>
                </div>
                <div className='Colmn2'>
                    <input type="text" id="i-menos-mas" name="i-menos-mas"></input>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Nueva cantidad:</label>
                </div>
                <div className='Colmn2'>
                    <input type="text" id="i-nueva-cantidad" name="i-nueva-cantidad"></input>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Costo:</label>
                </div>
                <div className='Colmn2'>
                    <input type="text" id="i-costo" name="i-costo"></input>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Porcentaje:</label>
                </div>
                <div className='Colmn2'>
                    <input type="text" id="i-porcentaje" name="i-porcentaje"></input>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Precio venta:</label>
                </div>
                <div className='Colmn2'>
                    <input type="text" id="i-p-venta" name="i-p-venta"></input>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Precio venta:</label>
                </div>
                <div className='Colmn2'>
                    <textarea
                        type="textbox"
                        className="npTextArea"
                        placeholder="Notas/Detalles del producto"
                    />
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Responsable:</label>
                </div>
                <div className='Colmn2'>
                    <label>bla</label>
                </div>
            </div>
            <button
                className='btnStnd btn1'
                onClick={()=>{navigate('/Inventory')}}
                >Modificar inventario</button>
        </section>
    )
}