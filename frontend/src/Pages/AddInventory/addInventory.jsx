import React, { useEffect } from 'react';
import "./_addInventory.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput } from '../../Components/InputComponent/TheInput';

export function AddInventory(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();
    
    useEffect(() => {
        setSection('Agregar al inventario')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='InvAdjustment'>
            <div classname="Row">
                <label>Buscar:</label>
                <input type="text" placeholder='Buscar'/>
                <button
                    className='btnStnd btn1'
                    onClick={()=>{navigate('/Inventory')}}
                    >Buscar</button>
            </div>
            <h1>Nombre del producto</h1>
            <h2>Cod del producto</h2>

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
                    <label>Agregar:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput numType='nat'>
                    </TheInput>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Costo:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput numType='real'>
                    </TheInput>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Precio venta:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput numType='real'>
                    </TheInput>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Proveedor:</label>
                </div>
                <div className='Colmn2'>
                    <input
                        type="text"
                        id="i-proovedor"
                        name="i-proveedor"></input>
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
                >Agregar</button>
            <button
                className='btnStnd btn1'
                onClick={()=>{navigate('/Inventory')}}
                >Cancelar</button>
            <button
                className='btnStnd btn1'
                onClick={()=>{navigate('/Inventory')}}
                >Crear un producto nuevo</button>
        </section>
    )
}