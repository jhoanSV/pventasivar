import React, { useState, createContext, useContext } from "react";

const TheContext = createContext();

export const useTheContext = () => {
    return useContext(TheContext);
};

export const TheProvider = ({ children }) => {    
    
    const [logged, setLogged] = useState(false);
    const [usD, setUsD] = useState();
    const [section, setSection] = useState('Nueva Venta');
    const [someData, setSomeData] = useState(null);
    const [productCodes, setProductCodes] = useState([]);
    const [invAdAuth, setInvAdAuth] = useState(false);
    const [nItemsCart, setNItemsCart] = useState(0);
  
    return (
      <TheContext.Provider value={{
          logged, setLogged,
          usD, setUsD,
          section, setSection,
          someData, setSomeData,
          invAdAuth, setInvAdAuth,
          productCodes, setProductCodes,
          nItemsCart, setNItemsCart,
        }}>
        {children}
      </TheContext.Provider>
    );
  };