import React, { useEffect, useState } from 'react';

export const TheInput = ({
    id='',
    className='',
    val,
    numType=false,
    onchange=false,
    onblur=false,
    onfocus=false,}) => {

    const [value, setValue] = useState(val);

    const handleChange = (e) => {
        const characters = (numType==='nat') ? //*for natural numbers
            ['1','2','3','4','5','6','7','8','9','0','']
            : (numType==='ent') ? //*for integer numbers
            ['1','2','3','4','5','6','7','8','9','0','-','']
            : (numType==='real') ? //*for real numbers
            ['1','2','3','4','5','6','7','8','9','0','-','.',',','']
            : ['1','2','3','4','5','6','7','8','9','0','-','.',',','']
        if (characters.includes(e.target.value.slice(-1))) {
            setValue(e.target.value)
            if(onchange)onchange(e.target.value)
        }
    }

    const Formater = (number) =>{
        //it gives a number format        
        if (!number) return ''
        const numberfromat = Number(number.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }

    const handleBlur = (e) => {
        //gives a number format at the moment of leave the element
        const formattedValue = Formater(e.target.value);
        //changeValuesProducts(key,formattedValue);
        if (formattedValue==='NaN') {
            setValue(0)
            if(onblur)onblur(0)
        }else{
            setValue(formattedValue)            
            if(onblur)onblur(formattedValue)
        }
    };

    const handleFocus = (e) => {
        //remove the format while the user is focused on the element
        if(value){
            const theValue = e.target.value.toString()
            let withoutFormat = theValue.replace(/\./g, '')
            setValue(withoutFormat)
            if(onfocus)onfocus(withoutFormat)
        }
    };

    useEffect(() => {
        setValue(val)
        // eslint-disable-next-line
    }, [val]);

    return (
        <input
            type='text'
            id={id}
            className={className}
            value={value}
            onChange={(e)=>{handleChange(e)}}
            onFocus={(e)=>{handleFocus(e)}}
            onBlur={(e)=>{handleBlur(e)}}
        />

    );
}