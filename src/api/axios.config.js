import axios from 'axios';
import humps from 'humps';
import Cookies from 'js-cookie';

axios.defaults.headers.post['Content-Type'] = 'application/json';

let isRefreshing = false;
const refreshSubscribers = [];

const refresh = async (refreshToken) => {
  const response = await axios
    .create({
      baseURL: '/api',
    })
    .request({
      url: 'v1/auth/refresh',
      method: 'POST',
      data: {
        refresh_token: refreshToken,
      },
    });
  const { data: result } = response;
  return humps.camelizeKeys(result);
};
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
};

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use(async (request) => {
  const authToken = Cookies.get('token');

  if (authToken) {
    request.headers.Authorization = `Bearer ${authToken}`;
  }

  return request;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response;
    const originalRequest = config;
    if (status === 400 && data.code === 'TOKEN_EXPIRED') {
      if (!isRefreshing) {
        const refreshToken = Cookies.get('refreshToken');
        isRefreshing = true;
        refresh(refreshToken)
          .then((d) => {
            isRefreshing = false;
            Cookies.set('token', d.token);
            Cookies.set('refreshToken', d.refreshToken);
            onRrefreshed(d.token);
          });
      }
      const retryOrigReq = new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          // replace the expired token and retry
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
      return retryOrigReq;
    }

    return Promise.reject(error);
  },
);

export { axiosInstance };
