import React, { useEffect, useState } from 'react';
import './_AddPurchaseModal.scss';
import { Formater } from '../../App';

export const AddPurchaseModal = ({P, Show, img}) => {

    console.log(P);
    const [catSource, setCatSource] = useState(require(`../../Assets/AVIF/LogCats/${(P.Categoria).toLowerCase()}.avif`));
    const [cant, setCant] = useState(0);
    const [totalPrice, setTotalPrice] = useState(P.PVenta*cant);
    const [tab1, setTab1] = useState('Inventario');

    let quantity = null
    
    if( P.EsUnidadOpaquete > 1 ){
        quantity = 'Paquete de ' + P.EsUnidadOpaquete + ' unidades';
    }else{
        quantity = 'Unidad';
    }

    const handleClickOutside = (event) => {
        let dmc = document.getElementById(`ModalCont${P.Cod}`);
        if (dmc && !dmc.contains(event.target)) {
            btnCart();
        }
    };

    const btnCart = () =>{
        document.body.style = '';
        Show(false);
        document.removeEventListener('mousedown', handleClickOutside);
    }

    const toggle1 = (e) =>{
        if(e.target.classList.contains('active'))return;
        const node = document.querySelector('.btn2.active');
        if(node){
            node.classList.remove('active');
            e.target.classList.add('active');
            if(tab1==='Inventario')setTab1('Descripcion')
            else setTab1('Inventario')
        }else return;
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line
    }, []);

    return (
        <div className='theModalContainer'>
            <div id={`ModalCont${P.Cod}`} className='theModal-content addPurchMo'>
                <div className='Row TMCD3'>
                    <div style={{width: '50%', paddingRight: '20px', display: 'flex', flexDirection: 'column'}}>
                        <div className={`imgModal C${P.Categoria}`}>
                            <picture>
                                { P.Agotado &&
                                    <div className='soldOutMod'>
                                        AGOTADO
                                    </div>
                                }
                                <source
                                    type="image/avif"
                                    srcSet={img}
                                />
                                <img
                                    src={img}
                                    alt="productImg"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        <div className="commingsoon">
                            {/*Para después*/}
                        </div>
                        <div style={{marginTop: 'auto'}}>
                            <div style={{display: 'flex', margin: '10px 0px', gap: '10px'}}>
                                <button className='btnStnd btn2 active'onClick={(e)=>toggle1(e)}>
                                    Inventario
                                </button>
                                <button className='btnStnd btn2' onClick={(e)=>toggle1(e)}>
                                    Descripcion
                                </button>
                            </div>
                            {tab1==='Inventario' ?
                                <div className="description">
                                    <div>Cantidad actual: {Formater(P.Inventario)}</div>
                                    <div>Inv. Maximo: {Formater(P.InvMaximo)}</div>
                                    <div>Inv. Mínimo: {Formater(P.InvMinimo)}</div>
                                </div>
                                :
                                <div className="description">
                                    {/* {descripcionComp}.<br/> */}
                                    Acá va descripcion completa
                                </div>
                            }
                        </div>
                    </div>
                    <div style={{width: '50%', display: 'flex', flexDirection: 'column'}}>
                        <div className="mainFeatures">
                            <div className="theLogo">
                                <picture>
                                    <source
                                        type="image/avif"
                                        srcSet={catSource}
                                    />
                                    <img
                                        src={catSource}
                                        //onError={()=>setCatSource()}
                                        alt="logo"
                                        style={{width: '100%'}}
                                        decoding="async"
                                    />
                                </picture>
                            </div>
                            <h1 id="productolLabel">
                                {P.Descripcion}<br/>
                                <span className="smolText">Cod: {P.Cod}</span>
                            </h1>
                        </div>
                        <span className="smolText quantityText">{quantity}</span>
                        <div style={{
                            color: '#193773',
                            fontSize: '1.5rem',
                        }}>
                            Cantidad:<br/>
                        </div>
                        <div className="quantityBox">
                            <button className="btnStnd btn1" onClick={() => {
                                if((cant-P.EsUnidadOpaquete)>=0){
                                    setCant(cant-P.EsUnidadOpaquete)
                                    setTotalPrice(P.PCosto*(cant-P.EsUnidadOpaquete))
                                }
                            }}>
                                -
                            </button>
                            <input
                                className='quantity' type="number"
                                min={1}
                                value={cant}
                                style={{width: `${(String(cant).length*12.2)+24}px`}} //here i change the with in function of the length of the content plus 24 of padding
                                onChange={(e)=>{setCant(e.target.value)}}
                                /*onBlur={(e)=>{
                                    let theCant = parseInt(e.target.value)
                                    if(e.target.value%unitPaq !== 0){
                                        // Math.ceil(e.target.value / unitPaq) * unitPaq --> this calculates the min cant depends on unitPaq
                                        theCant = parseInt(Math.ceil(e.target.value / unitPaq) * unitPaq)
                                        setCant(theCant);
                                    }
                                    setTotalPrice(unitPrice*theCant)
                                }}*/
                            />
                            <button className="btnStnd btn1" onClick={() => {
                                setCant(parseInt(cant)+P.EsUnidadOpaquete)
                                setTotalPrice(P.PCosto*(parseInt(cant)+P.EsUnidadOpaquete))
                            }}>
                                +
                            </button>
                        </div>
                        <div className="unitPrice genFont">
                            <span className='mainBlue fw-bold'>
                                <strong>Valor:&nbsp;</strong>
                            </span>
                            <span className="fw-bold">
                                $ {Formater(P.PCosto)}
                            </span>
                        </div>
                        <h1>
                            <div className="totalPrice mainBlue">
                                <div className='subTit fw-bold'>Total:</div>
                                <span className='text-black Tit'>
                                    $ {Formater(totalPrice)}
                                </span>
                            </div>
                        </h1>
                        <button className="btnAddCart btnStnd btn1" /*disabled={(agotado || (cant===0))}*/ onClick={() => {btnCart()}}>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
