import React from 'react';
import "./_newcustomer.scss";

export function Newcustomer(){
    return (
        <section className='newCustomer'>
            <form>
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
                    <div className='Colmn2'>
                        <input type="checkbox" className=""/>
                        <label>Limite de credito</label>
                        <input type="text" className=""/>
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

                <button>Guardar</button>
                <button>Historial</button>
                <button>Cancelar</button>
            </form>            
        </section>
    );
}