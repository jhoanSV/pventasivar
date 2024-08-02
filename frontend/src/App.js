import './_App.scss';
import { Header } from './Layouts';
import { Login } from './Pages';
import { Routes } from "./Routes";
import { useTheContext } from './TheProvider';

export const App = () => {
  
  const { logged, someData } = useTheContext();
  
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