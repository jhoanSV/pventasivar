import React, { useEffect, useRef, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import './_CashReconciliation.scss'
import { Flatlist} from '../../Components';
import { CRDetail, CashFlow, SalesByCategory, BestProducts } from '../../api';
import { Chart, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(ArcElement);

export function CashReconciliation() {
    const { setSection, setSomeData, usD } = useTheContext();
    const [ CRData, setCRData ] = useState({});
    const [ entradas, setEntradas ] = useState([]);
    const [ salidas, setSalidas ] = useState([]);
    const [ selectedRowEntradas, setSelectedRowEntradas ] = useState();
    const [ selectedRowSalidas, setSelectedRowSalidas ] = useState();
    const [ cash, setCash ] = useState(0);
    const [ bestPData, setBestPData ] = useState([]);
    const [ selectedPData, setSelectedPData ] = useState(0);
    const [ dataPie, setDataPie ] = useState({labels: ['Red', 'Blue', 'Yellow'], // Etiquetas para cada segmento de la torta
        datasets: [
            {
                data: [300, 50, 100], // Datos correspondientes a cada segmento
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores de cada segmento
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores al pasar el ratón
            }
        ]
    });
    const SalesData = useRef({})
    //const [ fechaSearch, setFEchaSearch ] = useState();

    useEffect(() => {
        CaschRDetail()
        setSection('Corte de caja')
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
            Fecha: date,
        })
        console.log('cashFlow: ', cashFlow)
        const filtroEntradas = cashFlow.filter( item => item.TipoDeFlujo === 0 && item.Motivo !== 'Inicio de caja')
        const filtroSalidas = cashFlow.filter( item => item.TipoDeFlujo === 1 && item.Motivo !== 'Inicio de caja')
        console.log('filtroEntradas', filtroEntradas)
        setEntradas(filtroEntradas)
        setSalidas(filtroSalidas)
        let entradasEnEfectivo = 0
        let salidasEnEfectivo = 0
        for (const row of filtroEntradas) {
            if (row.Activo = 1) {
                entradasEnEfectivo += row.Efectivo
            }
        }
        for (const row of filtroSalidas) {
            if (row.Activo = 1) {
                salidasEnEfectivo += row.Efectivo
            }
        }
        SalesData.current['entradasEnEfectivo'] = entradasEnEfectivo
        SalesData.current['salidasEnEfectivo'] = salidasEnEfectivo
        console.log('filtroSalidas', filtroSalidas)
        setCash(
            (CR['Inicio de caja'] ? CR['Inicio de caja'].Efectivo : 0) +
            (CR['Venta por caja'] ? CR['Venta por caja'].Efectivo : 0) +
            (CR['Ingreso por caja'] ? CR['Ingreso por caja'].Efectivo : 0) -
            (CR['Devolución Entrada']? CR['Devolución Entrada'].Efectivo : 0) -
            (CR['Devolución mercancia'] ? CR['Devolución mercancia'].Efectivo : 0)
          );
        setCRData(CR)
        const salesCategory = await SalesByCategory({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        console.log('salesCategory: ', salesCategory)
        const labels = await salesCategory.map(row => row.Categoria)
        const datasets = await salesCategory.map(row => row.ventas)
        //console.log('labets: ', labels)
        //console.log('datasets: ', datasets)
        const data = {
            labels: labels,//['Red', 'Blue', 'Yellow'], // Etiquetas para cada segmento de la torta
            datasets: [
                {
                    data: datasets,//[300, 50, 100], // Datos correspondientes a cada segmento
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores de cada segmento
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores al pasar el ratón
                }
            ]
        }
        setDataPie(data)
        const bestProductData = await BestProducts({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        setBestPData(bestProductData)
    }

    const PieChart = () => {
        return (
            <div style={{ width: '300px', height: '300px' }}>
                <Pie data={dataPie} />
            </div>
        );
    };

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
            defaultWidth: 250,
            type: 'text',
        },
        {
            header: 'Monto',
            key: 'Monto',
            defaultWidth: 100,
            type: 'text',
        }
    ];

    const HeadersBestProducts= [
        {
            header: 'Cod',
            key: 'Hora',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Comentarios',
            defaultWidth: 250,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        let suma = 0
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000',
            whiteSpace: 'normal',
            wordWrap: 'break-word'

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

    const RowBestProducts = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        let suma = 0
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000',
            whiteSpace: 'normal',
            wordWrap: 'break-word'

        };
        // Extraer la hora de la fecha
        const hora = new Date(item.Fecha).toLocaleTimeString('en-GB', { hour12: false });
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{item.Cod}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                </>
        );
    };

    return (
      <div>
        <div className='TwoColumns' style={{gap: '20%'}}>
            <div className='Tittles'>
                <h2>Ventas: $ {Formater((CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo + CRData['Venta por caja'].Transferencia : 0) - (CRData['Devolución mercancia'] ? CRData['Devolución mercancia'].Efectivo : 0))}</h2>
            </div>
            <div>
                <h2>Ganancia: $ {Formater((CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo + CRData['Venta por caja'].Transferencia : 0) - (CRData['']))}</h2>
            </div>
        </div>
        <div className='TwoColumns' style={{gap: '20%'}}>
            <div>
                <h3>Dinero en caja</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label style={{color: 'green', fontWeight: 'bold'}}>Inicio de caja:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Inicio de caja'] ? CRData['Inicio de caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{color: 'green', fontWeight: 'bold'}}>Ventas en efectivo:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{color: 'green', fontWeight: 'bold'}}>Entradas en efectivo:</label>
                            </td>
                            <td>
                                <label>$ {Formater(SalesData.current.entradasEnEfectivo ? SalesData.current.entradasEnEfectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{color: '#C70039', fontWeight: 'bold'}}>Salidas en efectivo:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Ingreso por caja'] ? CRData['Ingreso por caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{color: '#C70039', fontWeight: 'bold'}}>Devolución Entrada:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Devolución Entrada'] ? CRData['Devolución Entrada'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{color: '#C70039', fontWeight: 'bold'}}>Devolución mercancia:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Devolución mercancia'] ? CRData['Devolución mercancia'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label style={{fontWeight: 'bold'}}>Efectivo en caja:</label>
                            </td>
                            <td>
                                <label>$ {Formater(cash)}</label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Ventas</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label>En efectivo:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Por transferencia:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Transferencia: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Devoluciones de Mercancia:</label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Ingreso por caja'] ? CRData['Ingreso por caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                    </tbody>
                </table>          
            </div>
        </div>
        <div className='TwoColumns' style={{gap: '20%'}}>
            <div>
                <h2>Entradas en efectivo</h2>
                    <Flatlist
                        data={entradas}
                        headers={HeadersFlujo}
                        row={RowOrder}
                        selectedRow={selectedRowEntradas}
                        setSelectedRow={setSelectedRowEntradas}
                        principalColor={'#1a7124'}
                        selectedRowColor={'rgba(26, 113, 36, 0.50)'}
                        Height='150 px'
                    />
            </div>
            <div>
                <h2>Salidas en efectivo</h2>
                    <Flatlist
                        data={salidas}
                        headers={HeadersFlujo}
                        row={RowOrder}
                        selectedRow={selectedRowSalidas}
                        setSelectedRow={setSelectedRowSalidas}
                        principalColor={'#900C3F'}
                        selectedRowColor={'rgba(144, 12, 63, 0.50)'}
                        Height='150 px'
                    />
            </div>
        </div>
        <div className='TwoColumns' style={{gap: '20%'}}>
            <div>
                <h1>Cuentas por categoria</h1>
                <PieChart/>
            </div>
            <div>
                <h2>mejores productos</h2>
                    <Flatlist
                        data={bestPData}
                        headers={HeadersBestProducts}
                        row={RowBestProducts}
                        selectedRow={selectedPData}
                        setSelectedRow={setSelectedPData}
                        Height='150 px'
                    />
            </div>
        </div>
      </div>
    )
}
