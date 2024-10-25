import React, { useEffect, useState } from 'react';
import "./_newcustomer.scss";
import { TheAlert, TheInput } from '../../Components';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';
import { Newclient, UpdateClient, Clientlist, clientOccupation, ResFiscal } from '../../api';
import { DotProduct } from '../../App';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export function Newcustomer(){
    const WeightDian = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3]
    const { setSection, someData, usD } = useTheContext();
    const [ occupation, setOccupation ] = useState('');
    const [ optionsOccupation, setOptionsOccupations ] = useState([]);
    const [ resFiscal, setResFiscal ] = useState('');
    const [ optionsResFiscal, setOptionsResFiscal ] = useState([]);
    const [ enableB1, setEnableB1] = useState(false);
    const [ conCredito, setConCredito] = useState(false);
    const [ verCod, setVerCod] = useState('');//* verificationCode
    const [ contentList, setContentList] = useState([]);
    const [ showAlertCustomers, setShowAlertCustomers] = useState(false)
    const [ customerData, setCustomerData] = useState({
        "IdFerreteria": usD.Cod,
        "Tipo": 0, 
        "NitCC": "",
        "Nombre": "",
        "Apellido": "",
        "Telefono1": "",
        "Telefono2": "",
        "Correo": "",
        "Direccion": "",
        "Barrio": "",
        "FormaDePago": 0,
        "LimiteDeCredito": 0, //In this stage this have to be always 0
        "Nota": "",
        "Fecha": "2024-07-20 13:00:00", //Format is AAAA-MM-DD hh:mm:ss
        "Dv": 0,
        "Ocupacion": '',
        "ResFiscal": ''
    });    
    
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const listado = await Clientlist({
                "IdFerreteria": usD.Cod
            });
            const customerType = await clientOccupation()
            const fiscalRes = await ResFiscal(usD.tokenColtek, usD.token)
            setOptionsResFiscal(fiscalRes.FiscalResponsibility)
            setOptionsOccupations(customerType)
            if (listado) {
                setContentList(listado);
            }
        };
        fetchData();
    }, []);

    const handleFormat = (id, e) => {
        const t = e.target.value.replace(/[^0-9]/g, '');
        let toCheck = ''
        if (id === 'NitCC' && someData === null) {
            changeValuesCustomer('Dv', VerifyCodNit(t));
            if (customerData.Tipo === 1) {
                toCheck = t + '-' + VerifyCodNit(t)
            } else {
                toCheck = t
            }
            const filterCustomers = contentList.filter((data) => data.NitCC === toCheck)
            if (filterCustomers.length > 0 && id === 'NitCC') {
                setShowAlertCustomers(true)
            } else {
                setShowAlertCustomers(false)
            }
        }
        changeValuesCustomer(id, t);
    }

    const validate = async() =>{
        let a = {...customerData}
        console.log("customerData", a)
        let res, msj1, msj2, msjV = ''
        //* Primero se valida
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(a.NitCC.length < 9 && a.Tipo === 1){
            msjV = msjV + 'El Nit debe tener al menos 9 caracteres\n'
        }
        if(a.NitCC.length < 6 && a.Tipo === 0){
            msjV = msjV + 'El Cédula debe tener al menos 5 caracteres\n'
        }
        if(a.Nombre === ''){
            msjV = msjV + 'El nombre no puede estar vacío\n'
        }
        if(!regex.test(a.Correo)){
            msjV = msjV + 'El correo no es válido\n'
        }
        if(a.Ocupacion === ''){
            msjV = msjV + 'El campo ocupacion no debe estar vacio\n'
        }
        if(a.Tipo === 1 && a.ResFiscal === ''){
            msjV = msjV + 'La responsabilidad fiscal no debe estar vacia\n'
        }
        
        if (a.Tipo === 0) {
            a.ResFiscal = 'R-99-PN'
        }

        if(msjV){
            TheAlert(msjV);
            return;
        }
        //*-----------------
        if(customerData.Tipo===1){
            a.NitCC = customerData.NitCC + '-' + verCod
        }
        const fecha = new Date()
        const today = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds()
        if(someData){
            //* Modificar
            msj1 = 'Modificado con éxito'
            msj2 = 'modificar el cliente'
            a.Consecutivo = someData.Consecutivo
            res = await UpdateClient(a)
        }else{
            //* Nuevo
            msj1 = 'Creado con éxito'
            msj2 = 'crear el cliente'
            a.Fecha = today
            if (showAlertCustomers) {
                TheAlert('El Nit/Cédula ya existe');
                return;
            } else {
                console.log("userData: ", a)
                res = await Newclient(a)
            }
        }
        console.log(res);
        if(res.insertId || res.message === 'Transacción completada con éxito'){
            navigate('/Customerlist')
            TheAlert(msj1);
        }else{
            TheAlert('Ocurrió un error inesperado al '+ msj2);
        }
    }
    
    // const Formater = (number) =>{
    //     return Intl.NumberFormat().format(number);
    // }

    const changeValuesCustomer = (key, value)=>{
        //This function allows us to change the one specific value in the product data
        setEnableB1(true)
        setCustomerData(prevValue => ({
            ...prevValue, // Copia los valores anteriores
            [key]: value // Reemplaza el valor de la clave específica
        }));
    }

    const VerifyCodNit = (value) =>{
        let CodVe = value
        const digitList = Array.from(CodVe).filter(char => /\d/.test(char)).map(Number);
        // Completar digitList con ceros al principio para que tenga 15 entradas
        const filledDigitList = new Array(15 - digitList.length).fill(0).concat(digitList);
        const dot = DotProduct(filledDigitList, WeightDian)
        const result = 11-( dot % 11)
        //console.log(result)
        //setVerCod(result)
        return result
    }

    const ClientExists = () =>{
        const data = {...customerData}
        let toCheck = ''
        if (customerData.NitCC !== '') {
            if (customerData.Tipo === 1) {
                toCheck = customerData.NitCC + '-' + VerifyCodNit(customerData.NitCC)
            } else {
                toCheck = customerData.NitCC
            }
            const filterCustomers = contentList.filter((data) => data.NitCC === toCheck)
            if (filterCustomers.length > 0) {
                setShowAlertCustomers(true)
            } else {
                setShowAlertCustomers(false)
            }
        }
    }

    const handleSelectOccupation = (eventKey) =>{
        changeValuesCustomer("Ocupacion", eventKey)
        setOccupation(eventKey);
    }

    const handleSelectResFiscal = (eventKey) =>{
        changeValuesCustomer("Ocupacion", eventKey)
        setResFiscal(eventKey);
    }

    useEffect(() => {
        setSection('Nuevo cliente');

        if(someData){
            let data = {...someData};
            let parts = data.NitCC.split('-');
            if(parts[1]){
                data.NitCC = parts[0];
                setVerCod(parts[1]);
            }
            if(data['LimiteDeCredito']>0){
                document.getElementById('checkCredito').checked = true;
                setConCredito(true)
            }
            data.IdFerreteria = usD.Cod
            //data.FormaDePago = 0
            setCustomerData(data)
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
                        <select id='CustomerType'
                            value={customerData.Tipo}
                            onChange={(e)=>{{
                                changeValuesCustomer('Tipo', Number(e.target.value));
                                if (e.target.value === '0') {
                                    changeValuesCustomer('ResFiscal', "R-99-PN")
                                    //console.log("entro a cedula")
                                } else if (e.target.value === '1'){
                                    changeValuesCustomer('ResFiscal', "0-13")
                                    //console.log("entro a Nit")
                                }
                            }}}
                            onBlur={()=>{ClientExists()}}>
                            <option value='0'>C&eacute;dula</option>
                            <option value='1'>Nit</option>
                        </select>
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>                        
                        <label>Nit/C.C</label>
                    </div>
                    <div className='Colmn2'>
                        <input 
                            id='numId'
                            type="text"
                            onChange={(e)=>handleFormat('NitCC', e)}
                            value={customerData.NitCC}
                            style={{width: '41%', marginRight: '5px'}}
                            onBlur={() => {setVerCod(VerifyCodNit(customerData.NitCC)); ClientExists()}}
                         />
                        {customerData.Tipo=== 1 && 
                            <input
                                id='nitId'
                                type="text"
                                value={verCod}
                                onChange={(e)=>setVerCod(e.target.value)}/>
                        }
                    </div>
                    {showAlertCustomers && <div style={{color: 'red'}}><label>El cliente ya existe</label></div>}
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>{customerData.Tipo=== 1 ? 'Razón social' : 'Nombres'}</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='cnombre' type="text" value={customerData.Nombre} onChange={(e)=>changeValuesCustomer('Nombre', e.target.value)}/>
                        {customerData.Tipo!== 1 && 
                            <>
                            <label style={{marginLeft: '10px'}}>Apellidos</label>
                            <input id='capellido' type="text"
                                value={customerData.Apellido}
                                onChange={(e)=>changeValuesCustomer('Apellido', e.target.value)}
                                style={{marginLeft: '20px', width: '39%'}}
                            />
                            </>
                        }
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Telefono 1 / whastsapp</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='celId1'
                            type="text"
                            value={customerData.Telefono1}
                            onChange={(e)=>handleFormat("Telefono1", e)}
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
                            value={customerData.Telefono2}
                            onChange={(e)=>handleFormat("Telefono2", e)}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>E-mail</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='emailId' type="text"
                            value={customerData.Correo}
                            onChange={(e)=>changeValuesCustomer('Correo', e.target.value)}
                        />
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Direccion</label>
                    </div>
                    <div className='Colmn2'>
                        <input id='adId' type="text"
                            value={customerData.Direccion}
                            onChange={(e)=>changeValuesCustomer('Direccion', e.target.value)}
                        />
                        <label style={{marginLeft: '10px'}}>Barrio</label>
                        <input id='barrioId' type="text"
                            style={{marginLeft: '20px'}}
                            value={customerData.Barrio}
                            onChange={(e)=>changeValuesCustomer('Barrio', e.target.value)}
                        />
                    </div>
                </div>
                <div className='Row' style={{display: 'none'}}>{/*Display none while E1*/}
                    <div className='Colmn1'>
                        <label>Credito</label>
                    </div>
                    <div className='Colmn2' style={{minHeight: '28px'}}>
                        <input id='checkCredito' type="checkbox" className="" onChange={()=>{setConCredito(e=>!e)}}/>
                        {conCredito &&
                            <>
                                <label style={{paddingRight: '10px'}}>Limite de credito</label>
                                <TheInput
                                    val={customerData.LimiteDeCredito}
                                    numType={'real'}
                                    onchange={(e)=>{changeValuesCustomer('LimiteDeCredito', e)}}
                                />
                            </>
                        }
                    </div>
                </div>
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Ocupación</label>
                    </div>
                    <div className='Colmn2'>
                        <select id='CustomerType'
                            value={customerData.Ocupacion !== 0 ? customerData.Ocupacion: ''}
                            onChange={(e)=>{
                                const selectedOption = optionsOccupation.find(option => option.IdOcupacion === parseInt(e.target.value, 10));
                                changeValuesCustomer('Ocupacion', e.target.value);
                                //console.log("e.target.value", e.target.value)
                                //console.log("selectedOption", selectedOption.IdOcupacion)
                            }}
                            onBlur={()=>{}}>
                            <option value="" disabled>Seleccione una opción</option>
                            {optionsOccupation.map((option) => (
                                <option key={option.IdOcupacion} value={option.IdOcupacion}>{option.Ocupacion}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {customerData.Tipo === 1 &&
                    <div className='Row'>
                        <div className='Colmn1'>
                            <label>Responsabilidad fiscal</label>
                        </div>
                        <div className='Colmn2'>
                            <select id='CustomerType'
                                value={resFiscal !== '' ? resFiscal: 'Seleccione una opción'}
                                onChange={(e)=>{
                                    const selectedOption = optionsResFiscal.find(option => option.code === e.target.value);
                                    changeValuesCustomer('ResFiscal', selectedOption.code); 
                                    setResFiscal(e.target.code);
                                }}
                                onBlur={()=>{}}>
                                <option value="" disabled>Seleccione una opción</option>
                                {optionsResFiscal.map((option) => (
                                    <option key={option.code} value={option.code}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
                <div className='Row'>
                    <div className='Colmn1'>
                        <label>Notas</label>
                    </div>
                    <div className='Colmn2'>
                        <textarea
                            id='nctaId'
                            type="textbox"
                            className="taStnd ncTextArea"
                            placeholder="Notas/Detalles del cliente"
                            value={customerData.Nota}
                            onChange={(e)=>changeValuesCustomer('Nota', e.target.value)}
                        />
                    </div>
                </div>
                <div style={{marginLeft: '15.5%', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        {console.log(enableB1)}
                        <button className='btnStnd btn1'
                         style={{marginRight: '10px'}}
                         onClick={()=>{validate()}}
                         disabled={!enableB1}>
                            {someData ? 'Modificar' : 'Guardar'}
                        </button>
                        {/* {someData && <button className='btnStnd btn1'>Estado de cuenta</button>} */}{/*WIP*/}
                    </div>
                    <button className='btnStnd btn1' onClick={()=>navigate(-1)}>Cancelar</button>
                </div>
            </div>
        </section>
    );
}