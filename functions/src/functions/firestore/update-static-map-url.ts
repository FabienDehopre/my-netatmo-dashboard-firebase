import { config, firestore, Change } from 'firebase-functions';
import * as crypto from 'crypto';
import * as url from 'url';

import { Station } from '../../models/station';

export const updateStaticMapUrl = firestore.document('users/{uid}/stations/{sid}').onWrite((change: Change<firestore.DocumentSnapshot>) => {
  if (change.after.exists) {
    console.log(`create or update station detected... updating the static map url`);
    const station = change.after.data() as Station;
    const secret = config().google.maps.secret;
    const key = config().google.maps.key;
    const location = `${station.location.location.latitude},${station.location.location.longitude}`;
    const staticUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x200&scale=2&maptype=roadmap&markers=${location}&zoom=15&key=${key}`;
    station.location.staticMap = sign(staticUrl, secret);
    console.log('saving the new static map url');
    return change.after.ref.set(station, { merge: true });
  }

  console.log('delete station detected... nothing to do');
  return null;
});

function removeWebSafe(safeEncodedString: string): string {
  return safeEncodedString.replace(/-/g, '+').replace(/_/g, '/');
}

function makeWebSafe(encodedString: string): string {
  return encodedString.replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeBase64Hash(code: string): Buffer {
  return Buffer.from ? Buffer.from(code, 'base64') : new Buffer(code, 'base64');
}

function encodeBase64Hash(key: Buffer, data: string): string {
  return crypto
    .createHmac('sha1', key)
    .update(data)
    .digest('base64');
}

function sign(path: string, secret: string): string {
  const uri = url.parse(path);
  const safeSecret = decodeBase64Hash(removeWebSafe(secret));
  const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, uri.path));
  return url.format(uri) + `&signature=${hashedSignature}`;
}
