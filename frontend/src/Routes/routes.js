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
         BalanceReport,
         InvAdjustment,
         ProductsList,
         Inventory,
         AccountState
} from "../Pages";

export function RoutesComponent() {
    return (      
        <Routes>
            <Route path='/' element={ <Sales/> }/>
            <Route path='/NewProduct' element={ <Newproduct/> }/>
            <Route path='/Customerlist' element={ <Customerlist/> }/>
            <Route path='/Newcustomer' element={ <Newcustomer/> }/>
            <Route path='/BalanceReport' element={ <BalanceReport/>}/>
            <Route path='/AccountState' element={ <AccountState/>}/>
            <Route path='/Supplierlist' element={ <Supplierlist/> }/>
            <Route path='/Newsupplier' element={ <Newsupplier/> }/>
            <Route path='/Newpurchase' element={ <Newpurchase/> }/>
            <Route path='/InvAdjustment' element={ <InvAdjustment/> }/>
            <Route path='/ProductsList' element={ <ProductsList/> }/>
            <Route path='/Inventory' element={ <Inventory/> }/>
        </Routes>
    );
}