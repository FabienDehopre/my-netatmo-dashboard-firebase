import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import { NetatmoAuthorization } from '../models/netatmo-authorization';
import { User } from '../models/user';
import { Station } from '../models/station';
import {
  DashboardData,
  MainDashboardData,
  OutdoorDashboardData,
  WindGaugeDashboardData,
  RainGaugeDashboardData,
  IndoorDashboardData,
  mapMainDashboardData2HistoricMainDashboardData,
  mapModuleDashboardData2HistoricModuleDashboardData,
} from '../models/dashboard-data';
import { MainDevice, ModuleDevice } from '../models/device';

function refreshToken(refresh_token: string, client_id: string, client_secret: string): Promise<NetatmoAuthorization> {
  return new Promise<NetatmoAuthorization>((resolve, reject) => {
    console.log('refreshing user access token using his/her refresh token');
    rp({
      uri: 'https://api.netatmo.com/oauth2/token',
      method: 'POST',
      form: {
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token,
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      json: true,
    })
      .then(data => {
        console.log('new access token received', data);
        resolve(data);
      })
      .catch(err => {
        console.error('an error occurred while refreshing the user access token', err);
        reject(err);
      });
  });
}

export function getStationData(access_token: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    console.log("fetching the user's netatmo station data");
    rp({
      uri: 'https://api.netatmo.com/api/getstationsdata',
      method: 'POST',
      body: {
        access_token,
      },
      json: true,
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    })
      .then(data => {
        console.log('netatmo station data received successfully');
        resolve(data);
      })
      .catch(err => {
        console.error('an error occurred while fetching the netatmo station data', err);
        reject(err);
      });
  });
}

export async function ensureValidAccessToken(uid: string, user: User): Promise<string> {
  if (user.expires_at <= Date.now()) {
    console.log('user access token is expired');
    const client_id = functions.config().netatmo.client_id;
    const client_secret = functions.config().netatmo.client_secret;
    const result = await refreshToken(user.refresh_token, client_id, client_secret);
    user.access_token = result.access_token;
    user.refresh_token = result.refresh_token;
    user.expires_at = Date.now() + result.expires_in * 1000;
    await admin
      .firestore()
      .collection('/users')
      .doc(uid)
      .set(user, { merge: true });
  }

  return user.access_token;
}

export async function updateUserUnit(uid: string, user: any): Promise<void> {
  console.log('updating user with updated measure units from netatmo');
  await admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .update('units', {
      feelLike: user.administrative.feel_like_algo,
      pressureUnit: user.administrative.pressureunit,
      unit: user.administrative.unit,
      windUnit: user.administrative.windunit,
    });
}

export async function getStation(uid: string, sid: string): Promise<Station | null> {
  console.log('retrieving station from firestore', uid, sid);
  const snapshot = await admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/stations')
    .doc(sid)
    .get();
  if (snapshot.exists) {
    return snapshot.data() as Station;
  }

  return null;
}

export function convertToTimestamp(unixTimestamp: number): admin.firestore.Timestamp {
  return new admin.firestore.Timestamp(unixTimestamp, 0);
}

export function convertToGeoPoint([lng, lat]): admin.firestore.GeoPoint {
  return new admin.firestore.GeoPoint(lat, lng);
}

function compareTimestamp(ts: admin.firestore.Timestamp | number | Date, yesterday: number): boolean {
  let tsToCompare: admin.firestore.Timestamp;
  if (typeof ts === 'number') {
    console.warn('received a number instead of a Timestamp', ts);
    tsToCompare = convertToTimestamp(ts);
  } else if (ts instanceof Date) {
    console.warn('received a Date instead of a Timestamp', ts);
    tsToCompare = admin.firestore.Timestamp.fromDate(ts);
  } else {
    tsToCompare = ts;
  }

  return tsToCompare.toMillis() >= yesterday;
}

export async function insertDashboardData(uid: string, dashboardData: DashboardData): Promise<void> {
  await admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/dashboard-data')
    .add(dashboardData);
}

export async function upsertStation(uid: string, deviceId: string, stationData: Station): Promise<void> {
  const stationDoc = admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/stations')
    .doc(deviceId);
  const stationSnapshot = await stationDoc.get();
  const station = { ...stationSnapshot.data(), ...stationData };
  await stationDoc.set(station, { merge: true });
}

export function getMainDashboardData(deviceId: string, dashboardData: any): MainDashboardData {
  const mainDashboardData: MainDashboardData = {
    timeUtc: convertToTimestamp(dashboardData.time_utc),
    type: 'NAMain',
    temperature: {
      current: dashboardData.Temperature,
      min: {
        value: dashboardData.min_temp,
        timeUtc: convertToTimestamp(dashboardData.date_min_temp),
      },
      max: {
        value: dashboardData.max_temp,
        timeUtc: convertToTimestamp(dashboardData.date_max_temp),
      },
      trend: dashboardData.temp_trend,
    },
    pressure: {
      value: dashboardData.Pressure,
      absolute: dashboardData.AbsolutePressure,
      trend: dashboardData.pressure_trend,
    },
    co2: dashboardData.CO2,
    humidity: dashboardData.Humidity,
    noise: dashboardData.Noise,
    deviceId,
  };
  return mainDashboardData;
}

