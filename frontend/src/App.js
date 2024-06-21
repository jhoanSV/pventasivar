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
        <div style={{boxShadow: '0 0 15px 20px rgba(0, 0, 0, 0.15)'}}>
          <Header/>
          <Routes/>
        </div>
      }      
    </>
  );
}

export default App;
