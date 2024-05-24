import React from 'react';

export const GeneralModal = ({show, Contenido, width, height}) => {
    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height}}>
                <div className='theModal-header'>
                    {/* {<span className='close1' onClick={() => {show(false)}}>equis</span>} */}
                    <button>
                        <i className='bi bi-x'/>
                    </button>
                </div>
                <div className='theModal-body'>
                    <Contenido/>
                </div>
            </div>
        </div>
    );
}
