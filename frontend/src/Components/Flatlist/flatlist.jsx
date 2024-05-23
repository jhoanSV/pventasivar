import React, { useEffect } from 'react';
import './_flatlist.scss';

export const Flatlist = ({ data, row }) => {
    return (
        <div>
            {data.map((item, index) => (
                row(item)
            ))}
        </div>
    );
}
