import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Загрузить данные об авторизации из локального хранилища или API
  useEffect(() => {
    const checkAuth = async () => {
      // Здесь должна быть ваша логика для проверки авторизации
      // Например, проверка токена в AsyncStorage или запрос на сервер
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    // Удалить токен
    AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
