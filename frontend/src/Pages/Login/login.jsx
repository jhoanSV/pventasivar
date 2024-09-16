import React, {useEffect, useState } from 'react';
import "./_login.scss";
import { useTheContext } from '../../TheProvider';
import { SubCategories, validateUser, LoginPos } from '../../api';
import pckjson from '../../../package.json';
export function Login(){
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };
    const { setLogged, setUsD, setSubC, setCategories } = useTheContext()
    const [inputData1, setInputData1] = useState();
    const [inputData2, setInputData2] = useState();

    const LoginHandle = async() => {
        //*Veo ñero ojo con esto
        /*setLogged(true);
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
        return;*/
        const userData = await LoginPos({
            "EmailUser": inputData1,
            "Password": inputData2
        });
        console.log(userData);
        if(!userData){
            alert('Problema de conexión, intente de nuevo más tarde');
            return;
        }
        if(userData.Cod){
            const res = await SubCategories()
            const uniqueData = Array.from(
                res.reduce((map, item) => {
                    if (!map.has((item.Categoria.toLowerCase()))) {
                        map.set(item.Categoria.toLowerCase(), { IdCategoria: item.IdCategoria, Categoria: item.Categoria.toLowerCase() });
                    }
                    return map;
                }, new Map()).values()
            );
            setSubC(res)
            setCategories(uniqueData)
            setLogged(true);
            setUsD(userData);
        }else{
            alert('Usuario o contraseña incorrectos');
        }
    }

    return (
        <section className="login">
            <div className="inic">
                <img src={require('../../Assets/AVIF/LogoSivarB.avif')} alt="Descripción de la imagen" className='img1' />
                <img src={require('../../Assets/AVIF/LlaveSivar.avif')} alt="Descripción de la imagen" className='img2' />
                <span className="_About-header">
                    <h1 className="Titulo">¡Bienvenido!</h1>
                </span>

                <input
                    id='linput1'
                    type='text'
                    placeholder='Usuario'
                    onChange={(e)=>setInputData1(e.target.value)}
                />
                <input
                    id='linput2'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Contraseña'
                    onChange={(e)=>setInputData2(e.target.value)}
                />
                <label className='mostrar'>
                    <input
                        className="verC"
                        type="checkbox"
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                    />
                    Mostrar contraseña
                </label>
                <button className='btnStnd btn1' onClick={()=>{LoginHandle()}}>
                    <i className="bi bi-arrow-right"></i>
                </button>
                <span className="aviso">
                    <label>
                        reportar un problema
                    </label>
                </span>
                Version {pckjson.version}
            </div>
            <div className="cuadroV">
                <video className="mi-video" src="https://sivarwebresources.s3.amazonaws.com/video1.mp4" loop autoPlay muted />
            </div>         
        </section>
    );
}
export default Login;