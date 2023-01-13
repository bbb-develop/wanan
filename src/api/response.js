import get from 'lodash/get';

const buildResponseError = (error) => {
  const status = get(error, 'response.data.status') || get(error, 'response.status');
  const message = get(error, 'response.data.message');
  const data = get(error, 'response.data.data') || get(error, 'response.data');
  const code = get(error, 'response.data.code') || get(error, 'response.data.error.code');

  return {
    status,
    message,
    data,
    code,
  };
};

export { buildResponseError };
