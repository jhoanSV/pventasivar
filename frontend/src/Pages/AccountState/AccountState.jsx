import React, { useEffect, useState } from 'react';
import './_AccountState.scss';
import { useTheContext } from '../../TheProvider';
import { TableComponent, TheAlert } from '../../Components';
import fctsTest from './fctsTest.json';

export const AccountState = () => {
    
    const { setSection } = useTheContext()
    const [selected, setSelected] = useState([]);

    const verFunction = () =>{
        TheAlert('viendo jsjs')
    }
    
    const ctHeaders = [
        {
            header: 'Folio',
            key: 'consecutivo',
            defaultWidth: '131px',
            type: 'text',
        },{
            header: 'Fecha',
            key: 'fecha',
            defaultWidth: '131px',
            type: 'text',
        },{
            header: 'Valor',
            key: 'valor',
            defaultWidth: '131px',
            type: 'text',
        },
    ]
    
    useEffect(() => {
        setSection('Estado de cuenta')

        // eslint-disable-next-line
    }, []);

    return (
        <section className='AcState'>
            <div className='acNameContainer'>
                <div className='acnc'>Nombre del cliente</div>
                <div className='accic'>CC. 000.000.000</div>
            </div>
            <div className='acDiv2'>
                <label>
                    Saldo Actual: ${'160.000'}
                </label>
                <label>
                    Limite de credito: ${"10'000.000"}
                </label>
                <label>
                    Credito disponible: ${"9'840.000"}
                </label>
            </div>
            <div style={{width: 'auto', maxWidth: '850px',  margin: '0px auto', display: 'flex'}}>
                <TableComponent
                    data={fctsTest}
                    headers={ctHeaders}
                    selected={selected}
                    setSelected={setSelected}
                    multiSelect={false}
                    doubleClickFunct={verFunction}
                />
                <div className='acsOptions'>
                    <button className='btnStnd btn1'>
                        Abonar
                    </button>
                    <button className='btnStnd btn1'>
                        Detalle de Abonos
                    </button>
                    <button className='btnStnd btn1'>
                        Imprimir Estado
                    </button>
                    <button className='btnStnd btn1'>
                        Imprimir Estado Completo
                    </button>
                    <button className='btnStnd btn1'>
                        Liquidar Adeudo
                    </button>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <label htmlFor="mostrarVentasId">Mostrar Ventas</label>
                        <select name="showSales" id="mostrarVentasId" style={{backgroundColor: '#193773'}}></select>
                    </div>
                </div>
            </div>
        </section>
    );
}