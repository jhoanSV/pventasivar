import React from 'react';
import './_AlertContent.scss';

export const AlertContent = ({message, mode, onCancel, onAccept}) => {

    

    return (
        <div className='theAlertContainer'>
            <div id='talertcId' className='theAlertContent'>
                <p>{message}</p>
                    <div style={{textAlign: 'end'}}>
                        <button className='btnStnd btn1' onClick={onAccept}>
                            Aceptar
                        </button>
                        {mode === 1 && (
                            <button className='btnStnd btn1' onClick={onCancel}
                            style={{marginLeft: '12px'}}>
                                Cancelar
                            </button>
                        )}
                    </div>
            </div>
        </div>
    );
}
