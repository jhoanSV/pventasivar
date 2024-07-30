import React, { useEffect, useState } from 'react';
import "./_login.scss";
import { useTheContext } from '../../TheProvider';
import { validateUser } from '../../api';

export function Login(){
    
    const { setLogged, setUsD } = useTheContext()
    const [inputData1, setInputData1] = useState();
    const [inputData2, setInputData2] = useState();

    const LoginHandle = async() => {
        //*Veo ñero ojo con esto
        setLogged(true);
        setUsD({
            "Cod": 242,
            "Ferreteria": "Ferreteria Marley",
            "Contacto": "Prueba ojo prro",
            "Direccion": "",
            "Telefono": "3219155489",
            "Cel": "",
            "Email": "gersonlvargas.na@gmail.com",
            "Asesor": "Gerson"
        })
        return;
        const userData = await validateUser({
            "EmailUser": inputData1,
            "Password": inputData2
        });
        console.log(userData);
        if(!userData){
            alert('Problema de conexión, intente de nuevo más tarde');
            return;
        }
        if(userData.Cod){
            setLogged(true);
            setUsD(userData);
        }else{
            alert('Usuario o contraseña incorrectos');
        }
    }

    // useEffect(() => {
        
    // }, []);

    return (
        <div className="_About">
            <header className="_About-header">
                <h1 className="_About-header-title">Iniciar Sesi&oacute;n</h1>
            </header>
            <label>
                Nombre de usuario
            </label>
            <input
                id='linput1'
                type='text'
                onChange={(e)=>setInputData1(e.target.value)}
            />
            <label>
                Contraseña
            </label>
            <input
                id='linput2'
                type='text'
                onChange={(e)=>setInputData2(e.target.value)}
            />
            <button onClick={()=>{LoginHandle()}}>
                {'-->'}
            </button>
        </div>
    );
}