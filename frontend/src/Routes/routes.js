import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Customerlist,
         //Login,
         Newcustomer,
         Newproduct,
         Newpurchase,
         Newsupplier,
         Sales,
         Supplierlist,
} from "../Pages";

export function RoutesComponent() {
    return (      
        <Routes>
            <Route path='/' element={ <Newpurchase/> }/>
            <Route path='/Customerlist' element={ <Customerlist/> }/>
            <Route path='/Newcustomer' element={ <Newcustomer/> }/>
            <Route path='/Supplierlist' element={ <Supplierlist/> }/>
            <Route path='/Newsupplier' element={ <Newsupplier/> }/>
            <Route path='/NewProduct' element={ <Newproduct/> }/>
            <Route path='/Sales' element={ <Sales/> }/>
        </Routes>
    );
}