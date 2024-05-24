import React, { useState } from 'react';
import './_GeneralModal.scss'

export const UserConfirm = ({show, confirmed}) => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const veirfyUser = () =>{
        let auth = false
        //* function to verify the user, the next method is a toEnglish(simulacro)
        if(user === 'admin' && password === '123'){
            auth = true
        }
        //*-----------------------------------------------------
        if(auth){
            confirmed(true)
            show(false)
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{ width: '40%' }}>
                <div className='theModal-header'>
                    {/* {<span className='close1'  */}
                    <button className='btn1Stnd' onClick={() => {show(false)}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                </div>
                <div className='theModal-body'>
                    <div className='Row' style={{textAlign: 'center'}}>
                        <strong>Por favor vuelva a ingresar usario y contraseña para continuar</strong>
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