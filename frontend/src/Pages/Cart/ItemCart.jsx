import React, { useEffect, useState } from 'react';
import './_ItemCart.scss';
import imgPlaceHolder from '../../Assets/AVIF/placeHolderProduct.avif'
import { Formater } from '../../App';

export const ItemCart = ({id, nombre, cod, unitPrice, unitPaq, category, cantidad, onDelete, updtC}) => {
    
    const [cant, setCant] = useState(parseInt(cantidad))
    const [totalPrice, setTotalPrice] = useState(unitPrice*cant)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [fontResize, setFontResize] = useState('');
    const [imgSrc, setImgSrc] = useState(`https://sivarwebresources.s3.amazonaws.com/AVIF/${cod}.avif`);

    const handleDelete = () =>{
        if(window.confirm('¿Desea eliminar este producto?')){
            onDelete(id)
        }
    }
    
    const resize_ob = new ResizeObserver(()=>{
        setScreenWidth(window.innerWidth);
    });

    useEffect(() => {
        const theId = 'a' + id
        resize_ob.observe(document.querySelector('#'+theId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {        
        if(screenWidth < 431){
            setFontResize('1.7rem')
        }else{
            setFontResize('')
        }
        // eslint-disable-next-line
    }, [screenWidth]);

    const handleError = () =>{
        console.log(`img ${cod} not found`);
        setImgSrc(imgPlaceHolder)
    }

    useEffect(() => {        
        setImgSrc(`https://sivarwebresources.s3.amazonaws.com/AVIF/${cod}.avif`)
        setCant(parseInt(cantidad))
        setTotalPrice(unitPrice*(parseInt(cantidad)))
        // eslint-disable-next-line
    }, [cod]);

    return (
        <div className='itemCartStyle' id={`a${id}`} >
            <div className='delContainer' role='button' onClick={()=>handleDelete()}>
                <i className="bi bi-trash3"></i>
            </div>
            <div className='itemCartImgContainer'>
                <div className={`imgWB imgProducto itemCartImg C${category}`}>
                    <picture>
                        <source
                            type="image/avif"
                            srcSet={imgSrc}
                        />
                        <img
                            src={imgSrc}
                            onError={handleError}
                            alt="categoria"
                            decoding="async"
                        />
                    </picture>                    
                </div>
            </div>
            <div className='detailsItem'>
                <div className='subTit' style={{lineHeight: '1.1'}}><strong>{nombre}</strong>
                    <div className='smolText' style={{color: '#747474'}}>{cod}</div>
                </div>
                <div style={{marginTop: '10px'}}>
                    V.U: $ {Formater(unitPrice)}
                </div>
                <div className="quantityBox">
                    <button className="btnStnd btn1" onClick={() => {
                        if((cant-unitPaq)>0){
                            updtC(id, parseInt(cant)-unitPaq)
                            setCant(cant-unitPaq)
                            setTotalPrice(unitPrice*(cant-unitPaq))
                        }
                    }}>
                        -
                    </button>
                    <input
                        className='quantity' type="number"
                        min={1}
                        value={cant}
                        style={{width: `${(String(cant).length*14.4)+24}px`}} //here i change the with in function of the length of the content plus 24 of padding                        
                        onChange={(e)=>{setCant(parseInt(e.target.value));}}
                        onBlur={(e)=>{
                            let theCant = parseInt(e.target.value)                            
                            if(e.target.value%unitPaq !== 0){
                                theCant = parseInt(Math.ceil(e.target.value / unitPaq) * unitPaq)
                                setCant(theCant);
                            }
                            setTotalPrice(unitPrice*theCant)
                            updtC(id, theCant)
                        }}
                    />
                    <button className="btnStnd btn1" onClick={() => {
                        updtC(id, parseInt(cant)+unitPaq)
                        setCant(parseInt(cant)+unitPaq)
                        setTotalPrice(unitPrice*(parseInt(cant)+unitPaq))                        
                    }}>
                        +
                    </button>
                </div>
                <div className="totalPrice inItemCart mainBlue">
                    <div className='subTit fw-bold'>Total:</div>
                    <h1>
                        <span className='text-black Tit' style={{fontSize: `${fontResize}`}}>
                            ${Formater(totalPrice)}
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
}
