import React, { useEffect, useState } from 'react';
import { TheInput } from '../InputComponent';

export const GranelModal = ({show, productData, pctGan, updtState}) => {
    
    const Formater = (number) =>{
        if (number==='') return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberformat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberformat.toFixed(2));
    }

    //console.log(Number(pctGan.replace(/[.,]/g, (a) => (a === "." ? "" : "."))))
    //console.log(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, ''));
    //const [cUnit, setcUnit] = useState((typeof(productData.PCosto) !== 'number') ? (productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/productData.UMedida.replace(/\./g, '')) : Formater(productData.PCosto/productData.UMedida));
    const [cUnit, setcUnit] = useState(0);
    const [frstRender, setFrstRender] = useState(true);
    
    console.log(productData.Medidas);
    //const [medidas, setMedidas] = useState(productData.Medidas.length === 0 ? [{}] : productData.Medidas);
    const [pVentaUnit, setPVentaUnit] = useState(productData.PVentaUM);
    /*const [pctUnit, setPctUnit] = useState(productData.PVentaUM ? 
        Formater((((pVentaUnit.replace(/\./g, '')-cUnit)/cUnit)*100).toFixed(2))
        :
        ''
    )*/
    //const [tabRow, setTabRow] = useState(medidas);

    /*const handleMedUnit = (e) =>{
        updtState('UMedida', e);
        (typeof(productData.PCosto) !== 'number') ? setcUnit(productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."))/e) : setcUnit(productData.PCosto/e)
    }*/
   
    if(frstRender){
        console.log('-->', productData.Medidas);
        if(productData.Medidas.length !== 0){
            productData.Medidas.forEach(med => {
                med.UMedida = Formater(med.UMedida);
                med.PVentaUM = Formater(med.PVentaUM);
            });
        }
        setFrstRender(false);
    }

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
                    PVentaUM: productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")),
                },
                {
                    Medida: 'Unidades',
                    UMedida: '',
                    PVentaUM: '',
                    pctUM: ''
                }
            ];
            updtState('Medidas', a.Medidas)
        }else if(Number(e.target.value) === 2){
            a.Medidas = [
                {
                    Medida: 'Completo',
                    UMedida: '1',
                    PVentaUM: '',
                },
                {
                    Medida: 'Metros',
                    UMedida: '',
                    PVentaUM: '',
                    pctUM: ''
                }
            ];
            updtState('Medidas', a.Medidas);
        }
    }

    /*const calpct = (e) =>{
        let thePventa = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")))
        let thePcosto = cUnit
        let pct = (((thePventa-thePcosto)/thePcosto)*100).toFixed(2).toString();
        pct = pct.replace(/\./g, ',');
        setPctUnit(Formater(pct))
    }*/

    const calcPVU = (e, index, pcostoUnit) =>{
        let thepct = Number(e.replace(/[.,]/g, (a) => (a === "," && ".")));
        let newPventa = (pcostoUnit + (pcostoUnit*thepct/100)).toFixed(2).toString();
        console.log(newPventa);
        let a = {...productData}
        a.Medidas[index+1].PVentaUM = (newPventa);
        updtState('Medidas', a.Medidas);//Modifica la unidad en la medida
        //updtState('PVentaUM', Formater(newPventa));
        //setPVentaUnit(Formater(newPventa));
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

    // useEffect(() => {
    //     console.log('clase: ' + (Number(productData.Clase)));
    //     if(Number(productData.Clase) === 0){
    //         setMedidas((a) =>{
    //             a = [{}];
    //             //updtState('Medidas', a);
    //             return(a);
    //         })
    //     }else if(Number(productData.Clase) === 1){
    //         setMedidas((a) =>{
    //             a = [
    //                 {
    //                     Medida: 'Paquete',
    //                     UMedida: '1',
    //                     PVentaUM: '',
    //                 },
    //                 {
    //                     Medida: 'Unidades',
    //                     UMedida: '',
    //                     PVentaUM: '',
    //                 }
    //             ];
    //             //updtState('Medidas', a);
    //             return(a);
    //         })
    //     }else if(Number(productData.Clase) === 2){
    //         setMedidas((a) =>{
    //             a = [
    //                 {
    //                     Medida: 'Completo',
    //                     UMedida: '1',
    //                     PVentaUM: '',
    //                 },
    //                 {
    //                     Medida: 'Metros',
    //                     UMedida: '',
    //                     PVentaUM: '',
    //                 }
    //             ];
    //             //updtState('Medidas', a);
    //             return(a);
    //         })
    //     }else if(Number(productData.Clase) === 3){
    //         setMedidas((a) =>{
    //             a = [
    //                 {
    //                     Medida: 'Bulto',
    //                     UMedida: '1',
    //                     PVentaUM: ''
    //                 },
    //                 {
    //                     Medida: 'Medio Bulto',
    //                     UMedida: '',
    //                     PVentaUM: ''
    //                 },
    //                 {
    //                     Medida: 'Arrobas',
    //                     UMedida: '',
    //                     PVentaUM: ''
    //                 },
    //                 {
    //                     Medida: 'Kilos',
    //                     UMedida: '',
    //                     PVentaUM: ''
    //                 }
    //             ];
    //             //updtState('Medidas', a);
    //             return(a);
    //         })                        
    //     }

    //     // eslint-disable-next-line
    // }, [productData]);

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
                                    {/*<option value='3'>Kilos</option>*/}
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
                                {<tr>
                                    <td>{productData.Medidas[0].Medida}</td>
                                    <td>{productData.Medidas[0].UMedida}</td>
                                    <td>{(typeof(productData.PCosto) !== 'number') ? Formater(productData.PCosto.replace(/\./g, '')) : productData.PCosto}</td>
                                    <td>{(typeof(productData.PVenta) !== 'number') ? Formater(productData.PVenta.replace(/\./g, '')) : productData.PVenta}</td>
                                    <td>{Formater(pctGan)}</td>
                                </tr>}
                                {/*medidas.slice(1).map((Med, index) =>*/}
                                {productData.Medidas.slice(1).map((Med, index) =>{

                                    
                                    let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                    let pcostoUnit = pcosto/(Med.UMedida.replace(/[.,]/g, (a) => (a === "," && ".")));
                                    console.log(pcostoUnit);
                                    //Med.PVentaUM = Med.PVentaUM.toString();
                                    
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
                                                    Med.UMedida = e;
                                                    let um = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                    let meds = {...productData}.Medidas;
                                                    let a = meds[index+1];
                                                    //a.UMedida = e
                                                    if(a.PVentaUM!==''){
                                                        let pct = (((a.PVentaUM.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) - (pcosto/um)) / (pcosto/um)) * 100);
                                                        console.log(Med.PVentaUM, pcosto/um, pct);
                                                        pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                        a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                    }
                                                    //updtState('Medidas', meds);//Modifica la unidad en la medida
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
                                                    Med.PVentaUM = e;
                                                    let pv = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                    let meds = {...productData}.Medidas;
                                                    let a = meds[index+1];
                                                    //a.PVentaUM = pv;
                                                    if(a.UMedida!==''){
                                                        let pct = (((pv - pcostoUnit) / pcostoUnit) * 100);
                                                        pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                        a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                    }
                                                    updtState('Medidas', meds);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <TheInput
                                                id={`idpct${index}`}
                                                val={Med.pctUM}
                                                numType='real'
                                                pholder={Formater(pctGan)}
                                                onchange={(e)=>{
                                                    Med.pctUM = e
                                                    let pct = e.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                                    let meds = {...productData}.Medidas;
                                                    let a = meds[index+1];
                                                    //a.pctUM = e;
                                                    if(a.UMedida!==''){
                                                        let newPventa = (pcostoUnit + (pcostoUnit * pct / 100));
                                                        newPventa = newPventa % 1 === 0 ? newPventa.toString() : newPventa.toFixed(2);
                                                        meds[index+1].PVentaUM = Formater(newPventa);//Si hay umedida cambia el pventa
                                                    }
                                                    updtState('Medidas', meds);
                                                }}
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
                            let a = {...productData}.Medidas;
                            console.log('a', a);
                            if(a.length !== 0){
                                a.forEach((item) => {
                                    if (item.PVentaUM==='') {
                                        let v = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) / 
                                            item.UMedida.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) + 
                                            productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) / 
                                            item.UMedida.replace(/[.,]/g, (a) => (a === "." ? "" : "."))*Number(pctGan.replace(/,/g, '.'))/100;
                                        v = v % 1 === 0 ? v.toString() : v.toFixed(2);
                                        item.PVentaUM = v;
                                    }
                                    item.UMedida = item.UMedida.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                    console.log(item.UMedida.replace(/[.,]/g, (a) => (a === "." ? "" : ".")));
                                });
                                updtState('Medidas', a);
                            }
                            /*
                            return () => {
                                console.log('primero esto ', productData.Medidas);
                                let Meds = {...productData}.Medidas;
                                if(){
                                    Meds.forEach(med => {
                                        
                                    })
                                    
                                }
                            };
                            updtState('Medidas', a.Medidas);*/
                        }}>
                        Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}