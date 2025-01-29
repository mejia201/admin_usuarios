import React, { createContext, useState, useContext, useEffect } from "react";


const UserContext = createContext();


export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);


  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Limpia el localStorage si no hay usuario
    }
  }, [user]);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
