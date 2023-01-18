import humps from 'humps';
import { Method } from '../promise-request';

const caller = (data) => {
  const {
    name,
    password,
  } = data;

  const url = `/login`;

  return ({
    method: Method.POST,
    url,
    data: humps.decamelizeKeys({
      name, password,
    }),
  });
};

export default caller;