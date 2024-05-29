import React, { useEffect, useState } from 'react';
import "./_InvAdjustment.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheContext } from '../../TheProvider';
import { TheInput } from '../../Components';

export function InvAdjustment(){

    const navigate = useNavigate()
    const { setSection, someData, invAdAuth, setInvAdAuth } = useTheContext();
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
        }
    }

    const modifyCant = () =>{
        let d = someData;
        d.inventario = Number(newCant.replace(/\./g, ''));
        console.log(newCant);
        //setSomeData(d)
    }

    useEffect(() => {        
        setSection('Ajustes de inventario')
        if(invAdAuth){
            //* Make de query to get the current inventory quantity
            setCurrentC(Formater(someData.inventario))
        }else{
            navigate('/', {replace: true});
        }
        return () => {
            setInvAdAuth(false)
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(!location.state){
            console.log('hptaaaaaaaa');        
            navigate('/', {replace: true});
            //navigate(location.pathname, {replace: true});
        }
    }, [location, navigate]);

    return (
        invAdAuth && 
        <section className='InvAdjustment'>
            <h1>{someData.descripcion}</h1>
            <div className='Row'>
                <div className='Colmn1'>
                    <label>Cantidad actual:</label>
                </div>
                <div className='Colmn2'>
                    <label>{currentC}</label>
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
                    <label>bla</label>
                </div>
            </div>
            <button
                className='btnStnd btn1'
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