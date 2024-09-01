import React, { useEffect, useRef, useState } from 'react';
import './_Cart.scss';
import { useTheContext } from '../../TheProvider';
import { useNavigate } from 'react-router-dom';
import { Formater } from '../../App';
import { ItemCart } from './ItemCart';
import { EnviarVenta } from '../../api';
import html2canvas from 'html2canvas';

export const Cart = () => {

    const dateChosen = useRef();
    const theTextArea = useRef();

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));
    const [sendCost, setSendCost] = useState(5000);
    const [subTotalC, setSubTotalC] = useState(0);
    const [currentDiv, setCurrentDiv] = useState(0);
    const [route, setRoute] = useState(false);
    const [btnDis, setBtnDis] = useState(true);
    const [btnDis2, setBtnDis2] = useState(true);
    const [consecutive, setConsecutive] = useState(0);
    const [sendDate, setSendDate] = useState('');
    const [theTotal, setTheTotal] = useState();
    const [show1, setShow1] = useState(false);
    const { setNItemsCart, setSection, usD } = useTheContext()
    const navigate = useNavigate()
    const LaFecha = new Date()
    const tomorrow = new Date(LaFecha)
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deleteItemCart = (id) =>{
        const newCart = [...cart]
        newCart.splice(id, 1);
        localStorage.setItem('cart', JSON.stringify(newCart))
        setNItemsCart(newCart.length)
        setCart(newCart);
    }

    const updateCant = (id, val) =>{
        const newCart = [...cart]
        newCart[id].Cant = val        
        setCart(newCart)
        localStorage.setItem('cart',JSON.stringify(newCart))
    }

    const handleModalClose = () =>{
        setCurrentDiv(0);
        setBtnDis2(true);
        setRoute(false);
        setShow1(false);
        document.body.classList.remove('modalOpen');
    }

    const handleSendOrder = async() =>{
        const fecha = new Date()
        const today = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds()        
        let TIngresados = [], notes = theTextArea.current.value, total=0, thisSendDate
        cart.forEach((element) => {
            TIngresados.push(`${element['Cant']},${element['Cod']},${element['PCosto']}`)
            total = total + (element['PCosto']*element['Cant'])
        });
        TIngresados = TIngresados.join(';');
        if(route){
            setSendDate(fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + (fecha.getDate()))
            thisSendDate = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + (fecha.getDate())
            notes = notes + ' ...Cuadrar fecha de entrega'
        }else{
            thisSendDate = dateChosen.current.value
            setSendDate(dateChosen.current.value)
        }
        setTheTotal(total+sendCost)
        const orderReq  = await EnviarVenta({
            "CodCliente": usD.Cod,
            "FechaFactura": today,
            "FechaDeEstado": today,
            "FechaDeEntrega": thisSendDate,
            "FechaVencimiento" : thisSendDate,
            "NotaVenta": notes,
            "VECommerce": "1",
            "TIngresados": TIngresados
        })
        if(orderReq['success']===true){
            setConsecutive(orderReq['NDePedido'])            
            setCurrentDiv(3)
            setCart([])
            setNItemsCart(0)
            localStorage.setItem('cart',JSON.stringify([]))
        }else{
            alert('Ocurrió un error, intente de nuevo más tarde')
        }
    }

    const saveReminder = (divId, filename, windowWidth=550, windowHeight=550) => {
        const divToExport = document.getElementById(divId);
      
        html2canvas(divToExport, {windowWidth, windowHeight})
          .then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = filename;
            link.click();
          });
    }

    const dateFunct = () =>{
        const theDate = new Date(sendDate)
        theDate.setDate(theDate.getDate()+1);
        const days = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
        ]
        return(`${days[theDate.getDay()]}, ${theDate.getDate()}/${theDate.getMonth()+1}/${theDate.getFullYear()}`)
    }

    useEffect(() => {
        setNItemsCart(cart.length)
        let totalCost = 0;
    
        cart.forEach((item) => {
            totalCost += item.PCosto * item.Cant;
        });
        
        setSubTotalC(totalCost);
        if (totalCost > 300000 || route) setSendCost(0)
        else setSendCost(5000)

        if(totalCost===0){setBtnDis(true)}
        else{setBtnDis(false)}
        
        // eslint-disable-next-line
    }, [cart, route]);

    useEffect(() => {
        setSection('Carrito de compras');
        // eslint-disable-next-line
    }, []);

    return (
        <section className='theCart'>
            <div className='banner1'>
                <div className='textBanner1Container'>
                    Por compras superiores a $300.000 el env&iacute;o es gratis
                </div>
            </div>
            <div className='itemsCart grayContainer'>
                {cart.length!==0 ?
                    cart.map( (item, index) => {                                                
                        return(
                            <ItemCart
                                key={index}
                                id={index}
                                nombre={item.Descripcion}
                                cod={item.Cod}
                                unitPrice={item.PCosto}
                                unitPaq={item.EsUnidadOpaquete}
                                category={(item.Categoria).toLowerCase()}
                                cantidad={item.Cant}
                                onDelete={deleteItemCart}
                                updtC = {updateCant}
                            />
                        );                        
                    })
                :
                <>
                    <i className="bi bi-cart-x" style={{fontSize: '62px'}}></i>
                    <span style={{fontSize: '2rem'}}>Carrito de compra vac&iacute;o</span>
                </>
                }                
            </div>
            <div className='dtlCart grayContainer'>
                <div>SubTotal: $ {Formater(subTotalC)}</div>
                <div>Envio: $ {Formater(sendCost)}</div>
                <div style={{marginTop: '10px', fontWeight: 'bold', fontSize: '20px', color: '#193773'}}>
                    Total: {' '}
                    <span style={{color: 'black'}}>${Formater(subTotalC+sendCost)}</span>
                </div>
                <button className="btnSendOrd btnStnd btn1" onClick={()=>{setShow1(true);document.body.classList.add('modalOpen')}} disabled={btnDis}>
                    Enviar pedido
                </button>
            </div>

            
            { show1 && 
            <div className='theModalContainer'>
                <div className="theModal-content" style={{width: '361.67px', position: 'relative'}}>
                    <div className="modal-content">
                        <button className="btn1Stnd" style={{position: 'absolute', top: '0px', right: '0px'}} onClick={()=>{handleModalClose()}}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                        <div className='modal-body'>
                            <div className='sendOrd genFont'>
                                {  currentDiv === 0 &&
                                <>
                                    <button type="button" className="btnModal" onClick={()=>{setCurrentDiv(a=>a+1);setRoute(true);setBtnDis2(false)}}>Enviar con ruta</button>
                                    <button type="button" className="btnModal" onClick={()=>{setCurrentDiv(a=>a+2);setRoute(false)}} >Escoger fecha de envío</button>
                                </>
                                }
                                {  currentDiv === 1 &&
                                <div style={{flexDirection: 'column', margin: 'auto'}}>
                                    <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center'}}>
                                        Un asesor se comunicar&aacute; contigo para confirmarte la fecha
                                    </div>
                                    <div style={{display: 'flex', marginTop: '29px'}}>
                                        <button type="button" className="btnModal btnBack" onClick={()=>setCurrentDiv(a=>a-1)}>Volver</button>
                                        <button type="button" className="btnModal" onClick={()=>setCurrentDiv(a=>a+1)}>Siguiente</button>
                                    </div>
                                </div>
                                }
                                {  currentDiv === 2 &&
                                <div style={{flexDirection: 'column', width: '100%', padding: '15px'}}>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            Nota:
                                        </div>
                                        { !route &&
                                        <div>
                                            fecha:{' '}
                                            <input type="date" id="deadline" name="deadline" ref={dateChosen}
                                                min={`${tomorrow.getFullYear()}-${(tomorrow.getMonth()+1).toString().padStart(2, '0').slice(-2)}-${(tomorrow.getDate()).toString().padStart(2, '0').slice(-2)}`}
                                                style={{borderRadius: '10px'}}
                                                onChange={()=>setBtnDis2(false)}
                                            />
                                        </div>
                                        }
                                    </div>
                                    <div>
                                        <textarea type='textbox' className='textAreaModal' ref={theTextArea}
                                            placeholder='Recomendaciones/Sugerencias'                                            
                                        />
                                    </div>
                                    <div>SubTotal: $ {Formater(subTotalC)}</div>
                                    <div>Env&iacute;o: $ {Formater(sendCost)}</div>
                                    <div style={{color: '#193773', fontWeight: 'bold', fontSize: '20px'}}>
                                        Total: {' '}
                                        <span style={{color: 'black'}}>${Formater(subTotalC+sendCost)}</span>
                                    </div>
                                    <div style={{display: 'flex', marginTop: '15px'}}>
                                        <button type="button" className="btnModal btnBack"
                                            onClick={()=>{setCurrentDiv(a=>a-2);setBtnDis2(true)}}>
                                            Volver
                                        </button>                                                
                                        <button type="button" className="btnModal btnConfirm" disabled={btnDis2}
                                            onClick={()=>{handleSendOrder()}}>
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                                }
                                {currentDiv === 3 &&
                                <div className='reminderContainer'>
                                    <div className='reminder' id='theReminder'>
                                        <div style={{display: 'flex'}}>
                                            <picture>
                                                <source
                                                    type="image/avif"
                                                    srcSet={require('../../Assets/AVIF/LogoSivarB.avif')}
                                                />
                                                <img
                                                    src={require('../../Assets/AVIF/LogoSivarB.avif')}
                                                    alt='LogoSivar'
                                                    decoding="async"
                                                />
                                            </picture>
                                            <div style={{fontWeight: 'bold', color: 'green'}}>¡Enviado con Exito!</div>
                                        </div>
                                        <div style={{fontWeight: 'bold'}}>N° de pedido: {consecutive}</div>
                                        <div style={{fontWeight: 'bold'}}>Empresa:</div>
                                        <div>{usD.Ferreteria}</div>
                                        <div style={{fontWeight: 'bold'}}>Valor:</div>
                                        <div>$ {Formater(theTotal)}</div>
                                        <div style={{fontWeight: 'bold'}}>Fecha de entrega estimada:</div>
                                        {route?
                                        <div>Fecha por confirmar</div>
                                        :
                                        <div>{dateFunct()} O a m&aacute;s tarde un d&iacute;a habil despu&eacute;s</div>
                                        }
                                        <div style={{fontWeight: 'bold'}}>www.sivar.com.co</div>
                                        <div><strong>Asesor:</strong> {usD.Asesor}</div>
                                    </div>
                                    <button className='btnModal' style={{margin:'5px auto'}}
                                        onClick={()=>{saveReminder('theReminder', `S${consecutive}.png`)}}>
                                            Guardar
                                    </button>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </section>
    );
}
