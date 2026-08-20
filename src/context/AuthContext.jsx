import React, {
  createContext,
  useContext,
  useState,
} from "react";

import authService from "../services/authService";
const AuthContext = createContext(null);
export const AuthProvider = ({ children, }) => {

  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());

  // LOGIN
  const login = (userData, userToken) => {
    authService.setUser(userData);
    authService.setToken(userToken);
    setUser(userData);
    setToken(userToken);
  };

  // LOGOUT
  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setToken(null);
  };

  // AUTH STATUS
  const isAuthenticated = !!user && !!token;
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// USE AUTH
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }
  return context;
};

export default AuthContext;