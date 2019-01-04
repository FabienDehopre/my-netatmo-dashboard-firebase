import * as admin from 'firebase-admin';
import { https } from 'firebase-functions';
import { User } from '../../models/user';
import {
  ensureValidAccessToken,
  getStationData,
  updateUserUnit,
  getStation,
  convertToGeoPoint,
  upsertStation,
  getMainDashboardData,
  insertDashboardData,
  updateStationMainDevice,
  getModuleDashboardData,
  updateStationModuleDevice,
} from '../common';

export const firstFetchAndUpdateHttp = https.onCall(async (_: any, context: https.CallableContext) => {
  try {
    if (context.auth == null || context.auth.uid == null || context.auth.uid.trim() === '') {
      throw new https.HttpsError('unauthenticated', 'This method requires the user to be authenticated');
    }

    const snapshot = await admin
      .firestore()
      .collection('/users')
      .doc(context.auth.uid)
      .get();
    if (!snapshot.exists) {
      throw new https.HttpsError('not-found', 'The user does not exist', context.auth.uid);
    }

    console.log('Starting to work with user', snapshot.id);
    const user = snapshot.data() as User;
    if (!user.enabled) {
      console.log('user is disabled');
      return 0;
    }

    const uid = snapshot.id;
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

    return data.body.devices.length;
  } catch (err) {
    if (err instanceof https.HttpsError) {
      throw err;
    }

    console.error('An error occurred', err);
    throw new https.HttpsError('internal', err.toString(), err);
  }
});
