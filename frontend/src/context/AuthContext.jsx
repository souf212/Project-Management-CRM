import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const login = async (email, password) => {
    console.log("AuthContext: login called");
    try {
      const data = await AuthService.login(email, password);
      console.log("AuthContext: login success, setting user", data);
      setCurrentUser(data);
      return data;
    } catch (e) {
      console.error("AuthContext: login failed", e);
      throw e;
    }
  };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    const register = async (email, password) => {
        return await AuthService.register(email, password);
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
