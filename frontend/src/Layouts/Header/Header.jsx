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
                            <Link to={'/'} className='genLink' onClick={()=>{hideSideBar()}}>
                                VENTAS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/MODULOPOS'} className='genLink' onClick={()=>{hideSideBar()}}>
                                MODULO POS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink' onClick={()=>{hideSideBar()}}>
                                PRODUCTOS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/Customerlist'} className='genLink' onClick={()=>{hideSideBar()}}>
                                CLIENTES
                            </Link>
                        </div>
                        <div>
                            <Link to={'/Supplierlist'} className='genLink' onClick={()=>{hideSideBar()}}>
                                PROVEEDORES
                            </Link>
                        </div>
                        <div>
                            <Link to={'/'} className='genLink' onClick={()=>{hideSideBar()}}>
                                ADMINISTRACION
                            </Link>                            
                        </div>
                        <div>
                            <Link to={'/'} className='genLink' onClick={()=>{hideSideBar()}}>
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