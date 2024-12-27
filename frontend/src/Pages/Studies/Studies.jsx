import React, { useEffect, useRef, useState } from 'react';
import { useTheContext } from '../../TheProvider';
import './_Studies.scss'
import { Flatlist} from '../../Components';
import { CRDetail, CashFlow, SalesByCategory, BestProducts, Returns, Profit, StudiesQuery } from '../../api';
import { Formater } from '../../App';
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

export function Studies() {
    const [ dateSearchMin, setDateSearchMin ] = useState(new Date());
    const [ dateSearchMax, setDateSearchMax ] = useState(new Date());
    const [ selectedRowSales, setSelectedRowSales ] = useState(0);
    const [ selectedRowProfits, setSelectedRowProfits ] = useState(0);
    const [ bestPData, setBestPData ] = useState([]);
    const [ dataType, setDataType ] = useState('Week');
    const [ dataByPeriod, setDataByPeriod ] = useState({labels: ['Red', 'Blue', 'Yellow'], // Etiquetas para cada segmento de la torta
        datasets: [
            {
                data: [300, 50, 100], // Datos correspondientes a cada segmento
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores de cada segmento
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores al pasar el ratón
            }
        ]
    });
    const [ dataPie, setDataPie ] = useState({labels: ['Red', 'Blue', 'Yellow'], // Etiquetas para cada segmento de la torta
        datasets: [
            {
                data: [300, 50, 100], // Datos correspondientes a cada segmento
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colores de cada segmento
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colores al pasar el ratón
            }
        ]
    });
    const { setSection, setSomeData, usD } = useTheContext();

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
    const getCurrentWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Día de la semana (0 = domingo, ..., 6 = sábado)
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Distancia al lunes
        const monday = new Date(today); // Copia la fecha actual
        monday.setDate(today.getDate() + distanceToMonday); // Ajusta al lunes
    
        // Asignar directamente los objetos Date
        const mondayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
        const actualDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
        setDateSearchMin(mondayDate);
        setDateSearchMax(actualDate);
    };

    const getCurrentMonth = () => {
        const today = new Date();
    
        // Asignar directamente los objetos Date
        const mondayDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const actualDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
        setDateSearchMin(mondayDate);
        setDateSearchMax(actualDate);
    };

    const getCurrentYear = () => {
        const today = new Date();
    
        // Asignar directamente los objetos Date
        const mondayDate = new Date(today.getFullYear(), 0, 1);
        const actualDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
        setDateSearchMin(mondayDate);
        setDateSearchMax(actualDate);
    };

    useEffect(() => {
        UpdateStudy()
    }, [dateSearchMax, dateSearchMin])

    const UpdateStudy = async() => {
        const dateMax = dateSearchMax;
        const dateMin = dateSearchMin;

        // Obtener la fecha en formato YYYY-MM-DD
        const dateMinValue = dateMin.getFullYear() +
                            '-' + String(dateMin.getMonth() + 1).padStart(2, '0') +
                            '-' + String(dateMin.getDate()).padStart(2, '0');
        const dateMaxValue = dateMax.getFullYear() +
                            '-' + String(dateMax.getMonth() + 1).padStart(2, '0') +
                            '-' + String(dateMax.getDate()).padStart(2, '0');
        const salesCategory = await SalesByCategory({
            IdFerreteria: usD.Cod,
            FechaMin: dateMinValue,
            FechaMax: dateMaxValue
        })

        const salesPeriod = await StudiesQuery({
            IdFerreteria: usD.Cod,
            Type: dataType, 
            FechaMin: dateMinValue,
            FechaMax: dateMaxValue
        })

        const bestProductData = await BestProducts({
            IdFerreteria: usD.Cod,
            FechaMin: dateMinValue,
            FechaMax: dateMaxValue
        })
        setBestPData(bestProductData)
        console.log(bestProductData.BestProducts)
        //To the data of the studies by period
        const labelsPeroids = salesPeriod.map(row => row.DiaSemana)
        const salesPeriods = salesPeriod.map(row => row.Ventas)
        const profitsPeriods = salesPeriod.map(row => row.Ganancias)
        const dataPeriods = {
            labels: labelsPeroids,// Etiquetas para cada segmento de la torta
            datasets: [
                {
                    label: 'Ventas', // Título para las barras de ventas
                    data: salesPeriods, // Datos de ventas
                    backgroundColor: '#F2CB05', // Color de las barras de ventas
                    borderColor: '#F2CB05',
                    borderWidth: 1,
                },
                {
                    label: 'Ganancias', // Título para las barras de ganancias
                    data: profitsPeriods, // Datos de ganancias
                    backgroundColor: '#f2894f', // Color de las barras de ganancias
                    borderColor: '#f2894f',
                    borderWidth: 1,
                },
            ],
        }
        setDataByPeriod(dataPeriods)
        //To the data of the studies by category
        const labels = salesCategory.map(row => row.Categoria)
        const datasets = salesCategory.map(row => row.ventas)
        const colors = salesCategory.map(row => row.ColorCategoria)
        const profits = salesCategory.map(row => row.Ganancias)
        const darkerColors = lightenColors(colors, 10);
        const data = {
            labels: labels,// Etiquetas para cada segmento de la torta
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
    };

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

    const BarStudyByPeriots = () => {
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
                    data={dataByPeriod}
                />
            </div>
        );
    };

    const HeadersSales = [
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Descripcion',
            defaultWidth: 400,
            type: 'text',
        },
        {
            header: 'Venta',
            key: 'Venta',
            defaultWidth: 50,
            type: 'text',
        }
    ];

    const HeadersProfits = [
        {
            header: 'Cod',
            key: 'Cod',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Descripción',
            key: 'Descripcion',
            defaultWidth: 400,
            type: 'text',
        },
        {
            header: 'Ganancia',
            key: 'ganancia',
            defaultWidth: 50,
            type: 'text',
        }
    ];

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
                    <td style={{...styles, width: columnsWidth[1]}}>
                        <label>$ {Formater(item.Valor)}</label>
                    </td>
                </>
        );
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'flex-end', padding: '10px', gap: '5px'}}>
                <button
                    className="btnStnd btn1"
                    style={{backgroundColor: 'Green'}}
                    onClick={()=>{getCurrentYear(); setDataType('Year')}}
                    >
                    Año actual
                </button>
                <button
                    className="btnStnd btn1"
                    style={{backgroundColor: 'Green'}}
                    onClick={()=>{getCurrentMonth(); setDataType('Month')}}
                    >
                    Mes actual
                </button>
                <button
                    className="btnStnd btn1"
                    style={{backgroundColor: 'Green'}}
                    onClick={()=>{getCurrentWeek(); setDataType('Week')}}
                    >
                    Semana actual
                </button>
                <input
                    type="date"
                    value={formatDate(dateSearchMin)}
                    onChange={(e)=>{
                        const selectedDate = e.target.value;
                        const dateParts = selectedDate.split('-');
                        const correctedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                        setDataType('Other')
                        setDateSearchMin(correctedDate)
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
                <input
                    type="date"
                    value={formatDate(dateSearchMax)}
                    onChange={(e)=>{
                        const selectedDate = e.target.value;
                        const dateParts = selectedDate.split('-');
                        const correctedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                        setDataType('Other')
                        setDateSearchMax(correctedDate)
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
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '70vh'           // Ocupa toda la altura de la ventana
                }}>
                <h1>ventas/ganancias por periodo</h1>
                <BarStudyByPeriots/>
            </div>
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Coloca los elementos en columna
                    alignItems: 'center',    // Centra horizontalmente
                    justifyContent: 'center', // Centra verticalmente
                    height: '70vh'           // Ocupa toda la altura de la ventana
                }}>
                <h1>Ventas/ganancias por categoria</h1>
                <PieChart/>
            </div>
            <div className='TwoColumns' style={{gap: '5%', margin: '15px'}}>
                <div style={{
                        display: 'flex',
                        flexDirection: 'column', // Coloca los elementos en columna
                        alignItems: 'center',    // Centra horizontalmente
                        justifyContent: 'center', // Centra verticalmente
                        height: '50vh'           // Ocupa toda la altura de la ventana
                    }}>
                    <h2>Productos mas vendidos</h2>
                        <Flatlist
                            data={bestPData.BestProducts}
                            headers={HeadersSales}
                            row={RowBestProducts}
                            selectedRow={selectedRowSales}
                            setSelectedRow={setSelectedRowSales}
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
                    <h2>Productos con mas ganancia</h2>
                        <Flatlist
                            data={bestPData.BestProfits}
                            headers={HeadersProfits}
                            row={RowBestProducts}
                            selectedRow={selectedRowProfits}
                            setSelectedRow={setSelectedRowProfits}
                            principalColor={'#900C3F'}
                            selectedRowColor={'rgba(144, 12, 63, 0.50)'}
                            Height='70 px'
                        />
                </div>
            </div>
        </div>
    )
}