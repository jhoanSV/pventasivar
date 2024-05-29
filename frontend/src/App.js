import './_App.scss';
import { Login } from './Pages';
import { Header } from './Layouts';
import { Routes } from "./Routes";
import { useTheContext } from './TheProvider';

function App() {
  
  const { logged, someData } = useTheContext();
  
  return (
    <>
      {(!logged) ?
        <>
          <Login
          />
        </>
        :
        <>
          <div style={{position: 'fixed', top: '0', left: '50%', zIndex: '1', color: 'white'}}>
            {someData && someData.pcosto}
          </div>
          <Header/>
          <Routes/>
        </>
      }      
    </>
  );
}

export default App;
