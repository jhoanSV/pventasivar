import React from 'react';
import "./_newcustomer.scss";

export function Newcustomer(){
    return (
        <div className="_About">
            <h1>Nit/C.C</h1>
            <input type="text" className="standarinput"/>
            <h1>Nombres</h1>
            <input type="text" className=""/>
            <h1>Apellidos</h1>
            <input type="text" className=""/>
            <h1>Telefono 1/whastsapp</h1>
            <input type="text" className=""/>
            <h1>Telefono 2</h1>
            <input type="text" className=""/>
            <h1>E-mail</h1>
            <input type="text" className=""/>
            <h1>Direccion</h1>
            <input type="text" className=""/>
            <h1>Barrio</h1>
            <input type="text" className=""/>
            <h1>Credito</h1>
            <input type="checkbox" className=""/>
            <h1>Limite de credito</h1>
            <input type="text" className=""/>
            <h1>Notas</h1>
            <input type="text" className=""/>

            <button>Guardar</button>
            <button>Historial</button>
            <button>Cancelar</button>
        </div>
    );
}