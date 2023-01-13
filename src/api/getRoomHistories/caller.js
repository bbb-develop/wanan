import humps from 'humps';
import { Method } from '../promise-request';

const caller = (data) => {
  const {
    limit = 50,
    offset = 0,
    type = 'normal',
    countryCode = 'TW',
    deviceModel = 'iPhone',
    deviceSystemName = 'iOS',
    deviceSystemVersion = '16.0.2',
    appVersion = '1.146.0',
    buildNumber = '1.146.0.4',
    locale = 'en-TW',
    deviceToken = '0728EBDE-7B0E-47EB-A130-2D0E1630F432',
    codePushVersion = 'v2',
    token,
    roomId,
  } = data;

  if (!token || !roomId) return;

  const url = '/room/histories';

  return ({
    method: Method.GET,
    url,
    data: humps.decamelizeKeys({
      limit,
      offset,
      type,
      countryCode,
      deviceModel,
      deviceSystemName,
      deviceSystemVersion,
      appVersion,
      buildNumber,
      locale,
      deviceToken,
      codePushVersion,
      token,
      roomId,
    }),
  });
};

export default caller;