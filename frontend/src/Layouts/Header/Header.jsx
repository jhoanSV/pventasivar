import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React from 'react';

export const Header = () => {

    const { setLogged } = useTheContext()
    
    const showSideBar = (e) =>{
        e.target.classList.add('mlh-selected')
        document.querySelector('.side-bar').classList.add('show')
    }

    const hideSideBar = () =>{
        document.querySelector('.mainLogoHead').classList.remove('mlh-selected')
        document.querySelector('.side-bar').classList.remove('show')
    }

    return (
        <section>
            <div className='headContainer'>
                <img
                    className='mainLogoHead'
                    src={require('../../Assets/icono2.png')}
                    alt='MainLogo'
                    onClick={(e)=>{showSideBar(e)}}
                />
                <div className='side-bar'>
                    <div onClick={()=>{hideSideBar()}}>
                        Equis
                    </div>
                    <div className='side-menu'>
                        <div>
                            VENTAS
                        </div>
                        <div>
                            MODULO POS
                        </div>
                        <div>
                            PRODUCTOS
                        </div>
                        <div>
                            CLIENTES
                        </div>
                        <div>
                            PROVEEDORES
                        </div>
                        <div>
                            ADMINISTRACION
                        </div>
                        <div>
                            CONFIGURACION
                        </div>
                        <div onClick={()=>{setLogged(false)}}>
                            CERRAR SESION
                        </div>
                    </div>

                </div>
                <label>Nombre de seccion o algo así</label>
                <div className='htud'>
                    usuario: usuarionombre
                </div>
            </div>            
        </section>
    );
}