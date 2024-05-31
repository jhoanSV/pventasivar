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
        <>
          <Header/>
          <Routes/>
        </>
      }      
    </>
  );
}

export default App;
