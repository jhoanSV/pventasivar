import React, { useEffect, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import { Flatlist} from '../../Components';
import { CRDetail, CashFlow } from '../../api';
export function CashReconciliation() {
    const { setSection, setSomeData, usD } = useTheContext();
    const [ CRData, setCRData ] = useState({});
    const [ entradas, setEntradas ] = useState([]);
    const [ salidas, setSalidas ] = useState([]);
    const [ selectedRowEntradas, setSelectedRowEntradas ] = useState();
    const [ selectedRowSalidas, setSelectedRowSalidas ] = useState();
    //const [ fechaSearch, setFEchaSearch ] = useState();

    useEffect(() => {
        console.log('CashReconciliation')
        CaschRDetail()
    }, [])
    
    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const CaschRDetail = async()=>{
        const now = new Date();
        // Obtener la fecha en formato YYYY-MM-DD
        const date = now.toISOString().split('T')[0];
        // Obtener la hora en formato HH:MM:SS
        const time = now.toTimeString().split(' ')[0];
        const CR = await CRDetail({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        const cashFlow = await CashFlow({
            IdFerreteria: usD.Cod,
            Fecha: new Date().toISOString().split('T')[0],
        })
        console.log('cashFlow: ', cashFlow)
        const filtroEntradas = cashFlow.filter( item => item.TipoDeFlujo === 0 && item.Motivo !== 'Inicio de caja')
        const filtroSalidas = cashFlow.filter( item => item.TipoDeFlujo === 1 && item.Motivo !== 'Inicio de caja')
        setEntradas(filtroEntradas)
        setSalidas(filtroSalidas)
        console.log('RC: ', CR)
        setCRData(CR)
    }


    const HeadersFlujo = [
        {
            header: 'Hora',
            key: 'Hora',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Comentario',
            key: 'Comentarios',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Monto',
            key: 'Monto',
            defaultWidth: 50,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        let suma = 0
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000'
        };
        // Extraer la hora de la fecha
        const hora = new Date(item.Fecha).toLocaleTimeString('en-GB', { hour12: false });
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{hora}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <label>{item.Comentarios}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[2]}}>
                        <label>$ {Formater(item.Efectivo)}</label>
                    </td>
                </>
        );
    };

    return (
      <div>
        <div>   
            <h2>Ventas:</h2>
            <h2></h2>
            <h2>Ganancia:</h2>
            <h2></h2>
        </div>
        <div>
            <h1>Dinero en caja</h1>
            <label>Inicio de caja:</label>
            <label>$ {Formater(CRData['Inicio de caja'] ? CRData['Inicio de caja'].Efectivo: 0)}</label>
            <label>Venta por caja:</label>
            <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo: 0)}</label>
            <label>Ingreso por caja:</label>
            <label>$ {Formater(CRData['Ingreso por caja'] ? CRData['Ingreso por caja'].Efectivo: 0)}</label>
            <label>Devolución Entrada:</label>
            <label>$ {Formater(CRData['Devolución Entrada'] ? CRData['Devolución Entrada'].Efectivo: 0)}</label>
            <label>Devolución mercancia:</label>
            <label>$ {Formater(CRData['Devolución mercancia'] ? CRData['Devolución mercancia'].Efectivo: 0)}</label>
        </div>
        <div>
            <h1>Ventas</h1>
            <label>En efectivo:</label>
            <label>$ {Formater(CRData['Inicio de caja'] ? CRData['Inicio de caja'].Efectivo: 0)}</label>
            <label>Por transferencia:</label>
            <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo: 0)}</label>
            <label>Devoluciones de Mercancia:</label>
            <label>$ {Formater(CRData['Ingreso por caja'] ? CRData['Ingreso por caja'].Efectivo: 0)}</label>
        </div>
        <div>
            <h1>Entradas en efectivo</h1>
                <Flatlist
                    data={entradas}
                    headers={HeadersFlujo}
                    row={RowOrder}
                    selectedRow={selectedRowEntradas}
                    setSelectedRow={setSelectedRowEntradas}
                />
        </div>
        <div>
            <h1>Salidas en efectivo</h1>
                <Flatlist
                    data={salidas}
                    headers={HeadersFlujo}
                    row={RowOrder}
                    selectedRow={selectedRowSalidas}
                    setSelectedRow={setSelectedRowSalidas}
                />
        </div>
        <div>
            <h1>Cuentas por categoria</h1>
        </div>
      </div>
    )
}
