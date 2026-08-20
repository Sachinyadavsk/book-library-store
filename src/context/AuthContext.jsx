import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    () => authService.getUser()
  );

  const [loading, setLoading] = useState(true);

  // ============================================
  // CHECK AUTH ON APP LOAD
  // ============================================
  useEffect(() => {

    const checkAuth = async () => {

      const token =
        authService.getToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {

        const response =
          await authService.getCurrentUser();

        setUser(
          response?.user || null
        );

      } catch (error) {

        console.error(
          "Authentication check failed:",
          error
        );

        authService.clearAuth();
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();

  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (
    email,
    password
  ) => {

    const response =
      await authService.login(
        email,
        password
      );

    setUser(
      response?.user || null
    );

    return response;
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (
    userData
  ) => {

    const response =
      await authService.register(
        userData
      );

    return response;
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {

    await authService.logout();

    setUser(null);
  };

  // ============================================
  // UPDATE USER
  // ============================================
  const updateUser = (updatedUser) => {

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  // ============================================
  // VALUES
  // ============================================
  const value = {
    user,

    loading,

    isLoggedIn: !!user,

    isAdmin:
      user?.role === "admin" ||
      user?.isAdmin === true ||
      user?.userType === "admin",

    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;