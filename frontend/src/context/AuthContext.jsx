import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('accessToken')
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  function login(authToken, userData) {
    localStorage.setItem('accessToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
