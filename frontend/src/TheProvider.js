import React, { useState, createContext, useContext } from "react";

const TheContext = createContext();

export const useTheContext = () => {
    return useContext(TheContext);
};

export const TheProvider = ({ children }) => {    
    
    const [logged, setLogged] = useState(false);
    const [section, setSection] = useState('Nueva Venta');
  
    return (
      <TheContext.Provider value={{
          logged, setLogged,
          section, setSection,
        }}>
        {children}
      </TheContext.Provider>
    );
  };