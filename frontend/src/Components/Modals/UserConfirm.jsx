import React, { useState } from 'react';
import './_GeneralModal.scss'
import { validateUser } from '../../api';

export const UserConfirm = ({show, confirmed}) => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const veirfyUser = async() =>{
        //* function to verify the user-------------------------
        const userData = await validateUser({
            "EmailUser": user,
            "Password": password
        });
        if(!userData){
            alert('Problema de conexión, intente de nuevo más tarde');
            return;
        }
        if(userData.Cod){
            confirmed(true)
            show(false)
        }else{
            alert('Usuario o contraseña incorrectos');
        }
        //*-----------------------------------------------------
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content'>
                <div className='theModal-header' style={{justifyContent: 'flex-end'}}>
                    <button className='btn1Stnd' onClick={() => {show(false)}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                </div>
                <div className='theModal-body'>
                    <div className='Row' style={{textAlign: 'center'}}>
                        <strong>Ingrese usuario y contraseña para continuar</strong>
                    </div>
                    <div className='Row' style={{margin: '10px'}}>
                        <div style={{width: '90px', textAlign: 'end', marginRight: '10px'}}>
                            Usuario:
                        </div>
                        <input
                            type='text'
                            value={user}
                            onChange={(e) => { setUser(e.target.value) }}
                            style={{width: '55%'}}/>
                    </div>
                    <div className='Row' style={{margin: '10px'}}>
                        <div style={{width: '90px', textAlign: 'end', marginRight: '10px'}}>
                            Contraseña:
                        </div>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            onKeyDown={(e)=>{if(e.code==='Enter')veirfyUser()}}
                            style={{width: '55%'}}/>
                    </div>
                </div>
                <div style={{padding: '10px'}}>
                    <button
                        className='btnStnd btn1'
                        onClick={() => {show(false)}}
                        style={{marginRight: '10px'}}>
                            Cancelar
                    </button>
                    <button className='btnStnd btn1' onClick={() => {veirfyUser()}}>Aceptar</button>
                </div>
            </div>
        </div>
    );
}