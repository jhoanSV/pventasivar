import './_App.scss';
import { Login } from './Pages';
import { Header } from './Layouts';
import { Routes } from "./Routes";
import { useTheContext } from './TheProvider';

function App() {
  
  const { logged } = useTheContext();
  
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

export default App;
