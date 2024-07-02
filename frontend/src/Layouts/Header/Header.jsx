import { Link } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React, { useEffect } from 'react';

export const Header = () => {

    const { setLogged, section } = useTheContext()
    //const [currentPage, setCurrentPage] = useState();
    
    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Format with leading zeros
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update the content of the <span> element
        document.getElementById('clock').textContent = formattedTime;
    }

    // Update time every second
    setInterval(updateTime, 1000);

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

    useEffect(() => {
        const prevS = document.querySelector('.m-selected');
        if(prevS){
            console.log(prevS);
            prevS.classList.remove('m-selected')
        }
        const s = section.replace(/\s+/g, "").toLowerCase();
        const elm = document.getElementById('mi'+(s));
        if(elm){
            elm.classList.add('m-selected');
        }
        //document.getElementById('mi'+(s)).classList.add('m-selected')
    }, [ section ]);

    return (
        <section className='headContainer'>
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
                        <Link to={'/'} id='miventas' className='genLink' onClick={(e)=>{
                            hideSideBar()
                        }}>
                            VENTAS
                        </Link>
                    </div>
                    <div>
                        <Link className='genLink' onClick={(e)=>{
                            e.target.classList.toggle('m-open')}}>
                            PRODUCTOS
                            <i className="bi bi-caret-right-fill"></i>
                        </Link>
                        <div className='subm-container'>
                            <Link to={'/ProductsList'} id='milistadodeproductos' className='genLink' onClick={()=>{
                                hideSideBar()
                            }}>
                                LISTADO
                            </Link>
                            <Link to={'/NewProduct'} id='minuevoproducto' className='genLink' onClick={()=>{
                                hideSideBar()
                            }}>
                                NUEVO
                            </Link>
                            <Link to={'/Inventory'} id='miinventario' className='genLink' onClick={()=>{
                                hideSideBar()
                            }}>
                                INVENTARIO
                            </Link>
                            <Link to={'/LowInv'} id='mibajosdeinventario' className='genLink' onClick={()=>{
                                hideSideBar()
                            }}>
                                BAJO INVENTARIO
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Link className='genLink' onClick={(e)=>{
                            e.target.classList.toggle('m-open')
                        }}>
                            CLIENTES
                            <i className="bi bi-caret-right-fill"></i>
                        </Link>
                        <div className='subm-container'>
                            <Link to={'/Customerlist'} id='milistadeclientes' className='genLink' onClick={(e)=>{
                                hideSideBar();
                            }}>
                                LISTADO
                            </Link>
                            <Link to={'/NewCustomer'} id='minuevocliente' className='genLink' onClick={(e)=>{
                                hideSideBar()
                                e.target.classList.toggle('m-selected')
                            }}>
                                NUEVO
                            </Link>
                            <Link to={'/BalanceReport'} id='mireportedesaldos' className='genLink' onClick={(e)=>{
                                hideSideBar()
                                e.target.classList.toggle('m-selected')
                            }}>
                                REPORTE DE SALDOS
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Link to={'/PurchaseList'} id='micompras' className='genLink' onClick={()=>{hideSideBar()}}>
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
                        <picture onClick={()=>{}}>
                            <source
                                type="image/avif"
                                srcSet={require('../../Assets/AVIF/LlaveSivar.avif')}
                            />
                            <img
                                width={'45px'}
                                style={{marginRight: '10px'}}
                                alt="LogoSivar"
                                decoding="async"
                            />
                        </picture>
                    </a>
                </div>
                <div id='ud' style={{display: 'flex', fontSize: '20px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <span>Elkin Clementino Zapata Lopera</span>
                    <span id='clock'></span>
                </div>
            </div>
        </section>
    );
}