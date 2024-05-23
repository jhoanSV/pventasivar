import React, { useEffect, useState } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data, row, Width, Heidth, doubleClick }) => {
    const [width, setWidth] = useState('90%');
    const [heidth, setHeidth] = useState('600px');

    useEffect(() => {
      if (width) {
        setWidth(Width);
      }
      if (heidth) {
        setHeidth(Heidth);
      }
    }, [])
    
    const DoubleClick = (item) => {
        if (doubleClick) {
            doubleClick(item);
        }
    }


    const getkey = (key) => {
        return 
    }

    return (
        <div className='Flatlist' style={{"width": width, "height": heidth}}>
            {data.map((item, index) => (
                <div key={index} className='rowflatlist'>
                    {row(item)}
                </div>
            ))}
        </div>
    );
}
