import { createContext, useContext, useState, useMemo } from "react";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserAuthContext.Provider value={{ user, setUser}}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
