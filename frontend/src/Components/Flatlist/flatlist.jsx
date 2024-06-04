import React, { useEffect, useState } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data, row, Width = '90%', Height = 500, headers = [], selectedRow, setSelectedRow}) => {
    //const [selectedRow, setSelectedRow] = useState(null);
    const [width, setWidth] = useState(Width);
    const [height, setHeight] = useState(Height);
    const [columnsWidth, setColumnsWidth] = useState([]);

    useEffect(() => {
        if (headers.length > 0) {
            let newWidth = 0;
            let colWidth = [];
            headers.forEach(header => {
                newWidth += header.defaultWidth;
                colWidth.push(header.defaultWidth);
            });
            setWidth(newWidth);
            setColumnsWidth(colWidth);
            console.log(newWidth);
        } else {
            setWidth(Width);
        }
    }, [headers, Width]);

    const handleRowClick = (index) => {
        setSelectedRow(index);
    };

    return (
        <div className='Flatlist' style={{"width": width, "height": Height}}>
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
                    >
                    {row(item, index, columnsWidth)}
                    </tr>
                )))}
            </tbody>
        </div>
    );
}
