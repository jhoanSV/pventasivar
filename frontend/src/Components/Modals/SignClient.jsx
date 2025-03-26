import React, {useEffect, useState, useRef} from 'react';
import { TableComponent, TheAlert } from '../../Components';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';
import { Clientlist } from '../../api';
import jsonTest from '../../jsonTest.json';

export const SignClient = ({show, retornar, width='50%', height='80%'}) => {
    const [ selected, setSelected] = useState([]);
    const [ multiSelect, setMultiSelect] = useState(false);
    const [ contentList, setContentList] = useState(jsonTest);
    const { setSection, setSomeData, usD } = useTheContext();
    const [ showCustomerList , setShowCustomerList] = useState(true)
    const refList = useRef([]);
    // para crear un nuevo cliente
    const [cType, setCType] = useState();
    const [conCredito, setConCredito] = useState(false);
    const [value, setValue] = useState('');
    const [verCod, setVerCod] = useState('');//* verificationCode
    const [creLim, setCreLim] = useState();//* credit limit
    
    const ctHeaders = [
        {
            header: 'ID/NIT',//*Nombre de cabecera
            key: 'NitCC',//*llave para acceder al dato del JSON
            defaultWidth: '131px',//*Ancho por defecto
            type: 'text',//*Tipo de celda
        },
        {
            header: 'Nombre',
            key: 'Nombre',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Apellidos',
            key: 'Apellido',
            defaultWidth: '223px',
            type: 'text',
        },
        {
            header: 'Telefono 1',
            key: 'Telefono1',
            defaultWidth: '135.5px',
            type: 'text',
        },
        {
            header: 'E-mail',
            key: 'Correo',
            defaultWidth: '135.5px',
            type: 'text',
        }
    ]

    const filterByText = (item, text) =>
        item.NitCC.toLowerCase().includes(text) ||
        item.Nombre.toLowerCase().includes(text) ||
        item.Apellido.toLowerCase().includes(text) ||
        item.Barrio.toLowerCase().includes(text) ||
        item.Correo.toLowerCase().includes(text);

    const SearchHandle = async(text) =>{
        const AllCustomerList = await Clientlist({
            "IdFerreteria" : usD.Cod
        })
        let c = AllCustomerList;
        if (text !== ''){
            c = c.filter((i)=>filterByText(i, text))
            setContentList(c)
        }else{
            setContentList(AllCustomerList)
        }
    }

    useEffect(() => {
        setSomeData(null)
        CustomerFetch()
        // eslint-disable-next-line
    }, []);

    const verFunction = (item) => {
        retornar(selected)
        show(false)
    }

    const CustomerFetch = async() =>{
        const listado = await Clientlist({
            "IdFerreteria" : usD.Cod
        })
        if(listado){
            setContentList(listado)
            refList.current = listado;
        };
    }

    const customerList = () => {
        return (
            <>
                <div>
                    <label>Filtrar/Buscar: </label>
                    <input type="text" style={{width: '56%'}}
                        onChange={(e)=>{SearchHandle((e.target.value).toLowerCase())}}
                    />
                </div>
                <TableComponent
                    data={contentList}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    doubleClickFunct={verFunction}
                />
                <button
                    className="btnStnd btn1"
                    onClick={()=>setShowCustomerList(false)}>Crear cliente</button>
            </>
        )
    };

    const CreateCustomerForm = ({cType, conCredito, setConCredito, value, setValue, verCod, setVerCod, creLim, setCreLim}) => {
        const { setSection, someData } = useTheContext();
        
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
            TheAlert(regex.test(document.getElementById('emailId').value))
        }
        
        const Formater = (number) =>{
            return Intl.NumberFormat().format(number);
        }

        useEffect(() => {
            setSection('Nuevo cliente')

            if(someData){
                let data = someData
                if(data['ctype']==='cc'){
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
                            style={{marginRight: '10px'}} onClick={()=>{validate()}}>{someData ? 'Modificar' : 'Guardar'}</button>
                            {someData && <button className='btnStnd btn1'>Estado de cuenta</button>}
                        </div>
                        <button className='btnStnd btn1' onClick={()=>navigate(-1)}>Cancelar</button>
                    </div>
                </div>
            </section>
        )
    };

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='theModal-body'>
                    {showCustomerList ? customerList() : CreateCustomerForm(cType={cType}, conCredito={conCredito}, setConCredito={setConCredito}, value={value}, setValue={setValue}, verCod={verCod}, setVerCod={setVerCod}, creLim={creLim}, setCreLim={setCreLim})}
                </div>
            </div>
        </div>
    );
}