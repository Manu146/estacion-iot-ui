import { createContext } from "preact";
import { useState } from "preact/hooks";

export const AuthContext = createContext({ token: null, setToken: () => {} });

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
