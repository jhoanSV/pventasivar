import React, { useEffect } from 'react';
import "./_newsupplier.scss";
import { useTheContext } from '../../TheProvider';

export function Newsupplier(){

    const { setSection } = useTheContext();

    useEffect(() => {
        setSection('Nuevo proveedor')

        // eslint-disable-next-line
    }, []);

    return (
        <section className="Newsupplier">
            <div className="Row">
                <div className="Colmn1">
                    <label>Tipo</label>
                </div>
                <div className="Colmn2">
                    <select>
                        <option value="1">Producto</option>
                        <option value="2">Servicio</option>
                    </select>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Nit/C.C</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Nombre</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                    <label>Apellidos</label>
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Telefono1</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>E-mil</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Direccion</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Forma de pago</label>
                </div>
                <div className="Colmn2">
                    <input type="text"/>
                    <label>Dias</label>
                    <input type="text"/>
                </div>
            </div>
            <div className="Row">
                <div className="Colmn1">
                    <label>Notas</label>
                </div>
                <div className="Colmn2">
                    <textarea 
                        type="textbox"
                        className="nsTextArea"
                        placeholder="Notas/Detalles del proveedor"
                    />
                </div>
            </div>
            <button>Guardar</button>
            <button>Cancelar</button>
            <button>Historial</button>
        </section>
    )
}