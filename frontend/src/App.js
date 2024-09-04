import { useEffect, useState } from 'react';
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
  const [updateAvailable, setUpdateAvailable] = useState('');

  if(!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));

  useEffect(() => {
    if(localStorage.getItem('cart')) setNItemsCart(JSON.parse(localStorage.getItem('cart')).length)
    console.log('someData', someData);
  }, [someData]);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setTimeout(() => {
          setUpdateAvailable('available');
      }, 2000);
    };
    const handleUpdateNotAvailable = () => {
      setTimeout(() => {
        setUpdateAvailable('unavailable');
      }, 2000);
    };
    const handleUpdateDownloaded = () => {
      setTimeout(() => {
        setUpdateAvailable('downloaded');
      }, 2000);
    };
    //! Care with this, window.electron doesnt works on devMode, only in production
    //? To solve this comment all windoe.electron lines and uncomment the line handleUpdateNotAvailable();
    handleUpdateNotAvailable();
      
    /*window.electron.onUpdateAvailable(handleUpdateAvailable);
    window.electron.onUpdateNotAvailable(handleUpdateNotAvailable);
    window.electron.onUpdateDownloaded(handleUpdateDownloaded);
    window.electron.onUpdateError(()=>{
        alert('Cant check versions');
    });

    // Cleanup the event listeners on component unmount
    return () => {
        window.electron.onUpdateAvailable(() => {});
        window.electron.onUpdateNotAvailable(() => {});
        window.electron.onUpdateError(()=>{});
        window.electron.onUpdateDownloaded(()=>{});
    };*/
}, []);
  
  return (
    <>
      {updateAvailable === '' ?
        <div className='BPContainer'>
          <div className='BegPage'>
            <div style={{textAlign: 'center'}}>Buscando actualizaciones</div>
            {['tornilleria', 'estudiantil', 'gas', 'griferia', 'electricos', 'ebanisteria'].map((item, index) => (
                <i key={index} className={`icon-${item} cr${item} iconBegPage`}></i>
            ))}
          </div>
        </div>
      :updateAvailable === 'available' ?
        <div className='BPContainer'>
          <div className='BegPage'>
            <div style={{textAlign: 'center'}}>Se encontr&oacute; una actualizaci&oacute;n. Descargando...</div>
          </div>
        </div>
      :updateAvailable === 'downloaded' ?
        <div className='BPContainer'>
          <div className='BegPage'>
            <div style={{textAlign: 'center'}}>Se reiniciar&aacute; el programa para instalar la actualizaci&oacute;n</div>
          </div>
        </div>
      :updateAvailable === 'unavailable' ?
        <>
          {  (!logged) ?
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
        :
        <></>
      }
    </>
  );
}