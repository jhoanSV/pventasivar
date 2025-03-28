import React, { useEffect, useState } from 'react';
import "./_InvAdjustment.scss";
import { useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheAlert, TheInput } from '../../Components';
import { postUpdateInventory } from '../../api';

export function InvAdjustment(){

    const navigate = useNavigate()
    const { setSection, someData, setSomeData, invAdAuth, setInvAdAuth, usD } = useTheContext();
    const [currentC, setCurrentC] = useState('0');
    const [cantAdj, setCantAdj] = useState('');
    const [newCant, setNewCant] = useState('');
    const [taValue, setTaValue] = useState('');
    
    const Formater = (number) =>{
        if (!number) return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberfromat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }

    const adjustCant = (op, e) =>{//*operation depending on op
        let currCant = Number(currentC.replace(/\./g, ''))
        if(op==='ca'){
            setCantAdj(e)
            setNewCant(Formater(((currCant+Number(e))).toString()))
        }else if(op==='nc'){
            setCantAdj(Formater((-(currCant-Number(e))).toString()))
            setNewCant(Formater(Number(e)))
        }
    }

    const modifyCant = async() =>{
        const fecha = new Date()
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds()
        let d = someData;
        d.Inventario = Number(newCant.replace(/\./g, ''));
        console.log({
            "IdFerreteria": someData.IdFerreteria,
            "CodResponsable": usD.Cod,
            "Responsable": usD.Ferreteria,
            "ConsecutivoProd": someData.Consecutivo,
            "Cantidad": d.Inventario,
            "Fecha": today,
            "Motivo": taValue
        });
        const res = await postUpdateInventory({
            "IdFerreteria": someData.IdFerreteria,
            "CodResponsable": usD.Cod,
            "Responsable": usD.Ferreteria,
            "ConsecutivoProd": someData.Consecutivo,
            "Cantidad": d.Inventario,
            "Fecha": today,
            "Motivo": taValue
        });
        //console.log(res);
        if(res && res.message === 'Transacción completada con éxito'){
            console.log('---------------', d);
            setSomeData(d)
            TheAlert('Cantidad modificada correctamente')
            navigate(-1, {repalce: true})
        } else {
            TheAlert('Ocurrió un error inesperado, intente de nuevo más tarde');
        }
    }

    useEffect(() => {        
        setSection('Ajustes de inventario')
        if(invAdAuth){
            //* Make de query to get the current inventory quantity
            setCurrentC(Formater(someData.Inventario))
        }else{
            navigate('/', {replace: true});
            console.log('idontunderstand this');
            
        }
        return () => {
            setInvAdAuth(false);
        }
        // eslint-disable-next-line
    }, []);

    return (
        invAdAuth && 
        <section className='InvAdjustment'>
            <h1 style={{marginTop: '0px'}}>{someData.Descripcion}</h1>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Cantidad actual:</label>
                </div>
                <div className='Colmn2'>
                    <label>{currentC==='' ? 0 : currentC}</label>
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>+/-:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput
                        val={cantAdj}
                        numType={'ent'}
                        onchange={(e)=>{adjustCant('ca', e)}}
                    />
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Nueva cantidad:</label>
                </div>
                <div className='Colmn2'>
                    <TheInput
                        val={newCant}
                        numType={'ent'}
                        onchange={(e)=>{adjustCant('nc', e)}}
                    /> 
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Motivo de ajuste:</label>
                </div>
                <div className='Colmn2'>
                    <textarea
                        type="textbox"
                        className="npTextArea taStnd"
                        placeholder="Notas/Detalles del producto"
                        onChange={(e)=>setTaValue(e.target.value)}
                        value={taValue}
                    />
                </div>
            </div>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Responsable:</label>
                </div>
                <div className='Colmn2'>
                    <label>{usD.Contacto}</label>{/*No se si es el nombre del contacto o de la ferretería*/}
                </div>
            </div>
            <button
                className='btnStnd btn1'
                style={{marginRight: '10px'}}
                onClick={() => { modifyCant() }}
                disabled={
                    (cantAdj==='') ||
                    (Number(newCant.replace(/\./g, '')) === Number(currentC.replace(/\./g, ''))) ||
                    (Number(newCant.replace(/\./g, '')) < 0 ) ||
                    (taValue.length < 5)
                }
            >Modificar inventario</button>
            <button
                className='btnStnd btn1'
                onClick={() => { navigate(-1) }}
            >Cancelar</button>
        </section>
    )
}