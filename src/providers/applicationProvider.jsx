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

const defaultDeviceConfig = {
  countryCode: 'TW',
  deviceModel: 'iPhone',
  deviceSystemName: 'iOS',
  deviceSystemVersion: '16.0.2',
  appVersion: '1.146.0',
  buildNumber: '1.146.0.4',
  locale: 'en-TW',
  deviceToken: '0728EBDE-7B0E-47EB-A130-2D0E1630F432',
}

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
    deviceConfig: defaultDeviceConfig,
  })
};

export const ApplicationProvider = ({ children }) => {
  const value = useApplicationProvider();
  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};

export const useApplicationContext = () => useContext(ApplicationContext);
