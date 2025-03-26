import React, { useEffect, useState } from 'react';
import './_Configuration.scss';
import { Changepassword } from '../../api';
import { useTheContext } from '../../TheProvider';
import { TheAlert } from '../../Components';

export const ChangePassModal = ({show}) => {

    const [validateText, setValidateText] = useState('');
    const [variableText, setVariableText] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [allOk, setAllOk] = useState([false, false, false]);
    const [btnDis3, setBtnDis3] = useState(true);

    const { usD } = useTheContext();

    const checkAllTrue = () => {
        return allOk.every(value => value === true);
    };

    const toChangePassword = async() =>{
        /*Funtion to check if the user is alowed to change the password*/
        const dataChangePassword = await Changepassword({
            "CodUser": usD.Cod,
            "Password": currentPassword,
            "NewPassword": newPassword
        })
        console.log(dataChangePassword);
        if (dataChangePassword.hasOwnProperty('authorization') && dataChangePassword.authorization === 'Authorized'){
            //password changed
            console.log('authorized', dataChangePassword);
            TheAlert('Contraseña modificada correctamente');
            show(false);
        } else if (dataChangePassword.hasOwnProperty('error') && dataChangePassword.error === 'Unauthorized'){
            //password not changed
            console.log('unauthorized', dataChangePassword);
            TheAlert('Hubo un error al cambiar la contraseña');
        }
    }

    const thePattern = (classRev1, classRev2, classAdd) =>{//*function with repeated pattern
        let c = document.querySelector('#plbContainer')
        c.childNodes[0].classList.remove(classRev1, classRev2)
        c.childNodes[0].classList.add(classAdd)
        c.childNodes[1].classList.remove(classRev1, classRev2)
        c.childNodes[1].classList.add(classAdd)
        c.childNodes[2].classList.remove(classRev1, classRev2)
    }

    const handlePassInput = (thePass) => {
        var number = /\d/.test(thePass);
        var letter = /\D/.test(thePass);
        let plbContainer = document.querySelector('#plbContainer')
        let passState = ''
        if(thePass.length === 0){
            passState = ''            
            plbContainer.classList.replace('passLvlBarContainer', 'd-none')
        }else if(thePass.length >= 8){            
            if(number && letter){                
                passState = 'Contraseña segura'
                thePattern('passLvl1','passLvl2', 'passLvl3')
                plbContainer.childNodes[2].classList.add('passLvl3')
                setAllOk(prevState => [true, prevState[1], prevState[2]]);
            }else if(number){
                passState = 'Debe tener mínimo una letra'
                thePattern('passLvl1','passLvl3', 'passLvl2')
            }else if(letter){
                passState = 'Debe tener mínimo un número'
                thePattern('passLvl1','passLvl3', 'passLvl2')
            }
        }else{
            plbContainer.classList.replace('d-none', 'passLvlBarContainer')
            passState = ('Debe tener mínimo 8 catarteres y un número')
            plbContainer.childNodes[0].classList.remove('passLvl2', 'passLvl3')
            plbContainer.childNodes[1].classList.remove('passLvl2', 'passLvl3')
            plbContainer.childNodes[2].classList.remove('passLvl2', 'passLvl3')
            plbContainer.childNodes[0].classList.add('passLvl1')
        }
        setValidateText(passState)
    }

    const handlePassMatch = () =>{
        let text = 'La contraseña no coincide'
        const theInputs = document.querySelectorAll('.chPassInput')
        if(theInputs[0].value===theInputs[1].value){
            text = ''
            setAllOk(prevState => [prevState[0], true, prevState[2]]);
        }else{
            setAllOk(prevState => [prevState[0], false, prevState[2]]);
        }
        setVariableText(text)
    }

    useEffect(() => {
        if (checkAllTrue()) {
            setBtnDis3(false)
        }
        // eslint-disable-next-line
    }, [allOk]);

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{position: 'relative', width: '368px'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}}
                    style={{position: 'absolute', top: '0px', right: '0px'}}
                >
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='cpssm'>
                    <h1>Cambiar contraseña</h1>
                    <div className="userPass">
                        <input type="passWord" className="theInput fw-bold" placeholder="Contraseña actual" 
                            aria-label="Campo para correo"
                            onChange={(e)=>{
                                if(e.target.value !== ''){
                                    setAllOk(prevState => [prevState[0], prevState[1], true]);
                                    setCurrentPassword(e.target.value);
                                }else{
                                    setAllOk(prevState => [prevState[0], prevState[1], false]);
                                }
                            }}
                        />
                    </div>
                    <div className="userPass">
                        <input type="password" className="chPassInput theInput fw-bold" placeholder="Contraseña nueva" 
                            aria-label="Campo para contraseña"
                            onChange={(e) => {
                                handlePassInput(e.target.value)
                                if (document.querySelector('#pass2').value!==''){
                                    handlePassMatch()
                                }
                            }}
                        />
                    </div>
                    {validateText !== '' && <div style={{width: '100%', textAlign: 'start'}}><span>{validateText}</span></div>}
                    <div id='plbContainer' className='d-none'>
                        <span className='passLvlBar'/>
                        <span className='passLvlBar'/>
                        <span className='passLvlBar'/>
                    </div>
                    <div className="userPass">
                        <input id='pass2' type="password" className="chPassInput theInput fw-bold" placeholder="Confirmar" 
                            aria-label="Confirmar contraseña"
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (e.target.value===''){
                                    setVariableText('')
                                }else{
                                    handlePassMatch()
                                }
                            }}
                        />
                    </div>
                    {variableText !== '' && <div style={{width: '100%', textAlign: 'start'}}><span className='noMatch'>{variableText}</span></div>}
                    <div>
                        <button className='btnStnd btn3'
                            style={{marginRight: '5px'}}
                            onClick={()=>show(false)}
                        >
                            Cancelar
                        </button>
                        <button className='btnStnd btn1'
                            style={{marginLeft: '5px'}}
                            disabled={btnDis3}
                            onClick={()=>toChangePassword()}
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
