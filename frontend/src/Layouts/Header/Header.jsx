import { Link } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React, { useEffect, useRef } from 'react';

export const Header = () => {

    const { setLogged, section } = useTheContext()
    const sideBarRef = useRef(null);
    const contentRef = useRef(null);
    
    const showSideBar = (e) =>{
        e.scrollTop = 0
        e.target.classList.add('mlh-selected')
        document.querySelector('.side-bar').classList.add('show')
        sideBarRef.current.scrollTop = 0
    }

    const hideSideBar = () =>{
        document.querySelector('.mainLogoHead').classList.remove('mlh-selected')
        document.querySelector('.side-bar').classList.remove('show')
        document.getElementById('lgId').removeAttribute('style')
    }


    useEffect(() => {
        const sideBar = sideBarRef.current;
        const content = contentRef.current;
        
        // *Verify if the content is larger than the side-bar
        if (content.scrollHeight > sideBar.clientHeight) {
            // *Add an event listener to the scroll event
            sideBar.addEventListener('scroll', handleScroll);
        }
        
        // *On dismount remove the event listener
        return () => {
            if (content.scrollHeight > sideBar.clientHeight) {
                sideBar.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleScroll = (event) => {
        // *Get the scroll value
        const theScroll = event.target.scrollTop;
        const theImg = document.getElementById('lgId')
        //theImg.style.width = ((250) - (250*((theScroll)/125))) + 'px'
        theImg.style.width = ((250) - theScroll) + 'px'
    };

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
                <div className='side-bar' ref={sideBarRef}>
                    <div onClick={()=>{hideSideBar()}} className='equis'>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <div className='side-menu' ref={contentRef}>
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
                                <Link to={'/Customerlist'} className='genLink' onClick={(e)=>{
                                    hideSideBar()
                                    e.target.classList.toggle('m-selected')
                                }}>
                                    REPORTE DE SALDOS
                                </Link>
                            </div>
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