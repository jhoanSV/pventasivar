import React, { useEffect, useRef, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import './_CashReconciliation.scss'
import { Flatlist} from '../../Components';
import { CRDetail, CashFlow, SalesByCategory, BestProducts, Returns, Profit } from '../../api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function CashReconciliation() {
    const { setSection, usD } = useTheContext();
    const [ CRData, setCRData ] = useState({});
    const [ entradas, setEntradas ] = useState([]);
    const [ salidas, setSalidas ] = useState([]);
    const [ selectedRowEntradas, setSelectedRowEntradas ] = useState();
    const [ selectedRowSalidas, setSelectedRowSalidas ] = useState();
    const [ cash, setCash ] = useState(0);
    const [ bestPData, setBestPData ] = useState([]);
    const [ selectedPData, setSelectedPData ] = useState(0);
    const [ selectedReturn, setSelectedReturn ] = useState(0);
    const [ returnsData, setReturnsData ] = useState([]);
    const [ ganancias, setGanancias ] = useState(0);
    const [ dateSearch, setDateSearch ] = useState(new Date())
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

    useEffect(() => {
        CaschRDetail()
    }, [dateSearch])
    
    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    // Función para convertir hexadecimal a RGB
    const hexToRgb = (hex) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    };

    // Función para convertir RGB a hexadecimal
    const rgbToHex = (r, g, b) => {
        const hex = (n) => {
            const h = n.toString(16);
            return h.length === 1 ? '0' + h : h;
        };
        return '#' + hex(r) + hex(g) + hex(b);
    };

    // Función para aclarar un color
    const lightenColor = (hex, factor) => {
        const { r, g, b } = hexToRgb(hex);
        // Aumentar el valor de cada componente RGB
        const lighten = (value) => Math.min(255, value + factor); 
        const newR = lighten(r);
        const newG = lighten(g);
        const newB = lighten(b);
        return rgbToHex(newR, newG, newB);
    };

    // Función para obtener 5 tonos más claros de un color
    const lightenColors = (colors, factor) => {
        return colors.map(color => lightenColor(color, factor)); // Devuelve el color aclarado 5 veces
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };

    const CaschRDetail = async()=>{
        // Obtener la fecha en formato YYYY-MM-DD
        const date = dateSearch.getFullYear() +
                            '-' + String(dateSearch.getMonth() + 1).padStart(2, '0') +
                            '-' + String(dateSearch.getDate()).padStart(2, '0');
        const CR = await CRDetail({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        const cashFlow = await CashFlow({
            IdFerreteria: usD.Cod,
            Fecha: date
        })

        const profitData = await Profit({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        setGanancias(profitData[0].Ganancia)
        //console.log('profitData: ', profitData[0].Ganancia)
        const filtroEntradas = cashFlow.filter( item => item.TipoDeFlujo === 0 && item.Motivo !== 'Inicio de caja')
        const filtroSalidas = cashFlow.filter( item => item.TipoDeFlujo === 1 && item.Motivo !== 'Inicio de caja')
        //console.log('filtroEntradas', filtroEntradas)
        setEntradas(filtroEntradas)
        setSalidas(filtroSalidas)
        let entradasEnEfectivo = 0
        let salidasEnEfectivo = 0
        for (const row of filtroEntradas) {
            if (row.Activo = 1 && row.TipoDeFlujo === 0) { 
                entradasEnEfectivo += row.Efectivo
            }
        }
        for (const row of filtroSalidas) {
            if (row.Activo = 1 && row.TipoDeFlujo === 1) {
                salidasEnEfectivo += row.Efectivo
            }
        }
        SalesData.current['entradasEnEfectivo'] = entradasEnEfectivo
        SalesData.current['salidasEnEfectivo'] = salidasEnEfectivo
        //console.log('filtroSalidas', filtroSalidas)
        setCash(
            (CR['Inicio de caja'] ? CR['Inicio de caja'].Efectivo : 0) +
            (CR['Venta por caja'] ? CR['Venta por caja'].Efectivo : 0) +
            (SalesData.current.entradasEnEfectivo ? SalesData.current.entradasEnEfectivo: 0)-
            (SalesData.current.salidasEnEfectivo ? SalesData.current.salidasEnEfectivo: 0) -
            (CR['Devolución Entrada']? CR['Devolución Entrada'].Efectivo : 0) -
            (CR['Devolución mercancia'] ? CR['Devolución mercancia'].Efectivo : 0)
          );
        setCRData(CR)
        const salesCategory = await SalesByCategory({
            IdFerreteria: usD.Cod,
            FechaMin: date,
            FechaMax: date
        })
        const retunData = await Returns({
            IdFerreteria: usD.Cod,
            Fecha: date
        })
        //console.log('salesCategory: ', salesCategory)
        setReturnsData(retunData)
        const labels = salesCategory.map(row => row.Categoria)
        const datasets = salesCategory.map(row => row.ventas)
        const colors = salesCategory.map(row => row.ColorCategoria)
        const profits = salesCategory.map(row => row.Ganancias)
        const darkerColors = lightenColors(colors, 10);
        const data = {
            labels: labels,//['Red', 'Blue', 'Yellow'], // Etiquetas para cada segmento de la torta
            datasets: [
                {
                    label: 'Ventas', // Título para las barras de ventas
                    data: datasets, // Datos de ventas
                    backgroundColor: colors, // Color de las barras de ventas
                    borderColor: colors,
                    borderWidth: 1,
                },
                {
                    label: 'Ganancias', // Título para las barras de ganancias
                    data: profits, // Datos de ganancias
                    backgroundColor: darkerColors, // Color de las barras de ganancias
                    borderColor: darkerColors,
                    borderWidth: 1,
                },
            ],
        }
        setDataPie(data)
        const bestProductData = await BestProducts({
            IdFerreteria: usD.Cod,
            FechaMin: date,
            FechaMax: date
        })
        setBestPData(bestProductData)
    }

    const PieChart = () => {
        return (
            <div
                style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center'
                }}>
                <Bar
                    data={dataPie}
                />
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
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Comentarios',
            defaultWidth: 350,
            type: 'text',
        }
    ];

    const HeadersReturn = [
        {
            header: 'Consecutivo',
            key: 'Consecutivo',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Cantidad',
            key: 'Cantidad',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: 100,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Descripción',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'Valor',
            key: 'Valor',
            defaultWidth: 100,
            type: 'text',
        },
        ,
        {
            header: 'Hora',
            key: 'Hora',
            defaultWidth: 100,
            type: 'text',
        }
    ];

    const RowOrder = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
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
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000',
            whiteSpace: 'normal',
            wordWrap: 'break-word'

        };
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

    const RowReturn = (item, index, columnsWidth) => {
        //const [changeVrVenta, setChangeVrVenta] = useState(false)
        const styles = {
            textDecoration: item.Activo === 0 ? 'line-through' : 'none',
            color: item.Activo === 0 ? '#999999' : '#000000',
            whiteSpace: 'normal',
            wordWrap: 'break-word'

        };
        // Extraer la hora de la fecha
        const fecha = new Date(item.Fecha)
        const hora = String(fecha.getHours()).padStart(2, '0') +
                    ':' + String(fecha.getMinutes()).padStart(2, '0') +
                    ':' + String(fecha.getSeconds()).padStart(2, '0');
        return (
                <>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{item.ConsecutivoCV}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <label>{item.Cantidad}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{item.Cod}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <label>{item.Descripcion}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{item.Valor}</label>
                    </td>
                    <td style={{...styles, width: columnsWidth[0]}}>
                        <label>{hora}</label>
                    </td>
                </>
        );
    };

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'flex-end', padding: '10px', gap: '5px'}}>
            <input
                type="date"
                value={formatDate(dateSearch)}
                onChange={(e)=>{
                    const selectedDate = e.target.value;
                    const dateParts = selectedDate.split('-');
                    const correctedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    setDateSearch(correctedDate)
                }}
                max={(() => {
                    // Obtener la fecha actual en la zona horaria local
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
                    const day = String(today.getDate()).padStart(2, '0');
                    // Formatear la fecha como 'YYYY-MM-DD' en la zona horaria local
                    return `${year}-${month}-${day}`;
                })()}
            />
        </div>
        <div className='TwoColumns' style={{gap: '20%'}}>
            <div className='Tittles'>
                <h2><strong>Ventas: $ {Formater((CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo + CRData['Venta por caja'].Transferencia : 0) - (CRData['Devolución mercancia'] ? CRData['Devolución mercancia'].Efectivo : 0))} </strong></h2>
            </div>
            <div>
                <h2><strong>Ganancia:  $ {Formater(ganancias)}</strong></h2>
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
                                <label>$ {Formater(SalesData.current.salidasEnEfectivo ? SalesData.current.salidasEnEfectivo: 0 )}</label>
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
                                <label><strong>En efectivo:</strong></label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label><strong>Por transferencia:</strong></label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Venta por caja'] ? CRData['Venta por caja'].Transferencia: 0)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label><strong>Devoluciones de Mercancia:</strong></label>
                            </td>
                            <td>
                                <label>$ {Formater(CRData['Devolución mercancia'] ? CRData['Devolución mercancia'].Efectivo: 0)}</label>
                            </td>
                        </tr>
                    </tbody>
                </table>          
            </div>
        </div>
        <div className='TwoColumns' style={{gap: '10%'}}>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '50vh'           // Ocupa toda la altura de la ventana
                }}>
                <h2>Entradas en efectivo</h2>
                    <Flatlist
                        data={entradas}
                        headers={HeadersFlujo}
                        row={RowOrder}
                        selectedRow={selectedRowEntradas}
                        setSelectedRow={setSelectedRowEntradas}
                        principalColor={'#1a7124'}
                        selectedRowColor={'rgba(26, 113, 36, 0.50)'}
                        Height='80 px'
                    />
            </div>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '50vh'           // Ocupa toda la altura de la ventana
                }}>
                <h2>Salidas en efectivo</h2>
                    <Flatlist
                        data={salidas}
                        headers={HeadersFlujo}
                        row={RowOrder}
                        selectedRow={selectedRowSalidas}
                        setSelectedRow={setSelectedRowSalidas}
                        principalColor={'#900C3F'}
                        selectedRowColor={'rgba(144, 12, 63, 0.50)'}
                        Height='70 px'
                    />
            </div>
        </div>
        <div 
            style={{
                display: 'flex',
                flexDirection: 'column', // Coloca los elementos en columna
                alignItems: 'center',    // Centra horizontalmente
                justifyContent: 'center', // Centra verticalmente
                height: '70vh'           // Ocupa toda la altura de la ventana
            }}>
            <h1>Cuentas por categoria</h1>
            <PieChart/>
        </div>
        <div className='TwoColumns' style={{gap: '2%', paddingBottom: '15px'}}>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '50vh'           // Ocupa toda la altura de la ventana
                }}>
                <h2>Devoluciones</h2>
                    <Flatlist
                        data={returnsData}
                        headers={HeadersReturn}
                        row={RowReturn}
                        selectedRow={selectedReturn}
                        setSelectedRow={setSelectedReturn}
                        Height='100 px'
                    />
            </div>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '50vh'          // Ocupa toda la altura de la ventana
                }}>
                <h2>mejores productos</h2>
                    <Flatlist
                        data={bestPData.BestProducts}
                        headers={HeadersBestProducts}
                        row={RowBestProducts}
                        selectedRow={selectedPData}
                        setSelectedRow={setSelectedPData}
                        Height='100 px'
                    />
            </div>
        </div>
      </div>
    )
}
