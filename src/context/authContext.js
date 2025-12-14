import {createContext, useContext, useState} from 'react';

// AuthContext to manage user authentication state globally
const AuthContext = createContext(undefined);

// If user refresh page, state would be lost, to stay login local memory is used
export const AuthProvider = ({ children }) => {
  
  const localUserData = localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info')) : ''
  const [state, setState] = useState({
    isLoggedin: localUserData && localUserData.userId ? true : false,
    refreshToken: localUserData && localUserData.refreshToken ? localUserData.refreshToken : '',
    accessToken: localUserData && localUserData.accessToken ? localUserData.accessToken : '',
    userId: localUserData && localUserData.userId ? localUserData.userId : '',
    userRole: localUserData && localUserData.userRole ? localUserData.userRole : '',
    userImageLink: localUserData && localUserData.userImageLink ? localUserData.userImageLink : '',
  });

  return (
    <AuthContext.Provider
      value={{
        state,
        ...state,
        onLogin: (props) => setState({
          isLoggedin: true,
          refreshToken: props.refreshToken,
          accessToken: props.accessToken,
          userId: props.userId,
          userRole: props.userRole,
          userImageLink: props.userImageLink,
        }),
        onLogout: () => {
          localStorage.removeItem('user-info');
          setState({ 
          isLoggedin: false, 
          refreshToken: '', 
          accessToken: '', 
          userId: undefined, 
          userRole: '', 
          userImageLink:'' 
        })}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
