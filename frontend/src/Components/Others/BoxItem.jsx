import React, { useRef, useState } from 'react';
import './_BoxItem.scss';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif';
import { useTheContext } from '../../TheProvider';

export const BoxItem = ({Codigo, Descripcion, simpleFunct, showModal, SVenta, Agotado}) => {

    const [show, setShow] = useState(false);
    
    const [img, setImg] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIF/${Codigo}.avif`);

    const theCaja = useRef();

    const {section, } = useTheContext();

    const handleClickBox = () =>{
        if(simpleFunct){
            simpleFunct();
        }
        if((showModal && (SVenta === 1)) || (section==='Nueva Compra')){
            document.body.classList.add('modalOpen');
            setShow(true);
        }
    }

    return (
        <>
            <div ref={theCaja} style={{position: 'relative', width: '154px', height: '200px'}}>
                <div className='caja-product' onClick={()=>{handleClickBox()}}>
                    { Agotado ?
                        <div className='soldOutLI' style={{
                            fontSize: (theCaja.current ? theCaja.current.clientWidth - 30 : 0)+'%'}}>
                            AGOTADO
                        </div>
                    :
                        <></>
                    }
                    <div className='detailBox'>
                        <div className='BimgContainer'>
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={img}
                                />
                                <img
                                    src={img}
                                    onError={()=>{setImg(imgPlaceHolder)}}
                                    alt="imgProducto"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        <strong>{Descripcion}</strong>
                    </div>
                </div>
            </div>
            {show && showModal(setShow, img)}
        </>
    );
}