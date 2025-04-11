import { Method } from '../promise-request';

const caller = (data) => {
  const {
    deviceConfig,
    limit = 100,
    offset = 0,
    type = 'normal',
    codePushVersion = 'v2',
    token,
  } = data;

  const url = '/rooms';

  return ({
    method: Method.GET,
    url,
    data: {
      ...deviceConfig,
      limit,
      offset,
      type,
      token,
    },
  });
};

export default caller;