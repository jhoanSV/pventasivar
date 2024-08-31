import React, { useEffect, useState } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data,
                            row,
                            Width = '100%',
                            Height = '100%',
                            maxHeight = 'none',
                            headers = [],
                            selectedRow,
                            setSelectedRow,
                            principalColor = '#193773',  // Color predeterminado para la cabecera,
                            selectedRowColor = 'rgba(39, 83, 172, 0.58)',  // Color predeterminado para la fila seleccionada,
                            hoverColor = 'rgba(0, 0, 0, 0.1)',  // Color predeterminado para el hover,
                            doubleClick = ()=>{}}) => {
    //const [selectedRow, setSelectedRow] = useState(null);
    //const [width, setWidth] = useState(Width);
    //const [height, setHeight] = useState(Height);
    const [columnsWidth, setColumnsWidth] = useState([]);

    useEffect(() => {
        if (headers.length > 0) {
            //let newWidth = 0; //? Ger: I think isnt necesary setting the width due to the colums width behaviour
            //? And setting a width isnt good for responsive design. 
            let colWidth = [];
            headers.forEach(header => {
                //newWidth += header.defaultWidth;
                colWidth.push(header.defaultWidth);
            });
            //setWidth(newWidth);
            setColumnsWidth(colWidth);
        } else {
            //setWidth(Width);
            console.log('');
        }
    }, [headers, Width]);

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };

    return (
        <div className='Flatlist' id='FlastListID' style={{height: Height, maxHeight: maxHeight}}>
            <table className='theTable' >
                <thead style={{position: 'sticky', top: '0'}}>
                    <tr>
                        {headers.map((item, index) =>
                            <th key={index} style={{width: item['defaultWidth'] , backgroundColor: principalColor}} >
                                <div className='cellContent'>{item['header']}</div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 && (data.map((item, index) => (
                        <tr
                            key={index}
                            className={`rowflatlist ${selectedRow === index ? 'selected' : ''}`}
                            onClick={() => handleRowClick(index)}
                            onDoubleClick={()=>doubleClick()}
                            style={{
                                backgroundColor: selectedRow === index ? selectedRowColor : 'inherit',
                                color: selectedRow === index ? '#fff' : 'inherit'
                            }}
                        >
                        {row(item, index, columnsWidth)}
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
    );
}
