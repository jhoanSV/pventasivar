import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Customerlist,
         //Login,
         Newcustomer,
         //Newproduct,
         Newpurchase,
         Newsupplier,
         Sales
} from "../Pages";

export function RoutesComponent() {
    return (
      <Router>
          <Routes>
              <Route path='/' element={ <Newpurchase/> }/>
              <Route path='Customerlist' element={ <Customerlist/> }/>
              <Route path='Newcustomer' element={ <Newcustomer/> }/>              
              <Route path='Newsupplier' element={ <Newsupplier/> }/>
              <Route path='Sales' element={ <Sales/> }/>
          </Routes>
      </Router>
    );
}