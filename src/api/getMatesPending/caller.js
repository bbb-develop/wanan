import humps from 'humps';
import { Method } from '../promise-request';

const caller = (data) => {
  const {
    limit = 50,
    offset = 0,
    countryCode = 'TW',
    deviceModel = 'iPhone',
    deviceSystemName = 'iOS',
    deviceSystemVersion = '16.0.2',
    appVersion = '1.146.0',
    buildNumber = '1.146.0.4',
    locale = 'en-TW',
    deviceToken = '0728EBDE-7B0E-47EB-A130-2D0E1630F432',
    codePushVersion = 'v2',
    viewFrom = 'friend',
    token,
  } = data;
  
  if (!token) return;

  const url = `/mates/pending`;

  return ({
    method: Method.GET,
    url,
    data: humps.decamelizeKeys({
      limit,
      offset,
      countryCode,
      deviceModel,
      deviceSystemName,
      deviceSystemVersion,
      appVersion,
      buildNumber,
      locale,
      deviceToken,
      codePushVersion,
      viewFrom,
      token,
    }),
  });
};

export default caller;