export function updateStationMainDevice(station: Station, device: any, mainDashboardData: MainDashboardData, yesterday: number): void {
  station.devices = station.devices || [];
  let mainDevice = station.devices.find(d => d.id === device._id && d.type === 'NAMain') as MainDevice;
  const historicDashboardData = mapMainDashboardData2HistoricMainDashboardData(mainDashboardData);
  if (mainDevice) {
    mainDevice.name = device.module_name;
    mainDevice.firmware = device.firmware;
    mainDevice.wifiStatus = device.wifi_status;
    mainDevice.current = mainDashboardData;
    mainDevice.last24hHistoric = [...mainDevice.last24hHistoric, historicDashboardData].filter(x => compareTimestamp(x.timeUtc, yesterday));
  } else {
    mainDevice = {
      id: device._id,
      name: device.module_name,
      firmware: device.firmware,
      type: 'NAMain',
      wifiStatus: device.wifi_status,
      current: mainDashboardData,
      last24hHistoric: [historicDashboardData],
    };
    station.devices.push(mainDevice);
  }
}

export function getModuleDashboardData(
  deviceId: string,
  type: 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4',
  dashboardData: any
): OutdoorDashboardData | WindGaugeDashboardData | RainGaugeDashboardData | IndoorDashboardData {
  switch (type) {
    case 'NAModule1':
      const outdoorDashboardData: OutdoorDashboardData = {
        deviceId,
        type,
        timeUtc: convertToTimestamp(dashboardData.time_utc),
        temperature: {
          current: dashboardData.Temperature,
          min: {
            value: dashboardData.min_temp,
            timeUtc: convertToTimestamp(dashboardData.date_min_temp),
          },
          max: {
            value: dashboardData.max_temp,
            timeUtc: convertToTimestamp(dashboardData.date_max_temp),
          },
          trend: dashboardData.temp_trend,
        },
        humidity: dashboardData.Humidity,
      };
      return outdoorDashboardData;
    case 'NAModule2':
      const windGaugeDashboardData: WindGaugeDashboardData = {
        deviceId,
        type,
        timeUtc: convertToTimestamp(dashboardData.time_utc),
        windStrength: dashboardData.WindStrength,
        windAngle: dashboardData.WindAngle,
        gustStrength: dashboardData.GustStrength,
        gustAngle: dashboardData.GustAngle,
        windHistoric: [
          /*TODO*/
        ],
      };
      return windGaugeDashboardData;
    case 'NAModule3':
      const rainGaugeDashboardData: RainGaugeDashboardData = {
        deviceId,
        type,
        timeUtc: convertToTimestamp(dashboardData.time_utc),
        rain: dashboardData.Rain,
        sum1h: dashboardData.sum_rain_1,
        sum24h: dashboardData.sum_rain_24,
      };
      return rainGaugeDashboardData;
    case 'NAModule4':
      const indoorDashboardData: IndoorDashboardData = {
        deviceId,
        type,
        timeUtc: convertToTimestamp(dashboardData.time_utc),
        temperature: {
          current: dashboardData.Temperature,
          min: {
            value: dashboardData.min_temp,
            timeUtc: convertToTimestamp(dashboardData.date_min_temp),
          },
          max: {
            value: dashboardData.max_temp,
            timeUtc: convertToTimestamp(dashboardData.date_max_temp),
          },
          trend: dashboardData.temp_trend,
        },
        humidity: dashboardData.Humidity,
        co2: dashboardData.CO2,
      };
      return indoorDashboardData;
  }

  throw new Error('Invalid module type');
}

export function updateStationModuleDevice(
  station: Station,
  module: any,
  moduleDashboardData: OutdoorDashboardData | WindGaugeDashboardData | RainGaugeDashboardData | IndoorDashboardData,
  yesterday: number
): void {
  station.devices = station.devices || [];
  let moduleDevice = station.devices.find(d => d.id === module._id && d.type === module.type) as ModuleDevice;
  const historicDashboardData = mapModuleDashboardData2HistoricModuleDashboardData(moduleDashboardData);
  if (moduleDevice) {
    moduleDevice.rfStatus = module.rf_status;
    moduleDevice.battery = {
      vp: module.battery_vp,
      percent: module.battery_percent,
    };
    moduleDevice.current = moduleDashboardData;
    moduleDevice.last24hHistoric = [...moduleDevice.last24hHistoric, historicDashboardData].filter(x =>
      compareTimestamp(x.timeUtc, yesterday)
    );
  } else {
    moduleDevice = {
      id: module._id,
      name: module.module_name,
      firmware: module.firmware,
      type: module.type,
      rfStatus: module.rf_status,
      battery: {
        vp: module.battery_vp,
        percent: module.battery_percent,
      },
      current: moduleDashboardData,
      last24hHistoric: [historicDashboardData],
    };
    station.devices.push(moduleDevice);
  }
}
