import { Method } from '../promise-request';

const caller = (data) => {
  const {
    limit = 100,
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
  } = data;

  const url = '/rooms';

  return ({
    method: Method.GET,
    url,
    data: {
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
    },
  });
};

export default caller;