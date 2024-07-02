import React, { useEffect, useState } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data, row, Width = '100%', Height = 500, headers = [], selectedRow, setSelectedRow,
    doubleClick = ()=>{}}) => {
    //const [selectedRow, setSelectedRow] = useState(null);
    //const [width, setWidth] = useState(Width);
    //const [height, setHeight] = useState(Height);
    console.log('I think isnt necesary to set height: '+Height);
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
        <div className='Flatlist'>
            <table className='theTable'>
                <thead style={{position: 'sticky', top: '0'}}>
                    <tr>
                        {headers.map((item, index) =>
                            <th key={index} style={{width: item['defaultWidth']}}>
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
                        >
                        {row(item, index, columnsWidth)}
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
    );
}
