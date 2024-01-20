import {createContext, useContext, useState} from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isLoggedin: false,
    refreshToken: '',
    accessToken: '',
    userId: undefined,
    userRole: ''
  });

  return (
    <AuthContext.Provider
      value={{
        state,
        ...state,
        onLogin: (refreshToken, accessToken, userId, userRole) => setState({
          isLoggedin: true,
          refreshToken,
          accessToken,
          userId,
          userRole }),
        onLogout: () => setState({ isLoggedin: false, refreshToken: '', accessToken: '', userId: undefined, userRole: '' }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
