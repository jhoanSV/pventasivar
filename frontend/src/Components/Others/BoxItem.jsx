import React, { useState } from 'react';
import './_BoxItem.scss';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif';

export const BoxItem = ({Codigo, Descripcion, simpleFunct, showModal, IdFerreteria}) => {

    const [show, setShow] = useState(false);
    
    const [img, setImg] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIF/${Codigo}.avif`);

    const handleClickBox = () =>{
        if(simpleFunct){
            simpleFunct();
        }
        if(showModal && (IdFerreteria === 0)){
            document.body.classList.add('modalOpen');
            setShow(true);
        }
    }

    return (
        <>
            <div style={{position: 'relative', width: '154px', height: '200px'}}>
                <div className='caja-product' onClick={()=>{handleClickBox()}}>
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