import React, { useState, createContext, useContext } from "react";

const TheContext = createContext();

export const useTheContext = () => {
    return useContext(TheContext);
};

export const TheProvider = ({ children }) => {    
    
    const [logged, setLogged] = useState(false);
    const [section, setSection] = useState('Nueva Venta');
    const [someData, setSomeData] = useState(null);
    const [invAdAuth, setInvAdAuth] = useState(false);
  
    return (
      <TheContext.Provider value={{
          logged, setLogged,
          section, setSection,
          someData, setSomeData,
          invAdAuth, setInvAdAuth,
        }}>
        {children}
      </TheContext.Provider>
    );
  };