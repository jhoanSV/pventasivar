import React, { useState, createContext, useContext } from "react";

const TheContext = createContext();

export const useTheContext = () => {
    return useContext(TheContext);
};

export const TheProvider = ({ children }) => {    
    
    const [logged, setLogged] = useState(false);
  
    return (
      <TheContext.Provider value={{
          logged, setLogged,
        }}>
        {children}
      </TheContext.Provider>
    );
  };