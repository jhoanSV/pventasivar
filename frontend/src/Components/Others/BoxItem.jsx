import React, { useState } from 'react';
import './_BoxItem.scss';

export const BoxItem = ({Codigo, Descripcion, simpleFunct, showModal, IdFerreteria}) => {

    const [show, setShow] = useState(false);

    const handleClickBox = () =>{
        if(simpleFunct){
            simpleFunct();
        }
        if(showModal && (IdFerreteria === 0)){
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
                                    srcSet={`https://sivarwebresources.s3.amazonaws.com/AVIF/${Codigo}.avif`}
                                />
                                <img
                                    src={`https://sivarwebresources.s3.amazonaws.com/AVIF/${Codigo}.avif`}
                                    alt="imgProducto"
                                    decoding="async"
                                />
                            </picture>
                        </div>
                        <strong>{Descripcion}</strong>
                    </div>
                </div>
            </div>
            {show && showModal(setShow)}
        </>
    );
}