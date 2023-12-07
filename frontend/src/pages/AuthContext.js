import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const savedAuthData = sessionStorage.getItem("authData");
    return savedAuthData
      ? JSON.parse(savedAuthData)
      : {
          userProfileImage: "",
          userName: "",
          userId: "",
          Id: "",
          isLogin: false,
        };
  });
  const login = (userData) => {
    setAuthData({
      ...authData,
      ...userData,
      isLogin: true,
    });
    sessionStorage.setItem("authData", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthData({
      userProfileImage: "",
      userName: "",
      userId: "",
      Id: "",
      isLogin: false,
    });
    sessionStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
