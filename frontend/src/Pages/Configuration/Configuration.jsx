import React, { useEffect, useState } from 'react';
import './_Configuration.scss';
import { useTheContext } from '../../TheProvider';
import { ChangePassModal } from './ChangePassModal';

export const Configuration = () => {

    const { setSection, usD } = useTheContext();
    const [activeTab, setActiveTab] = useState(0);
    const [showChangePass, setShowChangePass] = useState(false);

    useEffect(() => {
        setSection('Configuración');
        //eslint-disable-next-line
    }, []);

    return (
        <section className='Configuration'>
            <div className='mccontainer'>
                <ul>
                    <li className={activeTab === 0 ? 'active' : ''} 
                        onClick={(e)=>{setActiveTab(0)}}>
                        Cuenta
                    </li>
                    <li className={activeTab === 1 ? 'active' : ''} 
                        onClick={(e)=>{setActiveTab(1)}}>
                        Preferencias
                    </li>
                </ul>
            </div>
            <div style={{width: '100%'}}>
                {activeTab===0 ?
                <>
                    <h1>Cuenta</h1>
                    <div className='configBox'>
                        <div style={{fontWeight: 'bold', marginBottom: '10px', fontSize: '20px'}}>
                            Datos generales
                        </div>
                        <div className='a'>
                            <div>
                                <i className="bi bi-person-circle userLogo profile"></i>
                            </div>
                            <div className='gridCont gcConfig'>
                                <div>
                                    Nombre Ferreter&iacute;a:
                                </div>
                                <div>
                                    {usD.Ferreteria}
                                </div>
                                <div>
                                    Encargado:
                                </div>
                                <div>
                                    {usD.Contacto}
                                </div>
                                <div>
                                    Correo:
                                </div>
                                <div>
                                    {usD.Email}
                                </div>
                                <div>
                                    Telefono:
                                </div>
                                <div>
                                    {usD.Telefono}
                                </div>
                                <div>
                                    Celular:
                                </div>
                                <div>
                                    {usD.Cel}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='configBox'>
                        <div style={{fontWeight: 'bold', marginBottom: '10px', fontSize: '20px'}}>
                            Seguridad
                        </div>
                        <div className='gridCont gcConfig'>
                            <div>
                                Contraseña:
                            </div>
                            <div>
                                <button className='btnStnd btn1' onClick={()=>setShowChangePass(true)}>
                                    Cambiar contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    <h1>Sin configuraciones disponibles</h1>
                </>
                }
            </div>
            {showChangePass && <ChangePassModal show={setShowChangePass} />}
        </section>
    );
}
