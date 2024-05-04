import { Link } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React from 'react';

export const Header = () => {

    const { setLogged, section } = useTheContext()
    
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
                    <div onClick={()=>{hideSideBar()}} className='equis'>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <div className='side-menu'>
                        <div>
                            <Link to={'/'} className='genLink'>
                                VENTAS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                MODULO POS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                PRODUCTOS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                CLIENTES
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                PROVEEDORES
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                ADMINISTRACION
                            </Link>                            
                        </div>
                        <div>
                            <Link to={'/'} className='genLink'>
                                CONFIGURACION
                            </Link>                            
                        </div>
                        <div onClick={()=>{setLogged(false)}} className='clsBtn'>
                            CERRAR SESION
                        </div>
                    </div>

                </div>
                <label>{section}</label>
                <div className='htud'>
                    usuario: usuarionombre
                </div>
            </div>            
        </section>
    );
}