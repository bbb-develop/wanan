import humps from 'humps';
import { Method } from '../promise-request';

const caller = (data) => {
  const {
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
    price = null,
    message,
    roomId,
  } = data;

  if (!token || !roomId || !message) return;

  const url = `/rooms/${roomId}/message`;

  return ({
    method: Method.POST,
    url,
    data: humps.decamelizeKeys({
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
      price,
      message,
    }),
  });
};

export default caller;