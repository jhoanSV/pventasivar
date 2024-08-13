import React, { useEffect, useState } from 'react';
import { TheInput } from '../InputComponent';

export const GranelModal = ({show, productData, pctGan, updtState}) => {
    
    const Formater = (number) =>{
        if (!number) return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberformat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberformat.toFixed(2));
    }

    //console.log(Number(pctGan.replace(/[.,]/g, (a) => (a === "." ? "" : "."))))
    //console.log(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, ''));
    //const [cUnit, setcUnit] = useState((typeof(productData.PCosto) !== 'number') ? (productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, '')) : Formater(productData.PCosto/productData.UMedida));
    const [cUnit, setcUnit] = useState(0);
    console.log(productData.Medidas);
    const [medidas, setMedidas] = useState(productData.Medidas.length === 0 ? [{}] : productData.Medidas);
    const [pVentaUnit, setPVentaUnit] = useState(productData.PVentaUM);
    const [pctUnit, setPctUnit] = useState(productData.PVentaUM ? 
        Formater((((pVentaUnit.replace(/\./g, '')-cUnit)/cUnit)*100).toFixed(2))
        :
        ''
    )
    //const [tabRow, setTabRow] = useState(medidas);

    /*const handleMedUnit = (e) =>{
        updtState('UMedida', e);
        (typeof(productData.PCosto) !== 'number') ? setcUnit(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/e) : setcUnit(productData.PCosto/e)
    }*/

    const handleMeasureChange = (e) =>{
        updtState('Clase', Number(e.target.value));
        let a = {...productData};
        if(Number(e.target.value) === 0){
            a.Medidas = []
            updtState('Medidas', a.Medidas)
        }else if(Number(e.target.value) === 1){
            a.Medidas = [
                {
                    Medida: 'Paquete',
                    UMedida: '1',
                    PVentaUM: productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))
                },
                {
                    Medida: 'Unidades',
                    UMedida: '',
                    PVentaUM: '',
                }
            ];
            updtState('Medidas', a.Medidas)
        }
    }

    const calpct = (e) =>{
        let thePventa = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")))
        let thePcosto = cUnit
        let pct = (((thePventa-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setPctUnit(Formater(pct))
    }

    const calcPVU = (e) =>{
        let thepct = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let thePcosto = Number(cUnit);
        let newPventa = (thePcosto + (thePcosto*thepct/100)).toFixed(2).toString();
        updtState('PVentaUM', Formater(newPventa));
        setPVentaUnit(Formater(newPventa));
    }

    // useEffect(() => {
    //     if(Number(productData.Clase) === 1){
    //         setTabRow([
    //             {
    //                 Medida: 'Paquete',
    //                 UMedida: '1',
    //                 PVentaUM: '',
    //             },
    //             {
    //                 Medida: 'Unidades',
    //                 UMedida: '',
    //                 PVentaUM: '',
    //             }
    //         ]);
    //     }
    //     if(Number(productData.Clase) === 3){
    //         setTabRow([
    //             {
    //                 Medida: 'Bulto',
    //                 UMedida: '1',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Medio Bulto',
    //                 UMedida: '',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Arrobas',
    //                 UMedida: '',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Kilos',
    //                 UMedida: '',
    //                 PVentaUM: ''
    //             }
    //         ]);
    //     }
    //     if(Number(productData.Clase) === 4){
    //         setTabRow([
    //             {
    //                 Medida: 'Metros',
    //                 UMedida: '1',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Carretilla',
    //                 UMedida: '4',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Lona',
    //                 UMedida: '12',
    //                 PVentaUM: ''
    //             },
    //             {
    //                 Medida: 'Pala',
    //                 UMedida: '72',
    //                 PVentaUM: ''
    //             }
    //             ])
    //     }
    //     // eslint-disable-next-line
    // }, [productData]);

    useEffect(() => {
        console.log('mm?: ' + (Number(productData.Clase)));
        if(Number(productData.Clase) === 0){
            setMedidas((a) =>{
                a = [{}];
                //updtState('Medidas', a);
                return(a);
            })
        }else if(Number(productData.Clase) === 1){
            setMedidas((a) =>{
                a = [
                    {
                        Medida: 'Paquete',
                        UMedida: '1',
                        PVentaUM: '',
                    },
                    {
                        Medida: 'Unidades',
                        UMedida: '',
                        PVentaUM: '',
                    }
                ];
                //updtState('Medidas', a);
                return(a);
            })
        }else if(Number(productData.Clase) === 2){
            setMedidas((a) =>{
                a = [
                    {
                        Medida: 'Completo',
                        UMedida: '1',
                        PVentaUM: '',
                    },
                    {
                        Medida: 'Metros',
                        UMedida: '',
                        PVentaUM: '',
                    }
                ];
                //updtState('Medidas', a);
                return(a);
            })
        }else if(Number(productData.Clase) === 3){
            setMedidas((a) =>{
                a = [
                    {
                        Medida: 'Bulto',
                        UMedida: '1',
                        PVentaUM: ''
                    },
                    {
                        Medida: 'Medio Bulto',
                        UMedida: '',
                        PVentaUM: ''
                    },
                    {
                        Medida: 'Arrobas',
                        UMedida: '',
                        PVentaUM: ''
                    },
                    {
                        Medida: 'Kilos',
                        UMedida: '',
                        PVentaUM: ''
                    }
                ];
                //updtState('Medidas', a);
                return(a);
            })                        
        }

        // eslint-disable-next-line
    }, [productData]);

    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    return(
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: 'max-content', position: 'relative'}}>
                <div className='theModal-body'>
                    <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <h1>{productData.Descripcion}</h1>
                    <h1>{productData.Cod}</h1>
                    <div className='Row' style={{marginBottom: '10px'}}>
                        <span style={{width: '134px', textAlign: 'end', marginRight: '10px'}}>
                            Unidad de medida:
                        </span>
                        {productData.Clase !== 4 ?
                            <>
                                <select value={productData.Clase} name='medida'
                                    onChange={(e)=>{handleMeasureChange(e)}}
                                >
                                    <option value=''>seleccione...</option>
                                    <option value='1'>Unidad de paquete</option>
                                    <option value='2'>Metros</option>
                                    <option value='3'>Kilos</option>
                                </select>
                            </>
                            :
                            <label>
                                Paladas
                            </label>
                        }
                    </div>
                    {/*<div className="Row">
                        <span style={{width: '131px', marginRight: '10px'}}>
                            Medida Unitaria
                        </span>
                        <TheInput
                            val={productData.UMedida}
                            numType='nat'
                            onchange={(e)=>{handleMedUnit(e)}}
                        />
                    </div>*/}
                    <div className="Row">
                        
                        <table className='theTable gmt' style={{margin: '10px 0px'}}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Medida Unitaria</th>
                                    <th>Costo</th>
                                    <th>P. venta</th>
                                    <th>% Gananacia</th>                                
                                </tr>
                            </thead>
                            {productData.Medidas.length !== 0 &&
                            <tbody>
                                {console.log(productData.Medidas)}
                                {<tr>
                                    <td>{productData.Medidas[0].Medida}</td>
                                    <td>{productData.Medidas[0].UMedida}</td>
                                    <td>{(typeof(productData.PCosto) !== 'number') ? Formater(productData.PCosto.replace(/\./g, '')) : productData.PCosto}</td>
                                    <td>{(typeof(productData.PVenta) !== 'number') ? Formater(productData.PVenta.replace(/\./g, '')) : productData.PVenta}</td>
                                    <td>{Formater(pctGan)}</td>
                                </tr>}
                                {/*medidas.slice(1).map((Med, index) =>*/}
                                {productData.Medidas.slice(1).map((Med, index) =>{
                                    
                                    let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))
                                    let pcostoUnit = pcosto/Med.UMedida;
                                    Med.PVentaUM = Med.PVentaUM.toString();
                                    
                                    /*const calpventa = (e) => {
                                        let Epct = e.replace(/[.,]/g, (a) => (a === "," && "."))
                                        let thePcosto = Number(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")))
                                        let newPventa = (thePcosto + (thePcosto * Epct / 100)).toFixed(2).toString();
                                        changeValuesProducts('PVenta', Formater(newPventa));
                                    }*/

                                    return (
                                    <tr key={index}>
                                        <td>{Med.Medida}</td>
                                        <td>
                                            <TheInput
                                                numType='real'
                                                val={Med.UMedida}
                                                //onchange={(e)=>updtState(`Medidas[${index}].PVentaUM`, e)}
                                                onchange={(e)=>{
                                                    let a = {...productData}
                                                    a.Medidas[index+1].UMedida = e
                                                    updtState('Medidas', a.Medidas);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {Formater(pcostoUnit)}
                                        </td>
                                        <td>
                                            <TheInput
                                                numType='real'
                                                val={Med.PVentaUM}
                                                pholder={Formater(
                                                    pcostoUnit + pcostoUnit*Number(pctGan.replace(/,/g, '.'))/100
                                                )}
                                                onchange={(e)=>{
                                                    let a = {...productData};
                                                    a.Medidas[index+1].PVentaUM = e;
                                                    updtState('Medidas', a.Medidas);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <TheInput
                                                id={`idpct${index}`}
                                                val={Med.PVentaUM ? Formater(((Med.PVentaUM - pcostoUnit)/pcostoUnit)*100) : ''}
                                                numType='real'
                                                pholder={Formater(pctGan)}
                                                onchange={(e)=>console.log('jsjs')}
                                            />
                                        </td>
                                    </tr>
                                    )}
                                )}
                                {/*<tr>
                                    <td>{productData.Medida ? productData.Medida : updtState('Medida', 'Metros')}</td>
                                    <td>{Formater(cUnit)}</td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pVentaUnit}
                                            pholder={Formater(Number(cUnit) + (Number(cUnit)*Number(pctGan.replace(/,/g, '.'))/100))}
                                            onchange={(e)=>{updtState('PVentaUM', e);calpct(e)}}
                                        />
                                    </td>
                                    <td>
                                        <TheInput
                                            numType='real'
                                            val={pctUnit}
                                            pholder={Formater(pctGan)}
                                            onchange={(e)=>calcPVU(e)}
                                        />
                                    </td>
                                </tr>*/}
                            </tbody>}
                        </table>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button className='btnStnd btn1' onClick={() =>{
                            show(false);
                            let a = {...productData}

                            a.Medidas.map((item) => {
                                if (item.PVentaUM==='') {
                                    item.PVentaUM = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) / 
                                        item.UMedida + 
                                        productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) / 
                                        item.UMedida*Number(pctGan.replace(/,/g, '.'))/100
                                }
                            });
                            updtState('Medidas', a.Medidas);
                        }}>
                        Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
