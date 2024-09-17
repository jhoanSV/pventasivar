import React, { useEffect, useRef } from 'react';
import './_AlertContent.scss';

export const AlertContent = ({ message, mode, onCancel, onAccept }) => {

    const button1Ref = useRef(null);
    const button2Ref = useRef(null);

    // Maneja el evento de teclado
    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight" && mode === 1) {
            // Si se presiona la flecha derecha, cambia el foco a button2
            if (document.activeElement === button1Ref.current) {
                button2Ref.current.focus();
            }
        } else if (e.key === "ArrowLeft") {
            // Si se presiona la flecha izquierda, cambia el foco a button1
            if (document.activeElement === button2Ref.current) {
                button1Ref.current.focus();
            }
        }
    };

    useEffect(() => {
        // Agrega el listener del evento de teclado cuando se monta el componente
        window.addEventListener("keydown", handleKeyDown);
        button1Ref.current.focus();
        // Limpia el listener cuando el componente se desmonta
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className='theAlertContainer'>
            <div id='talertcId' className='theAlertContent'>
                <p>{message}</p>
                <div style={{ textAlign: 'end' }}>
                    <button className='btnStnd btn1' onClick={onAccept} ref={button1Ref}>
                        Aceptar
                    </button>
                    {mode === 1 && (
                        <button className='btnStnd btn1' onClick={onCancel}
                            style={{ marginLeft: '12px' }} ref={button2Ref}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
