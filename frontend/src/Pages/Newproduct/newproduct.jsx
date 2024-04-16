import React from 'react';
import "./_newproduct.scss";

export function Newproduct(){
    return (
        <div className="_About">
            <button>Impuesto</button>
            <button>Paquete</button>

            <label>Codigo de barras</label>
            <input type="text" className=""/>
            <label>Producto</label>
            <input type="text" className=""/>
            <label>Se vende:</label>
            <label>
                <input type="radio" className=""/>
                por unidad
            </label>
            <label>
                <input type="radio" className=""/>
                granel
            </label>
            <label>
                <input type="radio" className=""/>
                paquete/kit
            </label>
            <label>Costo</label>
            <input type="text" className=""/>
            <label>% ganancia</label>
            <input type="text" className=""/>
            <label>Precio venta</label>
            <input type="text" className=""/>
            <label>Categoria</label>
            <input type="text" className=""/>
            <label>Proveedor</label>
            <div>
                <button>Nueva ctegoria</button>
                <button>Nuevo proveedor</button>
            </div>
            <div>
                <label>Inventario</label>
                <div>
                    <label>Inv actual</label>
                    <input type="text" className=""/>
                    <label>Inv minimo</label>
                    <input type="text" className=""/>
                    <label>Inv maximo</label>
                    <input type="text" className=""/>
                    <label>Ubicación</label>
                    <input type="text" className=""/>
                </div>
            </div>
            <label>Nota</label>
            <input type="text" className=""/>
            <img className="">

            </img>

            <button>Guardar producto</button>
        </div>
    );
}