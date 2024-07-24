import React, { useEffect, useState } from 'react';

export const TheInput = ({
    id='',//*id to set an id, if isnt provided then id is empty
    className='',//*class to set an class, if isnt provided then id is empty
    val='',//*here comes the defaul value, if isnt provided then value is empty
    numType='real',//*numType to define the number type between naturals(nat), integers(ent), reals(real). If is not provided then will be real
    onchange=false,//*next three props are to set an onchange, onblur and onfocus, pls set like this (e)=>{function(e)} where e is the value of the input. e is not really necesary
    onblur=false,
    onfocus=false,
    autofocus=false,
    sTyle={},
    pholder=''}) => {

    const [value, setValue] = useState(val);
    
    const Formater = (number) =>{
        //*it gives a number format        
        if (!number) return ''
        const numberfromat = Number(number.replace(/,/g, '.'));
        return Intl.NumberFormat('de-DE').format(numberfromat);
    }
    
    const handleChange = (e) => {
        const characters = (numType==='nat') ? //*for natural numbers
            ['1','2','3','4','5','6','7','8','9','0','']
            : (numType==='ent') ? //*for integer numbers
            ['1','2','3','4','5','6','7','8','9','0','-','']
            : (numType==='real') && //*for real numbers
            ['1','2','3','4','5','6','7','8','9','0','-','.',',','']
        console.log(e.nativeEvent.data);
        if (characters.includes(e.nativeEvent.data) || e.nativeEvent.data===null) {
            let a = e.target.value;
            //if(a.slice(-1) === '.') a = a.slice(0, -1) + ','; //*If you enter ".", it changes to ","
            if(e.nativeEvent.data === '.') a = a.replace(/\./g, ",") //*If you enter ".", it changes to ","
            setValue(a)
            if(onchange)onchange(a)
        }
    }


    const handleBlur = (e) => {
        //*gives a number format at the moment of leave the element
        const formattedValue = Formater(e.target.value);
        if (formattedValue==='NaN') {
            setValue(0)
            if(onblur)onblur(0)
        }else{
            setValue(formattedValue)            
            if(onblur)onblur(formattedValue)
        }
    };

    const handleFocus = (e) => {
        //*remove the format while the user is focused on the element
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
            style={sTyle}
            className={className}
            value={value}
            placeholder={pholder}
            onChange={(e)=>{handleChange(e)}}
            onFocus={(e)=>{handleFocus(e)}}
            onBlur={(e)=>{handleBlur(e)}}
            autoFocus={autofocus}
        />

    );
}