import React, {
  createContext, useState, useContext,
} from 'react';

export const accountConfigs = [
  {
    name: '33933',
    token: 'fb68946e-b2a3-4a3b-ac8b-0a7982ebd813'
  },
  {
    name: '8018',
    token: '07732226-2165-4078-861e-e79166bf7b76',
  }
];

const ApplicationContext = createContext({
  token: undefined,
});

const useApplicationProvider = () => {
  const [token, setToken] = useState();
  const [isLogin, setLogin] = useState(false);

  return ({
    token,
    setToken,
    accountConfigs,
    isLogin,
    setLogin,
  })
};

export const ApplicationProvider = ({ children }) => {
  const value = useApplicationProvider();
  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};

export const useApplicationContext = () => useContext(ApplicationContext);
