import React, { useEffect, useState } from 'react';
import './_TableComponent.scss';

export const TableComponent = ({data, headers, selected, setSelected, multiSelect, doubleClickFunct, row}) => {

    const [prevClick, setPrevClick] = useState();

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

    const selectedRowFunction = (e, item, llave) =>{
        if(multiSelect){
            if(e.currentTarget.classList.contains('active-row')){//* if already have the active class then remove the item from the selected list
                let a = selected
                a = a.filter((entry) => entry['id_nit']!== llave)
                setSelected(a);
            }else{//* if doesnt have the active class add the item
                setSelected(i=>[...i, item])
            }
        }else{
            if(prevClick){                
                prevClick.classList.remove('active-row');
            }
            setPrevClick(e.currentTarget)
            setSelected([item]);
        }
        e.currentTarget.classList.toggle('active-row')
    }
    
    useEffect(() => {
        createResizableTable(document.getElementById('theTableId'));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (selected.length===0) {
            document.querySelectorAll('.active-row').forEach(item => {
                item.classList.remove('active-row')
            })
        }
    }, [selected]);

    return (
        <>            
            <div className="tableContainer">                
                <table className='theTable' id='theTableId'>
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
                        {data.slice(0,10).map((item, index) => 
                            <tr key={index} onClick={(e)=>selectedRowFunction(e, item, item['id_nit'])} onDoubleClick={()=>{doubleClickFunct()}}>
                                {headers.map((header, index) => 
                                    <td key={index}>
                                        <div className='cellContent'>{item[header['key']]}</div>
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}