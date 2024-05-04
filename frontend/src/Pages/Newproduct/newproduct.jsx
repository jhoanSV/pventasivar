import React, { useEffect } from 'react';
import "./_newproduct.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';

export function Newproduct(){

    const navigate = useNavigate()
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Nuevo Producto')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='Newproduct'>
            <div style={{position: 'relative'}}>
                <button className='btnStnd btn1'>Impuesto</button>
                <button className='btnStnd btn1' style={{marginLeft: '10px'}}>Paquete</button>

                <div className='Row'>
                    <div className='Colmn1'>                        
                        <label>Codigo de barras</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Producto</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='productName' type="text" name='productName'/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Se vende:</label>
                    </div>
                    <div className='Colmn2'>
                        <label>
                            <input type="radio" className="" name='unitPaq'/>
                            por unidad
                        </label>
                        <label>
                            <input type="radio" className="" name='unitPaq'/>
                            granel
                        </label>
                        <label>
                            <input type="radio" className="" name='unitPaq'/>
                            paquete/kit
                        </label>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Costo</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>% ganancia</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Precio venta</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Categoria</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                        <button className='btnStnd btn1' style={{marginLeft: '20px'}}>Nueva categoria</button>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Proveedor</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                        <button className='btnStnd btn1'
                            style={{marginLeft: '20px'}}
                            onClick={()=>{navigate('/Newsupplier');setSection('Nuevo Proveedor')}}
                        >
                            Nuevo proveedor
                        </button>
                    </div>
                </div>
                
                <div className="Row" style={{padding: '35px'}}>
                    <div className="ProImgContainer">
                        <img className="" alt='imgProduct'/>
                    </div>

                    <textarea
                        type="textbox"
                        className="npTextArea"
                        placeholder="Notas/Detalles del producto"
                    />
                </div>

                <button className='btnStnd btn1'>Guardar producto</button>

                <div className='Inv'>
                    <div className='InvLabel'>
                        <strong>Inventario</strong>
                    </div>
                    <div className="Row" style={{marginTop: '15px'}}>
                        <div className='Colmn1'>
                            <label>Inv actual</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className=""/>
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv minimo</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className=""/>
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Inv maximo</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className=""/>
                        </div>
                    </div>
                    <div className="Row">
                        <div className='Colmn1'>
                            <label>Ubicación</label>
                        </div>
                        <div className='Colmn2'>
                            <input type="text" className=""/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}