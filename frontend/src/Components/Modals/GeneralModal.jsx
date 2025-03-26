import React from 'react';

export const GeneralModal = ({show, Contenido, width='50%', height='50%'}) => {
    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    <Contenido/>
                </div>
            </div>
        </div>
    );
}
