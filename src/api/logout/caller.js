import { Method } from '../promise-request';

const caller = (data) => {

  const url = `/logout`;

  return ({
    method: Method.POST,
    url,
  });
};

export default caller;