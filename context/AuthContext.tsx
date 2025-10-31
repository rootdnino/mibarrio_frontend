import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Definimos la forma que tendrá nuestro contexto
const AuthContext = createContext({
  authToken: null,
  isLoading: true,
  signIn: async (token) => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setAuthToken(token);
        }
      } catch (e) {
        console.error('Failed to load the auth token', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setAuthToken(token);
    } catch (e) {
      console.error('Failed to save the auth token', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setAuthToken(null);
    } catch (e) {
      console.error('Failed to remove the auth token', e);
    }
  };
  
  return (
    <AuthContext.Provider value={{ authToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// El hook personalizado sigue igual
export const useAuth = () => {
  return useContext(AuthContext);
};