import React, { useEffect, useState } from 'react';
import "./_newcustomer.scss";
import { useTheContext } from '../../TheProvider';

export function Newcustomer(){
    
    const [conCredito, setConCredito] = useState(false);
    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Nuevo cliente')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='newCustomer'>
            <div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Tipo cliente</label>
                    </div>
                    <div className='Colmn2'>
                        <select></select>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>                        
                        <label>Nit/C.C</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text"/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Nombres</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>                        
                        <label style={{marginLeft: '10px'}}>Apellidos</label>
                        <input type="text" className="" style={{marginLeft: '20px'}}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Telefono 1/whastsapp</label>                        
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Telefono 2</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>E-mail</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Direccion</label>
                    </div>
                    <div className='Colmn2'>
                        <input type="text" className=""/>
                        <label style={{marginLeft: '10px'}}>Barrio</label>
                        <input type="text" className="" style={{marginLeft: '20px'}}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Credito</label>
                    </div>
                    <div className='Colmn2' style={{minHeight: '28px'}}>
                        <input type="checkbox" className="" onChange={()=>{setConCredito(e=>!e)}}/>
                        {conCredito &&
                            <>
                                <label style={{paddingRight: '10px'}}>Limite de credito</label>
                                <input type="text" className=""/>
                            </>
                        }
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Notas</label>
                    </div>
                    <div className='Colmn2'>
                        <textarea 
                            type="textbox"
                            className="ncTextArea"
                            placeholder="Notas/Detalles del cliente"
                        />
                    </div>
                </div>
                <div style={{marginLeft: '15.5%', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <button className='btnStnd btn1' style={{marginRight: '10px'}}>Guardar</button>
                        <button className='btnStnd btn1'>Historial</button>
                    </div>
                    <button className='btnStnd btn1'>Cancelar</button>
                </div>
            </div>
        </section>
    );
}