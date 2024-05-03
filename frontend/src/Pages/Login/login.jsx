import React from 'react';
import "./_login.scss";
import { useTheContext } from '../../TheProvider';

export function Login(){
    
    const { setLogged } = useTheContext()

    const LoginHandle = () => {
        setLogged(true)
    }

    return (
        <div className="_About">
            <header className="_About-header">
                <h1 className="_About-header-title">Iniciar Sesi&oacute;n</h1>
            </header>
            <label>
                Nombre de usuario
            </label>
            <input type='text'/>
            <label>
                Contraseña
            </label>
            <input type='text'/>
            <button onClick={()=>{LoginHandle()}}>
                {'-->'}
            </button>
        </div>
    );
}