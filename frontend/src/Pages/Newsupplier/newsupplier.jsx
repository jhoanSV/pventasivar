import React from 'react';
import "./_newsupplier.scss";

export function Newsupplier(){
    return (
        <div className="newproduct">
            <label>Tipo</label>
            <select>
                <option value="1">Producto</option>
                <option value="2">Servicio</option>
            </select>
            <label>Nombre</label>
            <input type="text"/>
            <label>Nombre asesor</label>
            <input type="text"/>
            <label>Apellidos</label>
            <input type="text"/>
            <label>Telefono 1</label>
            <input type="text"/>
            <label>Telefono 2</label>
            <input type="text"/>
            <label>E-mail</label>
            <input type="text"/>
            <label>Direccion</label>
            <input type="text"/>
            <label>pagina web</label>
            <input type="text"/>
            <label>Forma de pago</label>
            <input type="text"/>
            <label>Dias</label>
            <input type="text"/>
            <label>Notas:</label>
            <input type="text"/>
            <button>Guardar</button>
            <button>Cancelar</button>
            <button>Historial</button>
        </div>
    )
}