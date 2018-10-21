import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as rp from 'request-promise';
import { User } from './models/user';
import { NetatmoAuthorization } from './models/netatmo-authorization';
import { Station } from './models/station';
import {
  MainDevice,
  ModuleDevice,
  OutdoorModuleDevice,
  WindGaugeModuleDevice,
  RainGaugeModuleDevice,
  IndoorModuleDevice,
  Device,
} from './models/device';
import {
  DashboardData,
  MainDashboardData,
  OutdoorDashboardData,
  WindGaugeDashboardData,
  RainGaugeDashboardData,
  IndoorDashboardData,
} from './models/dashboard-data';

admin.initializeApp();

export const fetchAndUpdate = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection('/users')
      .get();
    console.log('Fetched all users from /users', snapshot.size);
    let count = 0;
    for (const doc of snapshot.docs) {
      console.log('Starting to work with user', doc.id);
      const user = doc.data() as User;
      const uid = doc.id;
      if (user.enabled) {
        console.log('user is enabled');
        if (user.expires_at <= Date.now()) {
          console.log('user access token is expired');
          const result = await refreshToken(user.refresh_token, user.client_id, user.client_secret);
          user.access_token = result.access_token;
          user.refresh_token = result.refresh_token;
          user.expires_at = Date.now() + result.expires_in * 1000;
          await admin
            .firestore()
            .collection('/users')
            .doc(uid)
            .set(user, { merge: true });
        }

        const data = await getStationData(user.access_token);

        // update user units
        user.unit = data.body.user.administrative.unit;
        user.windUnit = data.body.user.administrative.windunit;
        user.pressureUnit = data.body.user.administrative.pressureunit;
        user.feelLike = data.body.user.administrative.feel_like_algo;
        console.log('updating user with updated measure units from netatmo');
        await admin
          .firestore()
          .collection('/users')
          .doc(uid)
          .set(user, { merge: true });

        console.log('starting to process the devices', data.body.devices.length);
        for (const device of data.body.devices) {
          const mainDeviceId = device._id;
          count++;

          const station: Station = {
            name: device.station_name,
            location: {
              country: device.place.country,
              city: device.place.city,
              timezone: device.place.timezone,
              location: device.place.location,
              altitude: device.place.altitude,
            },
          };
          console.log('upserting the user station', uid, mainDeviceId);
          await upsertStation(uid, mainDeviceId, station);

          const mainDevice: MainDevice = {
            name: device.module_name,
            firmware: device.firmware,
            type: 'NAMain',
            wifiStatus: device.wifi_status,
          };
          console.log('upserting the user main device', uid, mainDeviceId);
          await upsertDevice(uid, mainDeviceId, mainDeviceId, mainDevice);

          const mainDashboardData: MainDashboardData = {
            timeUtc: device.dashboard_data.time_utc,
            type: 'NAMain',
            temperature: {
              current: device.dashboard_data.Temperature,
              min: {
                value: device.dashboard_data.min_temp,
                timeUtc: device.dashboard_data.date_min_temp,
              },
              max: {
                value: device.dashboard_data.max_temp,
                timeUtc: device.dashboard_data.date_max_temp,
              },
              trend: device.dashboard_data.temp_trend,
            },
            pressure: {
              value: device.dashboard_data.Pressure,
              absolute: device.dashboard_data.AbsolutePressure,
              trend: device.dashboard_data.pressure_trend,
            },
            co2: device.dashboard_data.CO2,
            humidity: device.dashboard_data.Humidity,
            noise: device.dashboard_data.Noise,
          };
          console.log('inserting the user main device data', uid, mainDeviceId);
          await insertDashboardData(uid, mainDeviceId, mainDeviceId, mainDashboardData);

          console.log('starting to process the modules', device.modules.length);
          for (const module of device.modules) {
            const deviceId = module._id;
            let moduleDevice: ModuleDevice;
            let moduleDashboardData: DashboardData;
            if (module.type === 'NAModule1') {
              moduleDevice = {
                name: module.module_name,
                firmware: module.firmware,
                type: 'NAModule1',
                rfStatus: module.rf_status,
                battery: {
                  vp: module.battery_vp,
                  percent: module.battery_percent,
                },
              } as OutdoorModuleDevice;
              moduleDashboardData = {
                timeUtc: module.dashboard_data.time_utc,
                type: 'NAModule1',
                temperature: {
                  current: module.dashboard_data.Temperature,
                  min: {
                    value: module.dashboard_data.min_temp,
                    timeUtc: module.dashboard_data.date_min_temp,
                  },
                  max: {
                    value: module.dashboard_data.max_temp,
                    timeUtc: module.dashboard_data.date_max_temp,
                  },
                  trend: module.dashboard_data.temp_trend,
                },
                humidity: module.dashboard_data.Humidity,
              } as OutdoorDashboardData;
            } else if (module.type === 'NAModule2') {
              moduleDevice = {
                name: module.module_name,
                firmware: module.firmware,
                type: 'NAModule2',
                rfStatus: module.rf_status,
                battery: {
                  vp: module.battery_vp,
                  percent: module.battery_percent,
                },
              } as WindGaugeModuleDevice;
              moduleDashboardData = {
                timeUtc: module.dashboard_data.time_utc,
                type: 'NAModule2',
                // TODO
              } as WindGaugeDashboardData;
            } else if (module.type === 'NAModule3') {
              moduleDevice = {
                name: module.module_name,
                firmware: module.firmware,
                type: 'NAModule3',
                rfStatus: module.rf_status,
                battery: {
                  vp: module.battery_vp,
                  percent: module.battery_percent,
                },
              } as RainGaugeModuleDevice;
              moduleDashboardData = {
                timeUtc: module.dashboard_data.time_utc,
                type: 'NAModule3',
                // TODO
              } as RainGaugeDashboardData;
            } else if (module.type === 'NAModule4') {
              moduleDevice = {
                name: module.module_name,
                firmware: module.firmware,
                type: 'NAModule4',
                rfStatus: module.rf_status,
                battery: {
                  vp: module.battery_vp,
                  percent: module.battery_percent,
                },
              } as IndoorModuleDevice;
              moduleDashboardData = {
                timeUtc: module.dashboard_data.time_utc,
                type: 'NAModule4',
                temperature: {
                  current: module.dashboard_data.Temperature,
                  min: {
                    value: module.dashboard_data.min_temp,
                    timeUtc: module.dashboard_data.date_min_temp,
                  },
                  max: {
                    value: module.dashboard_data.max_temp,
                    timeUtc: module.dashboard_data.date_max_temp,
                  },
                  trend: module.dashboard_data.temp_trend,
                },
                humidity: module.dashboard_data.Humidity,
                co2: module.dashboard_data.CO2,
              } as IndoorDashboardData;
            } else {
              continue;
            }

            console.log('upserting the module device', uid, mainDeviceId, deviceId);
            await upsertDevice(uid, mainDeviceId, deviceId, moduleDevice);
            console.log('inserting module device data', uid, mainDeviceId, deviceId);
            await insertDashboardData(uid, mainDeviceId, deviceId, moduleDashboardData);
          }

          console.log('ending to process the modules');
        }
      } else {
        console.log('user is disabled');
      }
    }

    console.log('done');
    return res.json(count);
  } catch (err) {
    console.error('An error occurred', err);
    return res.status(500).send(err);
  }
});

async function insertDashboardData(uid: string, stationId: string, deviceId: string, dashboardData: DashboardData): Promise<void> {
  await admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/stations')
    .doc(stationId)
    .collection('/devices')
    .doc(deviceId)
    .collection('/dashboard-data')
    .add(dashboardData);
}

async function upsertDevice(uid: string, stationId: string, deviceId: string, deviceData: Device): Promise<void> {
  const deviceDoc = admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/stations')
    .doc(stationId)
    .collection('/devices')
    .doc(deviceId);
  const deviceSnapshot = await deviceDoc.get();
  const device = { ...deviceSnapshot.data(), deviceData };
  await deviceDoc.set(device, { merge: true });
}

async function upsertStation(uid: string, deviceId: string, stationData: Station): Promise<void> {
  const stationDoc = admin
    .firestore()
    .collection('/users')
    .doc(uid)
    .collection('/stations')
    .doc(deviceId);
  const stationSnapshot = await stationDoc.get();
  const station = { ...stationSnapshot.data(), stationData };
  await stationDoc.set(station, { merge: true });
}

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

function getStationData(access_token: string): Promise<any> {
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
