import { Link } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React from 'react';

export const Header = () => {

    const { setLogged, section } = useTheContext()
    
    const showSideBar = (e) =>{
        e.target.classList.add('mlh-selected')
        document.querySelector('.side-bar').classList.add('show')
        document.getElementById('lgId2').classList.add('show')
    }

    const hideSideBar = () =>{
        document.querySelector('.mainLogoHead').classList.remove('mlh-selected')
        document.querySelector('.side-bar').classList.remove('show')
        document.getElementById('lgId2').classList.remove('show')
    }

    return (
        <section>
            <div className='headContainer'>
                <img
                    id='lgId'
                    className='mainLogoHead'
                    src={require('../../Assets/icono2.png')}
                    alt='MainLogo'
                    onClick={(e)=>{showSideBar(e)}}
                />
                <div className='side-bar'>
                    <div onClick={()=>{hideSideBar()}} className='equis'>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <img
                        id='lgId2'
                        className='Ins-mlh'
                        src={require('../../Assets/icono2.png')}
                        alt='MainLogo'
                        onClick={()=>{hideSideBar()}}
                    />
                    <div className='side-menu'>
                        <div>
                            <Link to={'/'} className='genLink' onClick={()=>{hideSideBar()}}>
                                VENTAS
                            </Link>
                        </div>
                        <div>
                            <Link to={'/ProductsList'} className='genLink' onClick={()=>{hideSideBar()}}>
                                PRODUCTOS
                            </Link>
                        </div>
                        <div>
                            <Link className='genLink' onClick={(e)=>{
                                e.target.classList.toggle('m-selected')
                            }}>
                                CLIENTES
                            </Link>
                            <div className='subm-container'>
                                <Link to={'/Customerlist'} className='genLink' onClick={(e)=>{
                                    hideSideBar();
                                    e.target.classList.toggle('m-selected');
                                }}>
                                    LISTADO
                                </Link>
                                <Link to={'/BalanceReport'} className='genLink' onClick={(e)=>{
                                    hideSideBar()
                                    e.target.classList.toggle('m-selected')
                                }}>
                                    REPORTE DE SALDOS
                                </Link>
                                <Link to={'/NewCustomer'} className='genLink' onClick={(e)=>{
                                    hideSideBar()
                                    e.target.classList.toggle('m-selected')
                                }}>
                                    NUEVO
                                </Link>
                            </div>
                        </div>
                        <div>
                            <Link to={'/PurchaseList'} className='genLink' onClick={()=>{hideSideBar()}}>
                                COMPRAS
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
                    <div>
                        <a href="https://sivar.com.co" target="_blank" rel="noreferrer">
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={require('../../Assets/AVIF/LlaveSivar.avif')}
                                />
                                <img
                                    width='72px'
                                    height={'72px'}                                    
                                    alt="LogoSivar"
                                    decoding="async"
                                />
                            </picture>
                        </a>
                    </div>
                    usuario: usuarionombre
                </div>
            </div>            
        </section>
    );
}