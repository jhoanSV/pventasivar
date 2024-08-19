import React, { useEffect, useState } from 'react';
import './_AddPurchaseModal.scss';
import imgPlaceHolder from '../../Assets/PNG/placeHolderProduct.png';

export const AddPurchaseModal = ({P, Show}) => {
                                    
    const [img, setImg] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIF/${P.Cod}.avif`);

    const handleClickOutside = (event) => {
        let dmc = document.getElementById(`ModalCont${P.Cod}`);
        if (dmc && !dmc.contains(event.target)) {
            Show(false);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line
    }, []);

    return (
        <div className='theModalContainer'>
            <div id={`ModalCont${P.Cod}`} className='theModal-content addPurchMo'>
                <div className='Row TMCD3'>
                    <div style={{width: '50%', paddingRight: '20px'}}>
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
                                    onError={()=>{setImg(imgPlaceHolder)}}
                                    alt="productImg"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        <div className="commingsoon">
                            {/*Para después*/}
                        </div>
                        <div className="mt-auto">                                        
                            <p className="subTit"><strong>Descripcion:</strong></p>
                            <div className="description scrollableY genFont">
                                {/* {descripcionComp}.<br/> */}
                                Acá va descripcion completa
                            </div>
                        </div>
                    </div>
                    <div style={{width: '50%'}}>
                        <div className="mainFeatures">
                            <div className="theLogo">
                                <picture>
                                    <source
                                        type="image/avif"
                                        //srcSet={catSource}
                                    />
                                    <img
                                        //src={catSource}                                        
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
                        <div className='mt-auto'>
                            {/* <span className="smolText quantityText">{quantity}</span> */}
                            <div className="subTit fw-bold mainBlue">
                                Cantidad:<br/>
                            </div>
                            <div className="quantityBox">
                                <button className="btnQuantity" onClick={() => {
                                    /*if((cant-unitPaq)>=0){
                                        setCant(cant-unitPaq)
                                        setTotalPrice(unitPrice*(cant-unitPaq))
                                    }*/
                                }}>
                                    -
                                </button>
                                <input
                                    className='quantity' type="number"
                                    min={1}
                                    //value={cant}
                                    //style={{width: `${(String(cant).length*14.4)+24}px`}} //here i change the with in function of the length of the content plus 24 of padding                        
                                    //onChange={(e)=>{setCant(parseInt(e.target.value));}}
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
                                <button className="btnQuantity" onClick={() => {
                                    /*setCant(parseInt(cant)+unitPaq)
                                    setTotalPrice(unitPrice*(parseInt(cant)+unitPaq))*/
                                }}>
                                    +
                                </button>
                            </div>
                            <div className="unitPrice genFont">
                                <span className='mainBlue fw-bold'>
                                    Valor:&nbsp;
                                </span>
                                <span className="fw-bold">
                                    {/* ${Formater(unitPrice)} */}
                                    unitPrice: 0000
                                </span>
                            </div>
                            <h1>
                                <div className="totalPrice mainBlue">
                                    <div className='subTit fw-bold'>Total:</div>
                                    <h1>
                                        <span className='text-black Tit'>
                                            {/* ${Formater(totalPrice)} */}
                                            Total price
                                        </span>
                                    </h1>
                                </div>
                            </h1>
                            <button className="btnAddCart boton" /*disabled={(agotado || (cant===0))}*/ /*onClick={() => {btnCart()}} data-bs-dismiss="modal"*/>
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
