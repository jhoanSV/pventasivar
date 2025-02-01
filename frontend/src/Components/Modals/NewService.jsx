import React, { useState, useEffect} from 'react';
import './_NewService.scss'
import { TheInput } from '../../Components/InputComponent/TheInput';
import { UserConfirm } from './UserConfirm';
import { useTheContext } from '../../TheProvider';
import { TheAlert } from '../TheAlert';
import { Formater } from '../../App';

export const NewService = ({show, width='500px', height='350px', AddService}) => {
    const [ colorPventa, setColorPVenta ] = useState('black');
    const [ pctGan, setpctGan] = useState('');
    const [ serviceData, setServiceData ] = useState({
        Categoria: "SERVICIOS",
        Clase: 0,
        Cod: "SERVICIOS",
        Consecutivo: 1,
        Descripcion: "",
        Detalle: "",
        ExisteEnDetalle: 1,
        IdCategoria: 13,
        IdFerreteria: 0,
        IdSubCategoria: 135,
        InvMaximo: 1,
        InvMinimo: 1,
        Inventario: 100,
        Iva: 19,
        Medidas: [],
        PCosto: '',
        PVenta: '',
        SubCategoria: "SERVICIOS",
        Ubicacion: "",
        key: 0,
    });

    const changeValuesProducts = (key, value) => {
        //This function allows us to change the one specific value in the product data
        setServiceData(prevValue => ({
            ...prevValue, // Copia los valores anteriores
            [key]: value // Reemplaza el valor de la clave específica
        }));
        //theSomeData.current[key] = value;
    }

    const calpctC = (e) => {
        let thePcosto = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePventa = serviceData.PVenta !== '' ? Number(serviceData.PVenta.replace(/[.,]/g, (a) => (a === "." ? "" : "."))) : 0
        let pct = ((thePventa - thePcosto) / thePcosto) * 100;
        pct = pct % 1 === 0 ? pct : pct.toFixed(2);
        //pct = pct.replace(/\./g, ',');
        setpctGan(Formater(pct));
    }
    
    const calpventa = (e) => {
        let Epct = e.replace(/[.,]/g, (a) => (a === "," && "."))
        let thePcosto = Number(serviceData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        let newPventa = (thePcosto + (thePcosto * Epct / 100)).toFixed(2).toString();
        changeValuesProducts('PVenta', newPventa);
    }

    const calpctV = (e) => {
        let thePventa = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePcosto = Number(serviceData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
        let pct = (((thePventa - thePcosto) / thePcosto) * 100)
        pct = pct % 1 === 0 ? pct : pct.toFixed(2);
        //pct = pct.replace(/\./g, ',');
        setpctGan(pct);
    }

    useEffect(() => {
        console.log('Entro a servicios')
    }, [])

    const sendService = () => {
        let missing = '';
        if (serviceData.Descripcion === '') {
            missing = 'Descripcion'
        } else if (serviceData.PCosto === '') {
            missing = 'Costo'
        } else if (serviceData.PVenta === '') {
            missing = 'Venta'
        }
        if (missing!== '') {
            TheAlert(`Falta ingresar el campo ${missing}.`)
            return;
        } else {
            AddService(serviceData);
            show(false)
        }
    }

    return (
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: width, height: height, position: 'relative'}}>
                <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                    <i className='bi bi-x-lg'/>
                </button>
                <div className='subTittle' style={{background: `linear-gradient(to right, #193773, #FFFFFF)`, borderRadius: '10px 10px 0 0'}}>
                    <h1>Cobro de servicios</h1>
                </div>
                <div className='theModal-body'>
                    <h3>Descripción:</h3>
                    <textarea
                        type='text'
                        value={serviceData.Descripcion}
                        style={{backgroundColor: '#d9d9d9', resize: 'none', width: '100%', border: 'none'}}
                        onChange={e => changeValuesProducts('Descripcion', e.target.value)}
                        autoComplete='off'
                        autoFocus
                    />
                    <div className='twoColumnsContainer' >
                        <div className='Col'>
                            <label style={{padding: '6px', margin: '2px'}}><strong>Costo:</strong></label>
                            <label style={{padding: '6px', margin: '2px'}}><strong>% Ganancia:</strong></label>
                            <label style={{padding: '6px', margin: '2px'}}><strong>Precio de venta:</strong></label>
                        </div>
                        <div className='Col'>
                            <div style={{margin: '2px'}}>
                                <TheInput
                                    val={serviceData.PCosto}
                                    numType={'real'}
                                    onchange={(e) => {  changeValuesProducts('PCosto', e); calpctC(e) }}
                                />
                            </div>
                            <div style={{margin: '2px'}}>
                                <TheInput
                                    val={pctGan}
                                    numType={'real'}
                                    onchange={(e) => { setpctGan(e); calpventa(e)}}
                                />
                            </div>
                            <div style={{margin: '2px'}}>
                                <TheInput
                                    val={serviceData.PVenta}
                                    numType={'real'}
                                    sTyle={{color: colorPventa}}
                                    onchange={(e) => {
                                        changeValuesProducts('PVenta', e); 
                                        calpctV(e);
                                        if (parseFloat(serviceData.PCosto) > parseFloat(e)) {
                                            setColorPVenta('red')
                                        } else {
                                            setColorPVenta('black')
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex', // Activa Flexbox
                        justifyContent: 'center', // Centra los botones horizontalmente
                        alignItems: 'center', // Centra los botones verticalmente (si el contenedor tiene altura)
                        gap: '20px', // Espacio entre los botones
                        margin: '10px'
                    }}>
                        <button className='btnStnd btn1' onClick={() => {sendService()}}>Aceptar</button>
                        <button className='btnStnd Exit' onClick={() => show(false)}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}