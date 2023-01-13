import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil';

import { axiosInstance as defaultAxiosInstance } from './axios.config';
import { buildResponseError } from './response';

export const Method = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

const defaultTransform = (data) => data;
const checkNonNil = (value) => !isNil(value);

const promiseRequest = (
  caller,
  transform = defaultTransform,
  {
    axiosInstance = defaultAxiosInstance,
  } = {},
) => (requestData) => {
  const {
    method = Method.GET,
    url,
    data,
    headers,
  } = caller(requestData);
  const dataKey = [Method.GET, Method.DELETE].includes(method) ? 'params' : 'data';
  const requestOptions = {
    url,
    method,
    headers: pickBy(headers, checkNonNil),
    [dataKey]: pickBy(data, checkNonNil),
  };

  return axiosInstance
    .request(requestOptions)
    .then((response) => ({
      data: transform(response.data),
      error: false,
    }))
    .catch((error) => {
      // eslint-disable-next-line no-shadow
      const { data, message, code } = buildResponseError(error);
      const errPayload = {
        data: null,
        error: {
          message,
          code,
          ...data,
        },
      };
      return Promise.resolve(errPayload);
    });
};

export default promiseRequest;
