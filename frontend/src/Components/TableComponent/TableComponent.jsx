import React, { useEffect } from 'react';
import './_TableComponent.scss';

export const TableComponent = ({data, headers}) => {
    console.log(data);
    console.log(headers);
    const createResizableTable = function (table) {
        const cols = table.querySelectorAll('th');
        [].forEach.call(cols, function (col) {
            // Add a resizer element to the column
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');

            // Set the height
            resizer.style.height = table.offsetHeight + 'px';

            col.appendChild(resizer);

            createResizableColumn(col, resizer);
        });
    };

    const createResizableColumn = function (col, resizer) {
        let x = 0;
        let w = 0;

        const mouseDownHandler = function (e) {
            x = e.clientX;

            const styles = window.getComputedStyle(col);
            w = parseInt(styles.width, 10);

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            resizer.classList.add('resizing');
        };

        const mouseMoveHandler = function (e) {
            const dx = e.clientX - x;
            col.style.width = (w + dx) + 'px';
        };

        const mouseUpHandler = function () {
            resizer.classList.remove('resizing');
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        resizer.addEventListener('mousedown', mouseDownHandler);
    };
    
    useEffect(() => {
        createResizableTable(document.getElementById('theTableId'));
        // eslint-disable-next-line
    }, []);

    return (
        <table className='theTable' id='theTableId'>
            <thead>
                <tr>
                    {headers.map((item, index) =>
                        <th key={index} style={{width: item['defaultWidth']}}>{item['header']}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.slice(0,10).map((item, index) => 
                    <tr key={index}>
                        {headers.map((header, index) => 
                            <>
                                {header['function'] ?
                                    <td>
                                        <i className={header['var1']} onClick={()=>{header['function']()}}></i>
                                    </td>
                                :
                                    <td key={index}>{item[header['key']]}</td>
                                }
                            </>
                        )}
                        
                    </tr>
                )}
            </tbody>
        </table>
    );
}