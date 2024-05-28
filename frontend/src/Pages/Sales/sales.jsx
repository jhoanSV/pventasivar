import React, {useEffect, useState} from 'react';
import { TableComponent, Flatlist } from '../../Components';
import "./_sales.scss";

export function Sales(){
    const order = [{
            Cantidad: 50,
            Codigo: 'CG001',
            Descripcion: 'chazo anclaje 1/4 x 1 3/8',
            UM: 1,
            pCosto: '',
            pVenta: 260,
        },{
            Cantidad: 25,
            Codigo: 'CG003',
            Descripcion: 'chazo anclaje 1/4 x 2 1/4',
            UM: 1,
            pCosto: '',
            pVenta: 440,
        },{
            Cantidad: 4,
            Codigo: '66302',
            Descripcion: 'Sifon flexible cromado Push lavamanos con rebose',
            UM: 1,
            pCosto: '',
            pVenta: 14000,
        },{
            Cantidad: 1,
            Codigo: 'DES02',
            Descripcion: 'Kankro ecologico 12 horas',
            UM: 1,
            pCosto: '',
            pVenta: 28000,
        },{
            Cantidad: 2,
            Codigo: 'PT012',
            Descripcion: '1200',
            UM: 1,
            pCosto: '',
            pVenta: 1200,
        },{
            Cantidad: 2,
            Codigo: 'PT013',
            Descripcion: 'Tester grande',
            UM: 1,
            pCosto: '',
            pVenta: 1900,
        },{
            Cantidad: 6,
            Codigo: 'ROD01',
            Descripcion: 'Rodillo Felpa acrilica 9"',
            UM: 1,
            pCosto: '',
            pVenta: 3900,
        },{
            Cantidad: 12,
            Codigo: '10101',
            Descripcion: 'Envace negro 1/32',
            UM: 1,
            pCosto: '',
            pVenta: 575,
        },{
            Cantidad: 12,
            Codigo: '10102',
            Descripcion: 'Envace negro 1/16',
            UM: 1,
            pCosto: '',
            pVenta: 600,
        },{
            Cantidad: 12,
            Codigo: '10103',
            Descripcion: 'Envace negro 1/8',
            UM: 1,
            pCosto: '',
            pVenta: 650,
        },{
            Cantidad: 12,
            Codigo: '10104',
            Descripcion: 'Envace negro 1/4',
            UM: 1,
            pCosto: '',
            pVenta: 800,
        },{
            Cantidad: 2,
            Codigo: 'SP109',
            Descripcion: 'tope de rodillo',
            UM: 1,
            pCosto: '',
            pVenta: 820,
        },{
            Cantidad: 2,
            Codigo: 'AP001',
            Descripcion: 'acople rapido',
            UM: 1,
            pCosto: '',
            pVenta: 4500,
        },{
            Cantidad: 6,
            Codigo: 'SP136',
            Descripcion: 'Chupa sanitaria',
            UM: 1,
            pCosto: '',
            pVenta: 3700,
        },{
            Cantidad: 1,
            Codigo: 'AVE05',
            Descripcion: 'Interruptor AVE doble conmutable',
            UM: 1,
            pCosto: '',
            pVenta: 11500,
        }
    ];

    const ctHeaders = [
        {
            header: 'Cantidad',
            key: 'cantidad',
            defaultWidth: 131,
            type: 'text',
        },
        {
            header: 'Codigo',
            key: 'codigo',
            defaultWidth: 131,
            type: 'text',
        },
        ,
        {
            header: 'Descripción',
            key: 'descripcion',
            defaultWidth: 300,
            type: 'text',
        },
        {
            header: 'U/M',
            key: 'UM',
            defaultWidth: 50,
            type: 'text',
        },
        {
            header: 'Vr.Unitario',
            key: 'vrUnitario',
            defaultWidth: 223,
            type: 'text',
        },
        {
            header: 'Vr.Total',
            key: 'vrTotal',
            defaultWidth: 223,
            type: 'text',
        }
    ];
    const [buttonCount, setButtonCount] = useState(1); // Initial button count
    const [total, setTotal] = useState(0);
    const [orderslist, setOrderslist] = useState(order)

    useEffect(() => {
        sumarTotal()
    }, [orderslist])
    

    const createButton = () => {
        setButtonCount(buttonCount + 1); // Increment button count
    };

    const Formater = (number) =>{
        //it gives a number format
        if (number === '') return '';
        const numberString = String(number).replace(/,/g, '.');
        const numberfromat = Number(numberString);
        return Intl.NumberFormat('de-DE').format(numberfromat);
    };

    const sumarTotal = () => {
        let suma = 0;
        orderslist.map((item, index) => (
            suma += item.pVenta * item.Cantidad
        ))
        setTotal(suma)
    }

    const RowOrder = (item, index, columnsWidth) => {
        const [changeQuantity, setChangeQuantity] = useState(false)
        const [changeVrVenta, setChangeVrVenta] = useState(false)
        
        return (
            <tbody>
                <div style={{width: columnsWidth[0]}} onDoubleClick={()=>setChangeQuantity(!changeQuantity)}>
                    { !changeQuantity && 
                        <label>{item.Cantidad}</label> }
                    { changeQuantity && 
                        <input type="number"
                        value={item.Cantidad}
                        onChange={{}}
                        style={{width: columnsWidth[0]}}/>
                    }
                </div>
                <div style={{width: columnsWidth[1]}}>
                    <label>{item.Codigo}</label>
                </div>
                <div style={{width: columnsWidth[2]}}>
                    <label>{item.Descripcion}</label>
                </div>
                <div style={{width: columnsWidth[3]}}>
                    <label>{item.UM}</label>
                </div>
                <div style={{width: columnsWidth[4]}} onDoubleClick={()=>setChangeVrVenta(!changeVrVenta)}>
                    { !changeVrVenta &&
                        <label>${Formater(item.pVenta)}</label> }
                    { changeVrVenta && 
                        <input type="number"
                        value={item.pVenta}
                        onChange={{}}
                        style={{width: columnsWidth[4]}}/>
                    }
                </div>
                <div style={{width: columnsWidth[5]}}>
                    <label>$ {Formater(item.pVenta * item.Cantidad)}</label>
                </div>
            </tbody>
        );
    };


    return (
        <div>
            <div className="Search">
                <input
                    type="text"
                    placeholder="Buscar..."/>
            <button className="btnStnd btn1">Buscar</button>
            </div>
            <div>
            <button onClick={createButton}>Create Button</button>
                {[...Array(buttonCount)].map((_, index) => (
                    <button key={index}>Button {index + 1}</button>
                ))}
            <Flatlist
                data={orderslist}
                row={RowOrder}
                headers={ctHeaders}
            />
            </div>
            <div>
                <button className="btnStnd btn1">F2-Cobrar</button>
                <label>$ {Formater(total)}</label>
            </div>
        </div>
    );
}