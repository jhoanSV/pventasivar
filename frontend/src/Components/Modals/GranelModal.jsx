import React, { useEffect, useState } from 'react';
import { TheInput } from '../InputComponent';
import { SubClases } from '../../api'
import { TheAlert } from '../TheAlert';

export const GranelModal = ({show, productData, pctGan, updtState}) => {
    const [ subclase, setSubclase] = useState([]);
    const [ medidas, setMedidas ] = useState([]);
    
    const updtMedida = (index, value, valueType) => {
        const newData = [...medidas];
        let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
        let pcostoUnit = newData[index].UMedida ? pcosto/(newData[index].UMedida) : 0;
        if (valueType === 'PVentaUM') {
            setMedidas(() => {
                let pct = (((value - pcostoUnit) / pcostoUnit) * 100)
                newData[index] = {
                    ...newData[index],
                    PVentaUM: value.toString(),
                    pctUM: pct.toString() // Este valor se establece al actualizar
                };
                return newData;
            });
        } else if (valueType === 'pct') {
            setMedidas(() => {
                let newPventa = (pcostoUnit + (pcostoUnit * value / 100))
                newData[index] = {
                   ...newData[index],
                    PVentaUM: newPventa.toString(),
                    pctUM: value.toString()
                };
                return newData;
            });
        }
    }

    const Formater = (number) =>{
        if (number==='') return ''
        let thenumber = typeof(number)==='number' ? number.toString() : number
        //it gives a number format
        const numberformat = Number(thenumber.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberformat.toFixed(2));
    }

    useEffect(() => {
        const listaSubClases = async () => {
            const subC = await SubClases({
                IdClase: productData.Clase
            })
            setSubclase(subC)
            const medidasIniciales = subC.map((Med) => ({
                Medida: Med.Nombre,
                UMedida: Med.UMedida,
                PVentaUM: 0,
                pctUM: 0
            }));
            setMedidas(medidasIniciales);
        }
        listaSubClases()
        console.log(medidas)
    }, [])
    

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

    const saveMeasures = () => {
        if (productData.Medidas.length === 0 && subclase.length !== 0) {
            // Verificar si existe alguna fila con valores vacíos
            let newMedidas = [...medidas];
            newMedidas[0].PVentaUM = productData.PVenta;
            newMedidas[0].pctUM = pctGan;
            const hasEmptyFields = medidas.slice(1).some(item => item.PVentaUM === 0 || item.pctUM === 0);
            console.log('medidas.slice(1): ', medidas.slice(1))
            if (hasEmptyFields) {
                // Mostrar un aviso al usuario
                TheAlert("Por favor, complete todos los campos antes de guardar.");
                return; // Detener la ejecución
            } else {
                console.log('newMedidas', newMedidas)
                updtState('Medidas', newMedidas);
                show(false);
            }
        } else if (productData.Medidas.length !== 0){//if (productData.Medidas.length !== 0){//productData.Clase === 0 || productData.Clase === 1 || productData.Clase === 2){
            let meds = {...productData}.Medidas;
            console.log('meds: ', meds);
            let a = meds[0];
            if(a.PVentaUM){
                let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                let pct = (((productData.PVenta.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) - (pcosto)) / (pcosto)) * 100);
                //console.log(Med.PVentaUM, pcosto/um, pct);
                pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                a.PVentaUM = productData.PVenta;
            }
            updtState('Medidas', meds);//Modifica la unidad en la medida
            show(false);
        }
    };

    return(
        <div className='theModalContainer'>
            <div className='theModal-content' style={{width: 'max-content', position: 'relative'}}>
                <div className='theModal-body'>
                    <button className='btn1Stnd' onClick={() => {show(false)}} style={{position: 'absolute', top: '0px', right: '0px'}}>
                        <i className='bi bi-x-lg'/>
                    </button>
                    <div style={{fontSize: '30px', fontWeight: 'bold'}}>{productData.Descripcion}</div>
                    <div style={{marginBottom: '14px'}}>{productData.Cod}</div>
                    <div className='Row' style={{marginBottom: '10px'}}>
                        <span style={{width: '134px', textAlign: 'end', marginRight: '10px'}}>
                            Unidad de medida:
                        </span>
                        {productData.Clase === 0 || productData.Clase === 1  || productData.Clase === 2 ?
                            <>
                                <select value={(productData.Clase!==0&&productData.Medidas.length!==0) ? productData.Clase : ''} name='medida'
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
                                {productData.NombreClase}
                            </label>
                        }
                    </div>
                    <div className="Row">
                        
                        <table className='theTable gmt' style={{margin: '10px 0px'}}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Medida Unitaria</th>
                                    <th>Costo</th>
                                    <th>P. venta</th>
                                    <th>% Ganancia</th>                                
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
                                    {productData.Medidas.slice(1).map((Med, index) =>{
                                        console.log(Med)
                                        let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                        let pcostoUnit = Med.UMedida ? pcosto/(Med.UMedida.toString().replace(/[.,]/g, (a) => (a === "," && "."))) : 0;

                                        return (
                                        <tr key={index}>
                                            <td>{Med.Medida}</td>
                                            {productData.Clase === 0 || productData.Clase === 1 || productData.Clase === 2 ?
                                                <td>
                                                <TheInput
                                                        numType='real'
                                                        val={Med.UMedida}
                                                        onchange={(e)=>{
                                                            Med.UMedida = e;
                                                            let um = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                            let meds = {...productData}.Medidas;
                                                            let a = meds[index+1];
                                                            if(a.PVentaUM){
                                                                console.log(a.PVentaUM);
                                                                let pct = (((a.PVentaUM.replace(/[.,]/g, (a) => (a === "." ? "" : ".")) - (pcosto/um)) / (pcosto/um)) * 100);
                                                                console.log(Med.PVentaUM, pcosto/um, pct);
                                                                pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                                a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                            }
                                                            updtState('Medidas', meds);//Modifica la unidad en la medida
                                                        }}
                                                    />
                                                </td>
                                                :
                                                <td>
                                                    {Med.UMedida}
                                                </td>
                                            }
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
                                </tbody>
                            }
                            {/*Para cuando es un producto nuevo*/}
                            {productData.Medidas.length === 0 && subclase.length !== 0 &&
                                <tbody>
                                    {<tr>
                                        <td>{subclase[0].Nombre}</td>
                                        <td>{subclase[0].UMedida}</td>
                                        <td>{(typeof(productData.PCosto) !== 'number') ? Formater(productData.PCosto.replace(/\./g, '')) : productData.PCosto}</td>
                                        <td>{(typeof(productData.PVenta) !== 'number') ? Formater(productData.PVenta.replace(/\./g, '')) : productData.PVenta}</td>
                                        <td>{Formater(pctGan)}</td>
                                    </tr>}
                                    {subclase.slice(1).map((Med, index) =>{
                                        let pcosto = productData.PCosto.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                        let pcostoUnit = Med.UMedida ? pcosto/(Med.UMedida) : 0;
                                        return (
                                        <tr key={index}>
                                            <td>{Med.Nombre}</td>
                                            <td>{Med.UMedida}</td>
                                            <td>{Formater(pcostoUnit)}</td>
                                            <td>
                                                <TheInput
                                                    numType='real'
                                                    val={medidas[index + 1]?.PVentaUM || ""}
                                                    pholder={Formater(
                                                        pcostoUnit + pcostoUnit*Number(pctGan.replace(/,/g, '.'))/100
                                                    )}
                                                    onchange={(e)=>{
                                                        Med.PVentaUM = e;
                                                        /*let pv = e.replace(/[.,]/g, (a) => (a === "," && "."));
                                                        let meds = [...medidas];
                                                        let a = meds[index+1];
                                                        if(a.UMedida!==''){
                                                            let pct = (((pv - pcostoUnit) / pcostoUnit) * 100);
                                                            pct = pct % 1 === 0 ? pct.toString() : pct.toFixed(2);
                                                            a.pctUM = Formater(pct);//Si hay pventaum cambia el pctGanancia
                                                        }*/
                                                        updtMedida(index + 1 , e, 'PVentaUM');
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <TheInput
                                                    id={`idpct${index}`}
                                                    val={medidas[index + 1]?.pctUM || ""}
                                                    numType='real'
                                                    pholder={Formater(pctGan)}
                                                    onchange={(e)=>{
                                                        Med.pctUM = e
                                                        let pct = e.replace(/[.,]/g, (a) => (a === "." ? "" : "."));
                                                        let meds = {...medidas};
                                                        let a = meds[index+1];
                                                        if(a.UMedida!==''){
                                                            let newPventa = (pcostoUnit + (pcostoUnit * pct / 100));
                                                            newPventa = newPventa % 1 === 0 ? newPventa.toString() : newPventa.toFixed(2);
                                                            meds[index+1].PVentaUM = Formater(newPventa);//Si hay umedida cambia el pventa
                                                        }
                                                        updtMedida(index + 1, e, 'pct');
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        )}
                                    )}
                                </tbody>
                            }

                            
                        </table>
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <button className='btnStnd btn1' onClick={() =>{
                            saveMeasures();
                        }}>
                        Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}