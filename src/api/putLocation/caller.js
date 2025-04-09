import humps from 'humps';
import { Method } from '../promise-request';

const payload = {
  "lat": 25.033539882710834,
  "lon": 121.53532788446527,
  "permission_granted": false,
  "country_code": "TW",
  "token": "07732226-2165-4078-861e-e79166bf7b76",
  "device_model": "iPhone 7 Plus",
  "device_system_name": "iOS",
  "device_system_version": "15.8.3",
  "app_version": "1.219.0",
  "build_number": "1.219.0.0",
  "locale": "zh-TW",
  "device_token": "0728EBDE-7B0E-47EB-A130-2D0E1630F432"
}

const caller = (data) => {
  const {
    deviceConfig,
    token,
    permissionGranted = false,
    lat,
    lon,
  } = data;

  if (!token || !lat || !lon) return;

  const url = `/me/location`;

  return ({
    method: Method.PUT,
    url,
    data: humps.decamelizeKeys({
      ...deviceConfig,
      lat: parseFloat(lat).toFixed(15),
      lon: parseFloat(lon).toFixed(15),
      token,
      permissionGranted,
    }),
  });
};

export default caller;
