import { useEffect } from 'react';
import './_App.scss';
import { Header } from './Layouts';
import { Login } from './Pages';
import { Routes } from "./Routes";
import { useTheContext } from './TheProvider';

export const Formater = (number) =>{
  //it gives a number format
  if (number === '') return '';
  const numberString = String(number).replace(/,/g, '.');
  const numberfromat = Number(numberString);
  return Intl.NumberFormat('de-DE').format(numberfromat);
};

export const App = () => {
  
  const { logged, someData, setNItemsCart } = useTheContext();

  if(!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));

  useEffect(() => {
    if(localStorage.getItem('cart')) setNItemsCart(JSON.parse(localStorage.getItem('cart')).length)
    console.log('someData', someData);
  }, [someData]);
  
  return (
    <>
      {(!logged) ?
        <>
          <Login
          />
        </>
        :
        <div style={{boxShadow: 'rgb(0 0 0 / 28%) 0px 0px 15px 20px'}}>
          <Header/>
          <Routes/>
        </div>
      }      
    </>
  );
}