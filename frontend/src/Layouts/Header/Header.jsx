import { Link } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import './_Header.scss';
import React, { useEffect, useRef, useState } from 'react';
import { TheAlert } from '../../Components';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif';
import LogoPredeterminado from '../../Assets/AVIF/LogoPredeterminado.avif';

export const Header = () => {

    const { setLogged, section, setSection, usD, setSomeData, nItemsCart } = useTheContext()
    const divSideBarRef = useRef(null);
    const [img, setImg] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIFLOGOS/${usD.Cod}.avif`);
    //const [currentPage, setCurrentPage] = useState();
    
    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Format with leading zeros
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update the content of the <span> element
        try {
            document.getElementById('clock').textContent = formattedTime;
        } catch (error) {
            clearInterval(Interval)
        }
    }

    // Update time every second
    const Interval = setInterval(updateTime, 1000);

    const showSideBar = (e) =>{
        e.target.classList.add('mlh-selected');
        document.querySelector('.side-bar-container').classList.add('show');
        document.getElementById('lgId2').classList.add('show');
        document.body.classList.add('side-bar-showed');
    }

    const hideSideBar = () =>{
        document.querySelector('.mainLogoHead').classList.remove('mlh-selected');
        document.querySelector('.side-bar-container').classList.remove('show');
        document.getElementById('lgId2').classList.remove('show');
        document.body.classList.remove('side-bar-showed');
    }

    const handleClickOutside = (event) => {
        if (divSideBarRef.current &&
            !divSideBarRef.current.contains(event.target) &&
            document.querySelector('.side-bar-container').classList.contains('show')) {
          hideSideBar();
        }
    };

    const handleCloseSesion = async() => {
        if(await TheAlert('¿Desea cerrar sesión?', 1)){
            document.getElementById('sbarcID').removeEventListener('mousedown', handleClickOutside);
            setLogged(false);
        }
    }

    useEffect(() => {
        const prevS = document.querySelector('.m-selected');
        if(prevS){
            prevS.classList.remove('m-selected')
        }
        const s = section.replace(/\s+/g, "").toLowerCase();
        const elm = document.getElementById('mi'+(s));
        if(s==='configuración'){
            document.getElementById('miconfig').classList.add('m-selected');
        }else if(elm){
            elm.classList.add('m-selected');
        }
        //document.getElementById('mi'+(s)).classList.add('m-selected')
    }, [ section ]);

    useEffect(() => {
        document.getElementById('sbarcID').addEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line
    }, []);

    return (
        <section className='headContainer'>
            <img
                id='lgId'
                className='mainLogoHead'
                src={img}
                onError={()=>{setImg(LogoPredeterminado)}}
                alt='MainLogo'
                onClick={(e)=>{showSideBar(e)}}
                />
                {/*require('../../Assets/PNG/icono2.png')}*/}
            <div className='side-bar-container' id='sbarcID'>
                <div className='side-bar' ref={divSideBarRef}>
                    <div onClick={()=>{hideSideBar()}} className='equis'>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <img
                        id='lgId2'
                        className='Ins-mlh'
                        src={img}
                        onError={()=>{setImg(LogoPredeterminado)}}
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
                                e.currentTarget.classList.toggle('m-open')}}>
                                PRODUCTOS
                                <i className="bi bi-caret-right-fill"></i>
                            </Link>
                            <div className='subm-container'>
                                <Link to={'/ProductsList'} id='milistadodeproductos' className='genLink' onClick={()=>{
                                    hideSideBar()
                                }}>
                                    Listado
                                </Link>
                                <Link to={'/NewProduct'} id='minuevoproducto' className='genLink' onClick={()=>{
                                    setSomeData(null)
                                    hideSideBar()
                                    setSection('Nuevo Producto')
                                }}>
                                    Nuevo
                                </Link>
                                <Link to={'/Inventory'} id='miinventario' className='genLink' onClick={()=>{
                                    hideSideBar()
                                }}>
                                    Inventario
                                </Link>
                                <Link to={'/LowInv'} id='mibajosdeinventario' className='genLink' onClick={()=>{
                                    hideSideBar();
                                    setSection('Bajos de inventario');
                                }}>
                                    Bajo inventario
                                </Link>
                            </div>
                        </div>
                        <div>
                            <Link className='genLink' onClick={(e)=>{
                                e.currentTarget.classList.toggle('m-open')
                            }}>
                                CLIENTES
                                <i className="bi bi-caret-right-fill"></i>
                            </Link>
                            <div className='subm-container'>
                                <Link to={'/Customerlist'} id='milistadeclientes' className='genLink' onClick={(e)=>{
                                    hideSideBar();
                                }}>
                                    Listado
                                </Link>
                                <Link to={'/NewCustomer'} id='minuevocliente' className='genLink' onClick={(e)=>{
                                    setSomeData(null)
                                    hideSideBar()
                                }}>
                                    Nuevo
                                </Link>
                                {/* {<Link to={'/BalanceReport'} id='mireportedesaldos' className='genLink' onClick={(e)=>{
                                    hideSideBar()
                                }}>
                                    REPORTE DE SALDOS
                                </Link>} //?Para despues */}
                            </div>
                        </div>
                        <div>
                            <Link to={'/PurchaseList'} id='micompras' className='genLink' onClick={()=>{hideSideBar()}}>
                                COMPRAS
                            </Link>
                        </div>
                        <div>
                            <Link className='genLink' onClick={(e)=>{e.currentTarget.classList.toggle('m-open')}}>
                                ADMINISTRACION
                                <i className="bi bi-caret-right-fill"></i>
                            </Link>
                            <div className='subm-container'>
                                <Link to={'/CashReconciliation'} id='milistadeclientes' className='genLink' onClick={(e)=>{
                                    hideSideBar();
                                    setSection('CORTE DEL DÍA')
                                }}>
                                    Corte del día
                                </Link>
                                <Link to={'/Studies'} id='milistadeclientes' className='genLink' onClick={(e)=>{
                                    hideSideBar();
                                    setSection('ESTUDIOS')
                                }}>
                                    Estudios
                                </Link>
                            </div>                            
                        </div>
                        <div>
                            <Link to={'/Config'} id='miconfig' className='genLink' onClick={()=>{hideSideBar()}}>
                                CONFIGURACION
                            </Link>                            
                        </div>
                        <div onClick={()=>{handleCloseSesion()}} className='clsBtn'>
                            CERRAR SESION
                        </div>
                    </div>
                </div>

            </div>
            <label>{section}</label>
            <div className='htud'>
                <div className='wapphtud' style={{marginRight: '12px', lineHeight: '1'}}>
                    <div className="text">
                        ¿Necesitas ayuda?
                    </div>
                    <i className='bi bi-whatsapp' onClick={()=>{window.electron.openExternalLink('https://api.whatsapp.com/send/?phone=573134237538&text&type=phone_number&app_absent=0')}}
                    />
                </div>
                <div className='fdhtud' style={{marginRight: '12px'}}>
                    <Link to="/Cart" type="button" className='btnCart'>
                        <i className="bi bi-cart4"></i>
                        
                        { (nItemsCart !== 0) &&
                            <span className='floatingNumber'>{nItemsCart}</span>
                        }
                    </Link>
                </div>
                <div>
                    <Link to={'/LowInv'} onClick={()=>{
                        hideSideBar();
                        setSection('Nueva Compra');
                    }}>
                        <picture>
                            <source
                                type="image/avif"
                                srcSet={require('../../Assets/AVIF/LlaveSivar.avif')}
                            />
                            <img
                                width={'45px'}
                                style={{marginRight: '10px', marginTop: '-20px'}}
                                alt="LogoSivar"
                                decoding="async"
                            />
                        </picture>
                    </Link>
                </div>
                <div id='ud' style={{display: 'flex', fontSize: '20px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <span>{usD.Contacto}</span>
                    <span id='clock'></span>
                </div>
            </div>
        </section>
    );
}