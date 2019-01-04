import * as admin from 'firebase-admin';
import { pubsub } from 'firebase-functions';

import { User } from '../../models/user';
import {
  ensureValidAccessToken,
  getStationData,
  updateUserUnit,
  getStation,
  convertToGeoPoint,
  upsertStation,
  insertDashboardData,
  getMainDashboardData,
  updateStationMainDevice,
  getModuleDashboardData,
  updateStationModuleDevice,
} from '../common';

export const fetchAndUpdatePubSub = pubsub.topic('netatmo').onPublish(async () => {
  try {
    const snapshot = await admin
      .firestore()
      .collection('/users')
      .get();
    console.log('Fetched all users from /users', snapshot.size);
    for (const doc of snapshot.docs) {
      console.log('Starting to work with user', doc.id);
      const user = doc.data() as User;
      if (!user.enabled) {
        console.log('user is disabled');
        continue;
      }

      const uid = doc.id;
      console.log('user is enabled');
      const accessToken = await ensureValidAccessToken(uid, user);
      const data = await getStationData(accessToken);
      const yesterday = Date.now() - 86400000;
      await updateUserUnit(uid, data.body.user);
      console.log('starting to process the devices', data.body.devices.length);
      for (const device of data.body.devices) {
        const station = (await getStation(uid, device._id)) || {
          name: device.station_name,
          location: {
            country: device.place.country,
            city: device.place.city,
            timezone: device.place.timezone,
            location: convertToGeoPoint(device.place.location),
            altitude: device.place.altitude,
          },
          devices: [],
        };

        const mainDashboardData = getMainDashboardData(device._id, device.dashboard_data);
        console.log('inserting the user main device data', uid, device._id);
        await insertDashboardData(uid, mainDashboardData);
        updateStationMainDevice(station, device, mainDashboardData, yesterday);

        console.log('starting to process the modules', device.modules.length);
        for (const module of device.modules) {
          const deviceId = module._id;
          const moduleDashboardData = getModuleDashboardData(deviceId, module.type, module.dashboard_data);
          await insertDashboardData(uid, moduleDashboardData);
          updateStationModuleDevice(station, module, moduleDashboardData, yesterday);
        }

        console.log('upserting the user station', uid, device._id);
        await upsertStation(uid, device._id, station);
      }
    }
  } catch (err) {
    console.error('An error occurred', err);
  }
});
