import React, { useEffect, useState } from 'react';
import "./_newcustomer.scss";
import { useTheContext } from '../../TheProvider';
import { useLocation, useNavigate } from 'react-router-dom';

export function Newcustomer(){
    
    const [cType, setCType] = useState();
    const [conCredito, setConCredito] = useState(false);
    const [value, setValue] = useState('');
    const [verCod, setVerCod] = useState('');//* verificationCode
    const [creLim, setCreLim] = useState();//* credit limit
    const { setSection } = useTheContext();
    
    const location = useLocation();
    const navigate = useNavigate()

    const handleChange = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(newValue);
      };

    const handleFormat = (e) => {
        const t = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = t
    }

    const validate = () =>{
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        alert(regex.test(document.getElementById('emailId').value))
    }
    
    const Formater = (number) =>{
        return Intl.NumberFormat().format(number);
    }

    useEffect(() => {
        setSection('Nuevo cliente')

        if(location.state){
            let data = location.state
            if(data['cType']==='cc'){
                document.getElementById('CustomerType').value = 1
                setValue(data['id_nit'])
                setCType('1')
            }else{
                document.getElementById('CustomerType').value = 2
                const parts = data['id_nit'].split('-');
                setValue(parts[0])
                setVerCod(parts[1])
                setCType('2')
            }
            document.getElementById('cnombre').value = data['nombre']
            document.getElementById('capellido').value = data['apellido']            
            document.getElementById('celId1').value = (data['telefono1'])
            document.getElementById('celId2').value = (data['telefono2']) ? (data['telefono2']) : ''
            document.getElementById('emailId').value = (data['email']) ? (data['email']) : ''
            document.getElementById('adId').value = (data['direccion']) ? (data['direccion']) : ''
            document.getElementById('barrioId').value = (data['barrio']) ? (data['barrio']) : ''
            if(data['credito']===true){
                document.getElementById('checkCredito').checked = true;
                setConCredito(true)
                setCreLim(Formater(data['limCredito']))
            }
            document.getElementById('nctaId').value = data['notas'] ? data['notas'] : ''
        }
        // eslint-disable-next-line
    }, []);

    return (
        <section className='newCustomer'>
            <div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Tipo cliente</label>
                    </div>
                    <div className='Colmn2'>
                        <select id='CustomerType' onChange={(e)=>{setCType(e.target.value)}}>
                            <option value='1'>C&eacute;dula</option>
                            <option value='2'>Nit</option>
                        </select>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>                        
                        <label>Nit/C.C</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='numId' type="text"
                         onChange={(e)=>handleChange(e)}
                         value={value}
                         style={{width: '41%', marginRight: '5px'}}
                         />
                        {cType==='2' && 
                            <input id='nitId' type="text" defaultValue={verCod}/>
                        }
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>{cType==='2' ? 'Razón social' : 'Nombres'}</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='cnombre' type="text" className=""/>
                        <label style={{marginLeft: '10px'}}>Apellidos</label>
                        <input id='capellido' type="text" className="" style={{marginLeft: '20px'}}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Telefono 1/whastsapp</label>                        
                    </div>
                    <div className='Colmn2'>
                        <input id='celId1'
                            type="text"
                            className="noInputArrows"
                            onChange={(e)=>handleFormat(e)}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Telefono 2</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='celId2'
                            type="text"
                            className="noInputArrows"
                            onChange={(e)=>handleFormat(e)}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>E-mail</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='emailId' type="text" className=""/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Direccion</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='adId' type="text" className=""/>
                        <label style={{marginLeft: '10px'}}>Barrio</label>
                        <input id='barrioId' type="text" className="" style={{marginLeft: '20px'}}/>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Credito</label>
                    </div>
                    <div className='Colmn2' style={{minHeight: '28px'}}>
                        <input id='checkCredito' type="checkbox" className="" onChange={()=>{setConCredito(e=>!e)}}/>
                        {conCredito &&
                            <>
                                <label style={{paddingRight: '10px'}}>Limite de credito</label>
                                <input id='limCredito' type="text" className="" value={creLim}
                                 onBlur={(e)=>{setCreLim(Formater(e.target.value))}}
                                 onChange={(e)=>setCreLim(e.target.value)}/>
                            </>
                        }
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Notas</label>
                    </div>
                    <div className='Colmn2'>
                        <textarea
                            id='nctaId'
                            type="textbox"
                            className="ncTextArea"
                            placeholder="Notas/Detalles del cliente"
                        />
                    </div>
                </div>
                <div style={{marginLeft: '15.5%', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <button className='btnStnd btn1'
                         style={{marginRight: '10px'}} onClick={()=>{validate()}}>{location.state ? 'Modificar' : 'Guardar'}</button>
                        {location.state && <button className='btnStnd btn1'>Estado de cuenta</button>}
                    </div>
                    <button className='btnStnd btn1' onClick={()=>navigate(-1)}>Cancelar</button>
                </div>
            </div>
        </section>
    );
}