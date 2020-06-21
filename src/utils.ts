import {Geokit} from 'geokit';
import {GeoFirestoreTypes} from './types';
import {CUSTOM_KEY} from './constants';

/**
 * Encodes a Firestore Document to be added as a GeoDocument.
 *
 * @param documentData The document being set.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentAdd(
  documentData: GeoFirestoreTypes.DocumentData,
  customKey?: string
): GeoFirestoreTypes.GeoDocumentData {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const geopoint = findGeoPoint(documentData, customKey);
  return encodeGeoDocument(geopoint, documentData);
}

/**
 * Encodes a Firestore Document to be set as a GeoDocument.
 *
 * @param documentData A map of the fields and values for the document.
 * @param options An object to configure the set behavior. Includes custom key for location in document.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentSet(
  documentData: GeoFirestoreTypes.DocumentData,
  options?: GeoFirestoreTypes.SetOptions
): GeoFirestoreTypes.GeoDocumentData | GeoFirestoreTypes.DocumentData {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const customKey = (options && options.customKey) || CUSTOM_KEY;
  const geopoint = findGeoPoint(
    documentData,
    customKey,
    options && (options.merge || !!options.mergeFields)
  );
  if (geopoint) {
    return encodeGeoDocument(geopoint, documentData);
  }
  return documentData;
}

/**
 * Encodes a Firestore Document to be updated as a GeoDocument.
 *
 * @param documentData The document being updated.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @return The document encoded as GeoDocument object.
 */
export function encodeDocumentUpdate(
  documentData: GeoFirestoreTypes.UpdateData,
  customKey?: string
): GeoFirestoreTypes.UpdateData {
  if (Object.prototype.toString.call(documentData) !== '[object Object]') {
    throw new Error('document must be an object');
  }
  const geopoint = findGeoPoint(documentData, customKey, true);
  if (geopoint) {
    documentData = encodeGeoDocument(geopoint, documentData);
  }
  return documentData;
}

/**
 * Encodes a document with a GeoPoint as a GeoDocument.
 *
 * @param geopoint The location as a Firestore GeoPoint.
 * @param documentData Document to encode.
 * @return The document encoded as GeoDocument object.
 */
export function encodeGeoDocument(
  geopoint: GeoFirestoreTypes.cloud.GeoPoint | GeoFirestoreTypes.web.GeoPoint,
  documentData: GeoFirestoreTypes.DocumentData
): GeoFirestoreTypes.GeoDocumentData {
  validateLocation(geopoint);
  const geohash = Geokit.hash({
    lat: geopoint.latitude,
    lng: geopoint.longitude,
  });
  (documentData as GeoFirestoreTypes.GeoDocumentData).g = {
    geopoint,
    geohash,
  };
  return documentData as GeoFirestoreTypes.GeoDocumentData;
}

/**
 * Finds GeoPoint in a document.
 *
 * @param document A Firestore document.
 * @param customKey The key of the document to use as the location. Otherwise we default to `coordinates`.
 * @param flag Tells function supress errors.
 * @return The GeoPoint for the location field of a document.
 */
export function findGeoPoint(
  document: GeoFirestoreTypes.DocumentData,
  customKey = CUSTOM_KEY,
  flag = false
): GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint {
  let error: string;
  let geopoint;

  if (customKey in document) {
    geopoint = document[customKey];
  } else {
    const props = customKey.split('.');
    geopoint = document;
    for (const prop of props) {
      if (!(prop in geopoint)) {
        geopoint = document['coordinates'];
        break;
      }
      geopoint = geopoint[prop];
    }
  }

  if (!geopoint) {
    error = 'could not find GeoPoint';
  }

  if (geopoint && !validateLocation(geopoint, true)) {
    error = 'invalid GeoPoint';
  }

  if (error && !flag) {
    throw new Error('Invalid GeoFirestore document: ' + error);
  }

  return geopoint;
}

/**
 * Validates a GeoPoint object and returns a boolean if valid, or throws an error if invalid.
 *
 * @param location The Firestore GeoPoint to be verified.
 * @param flag Tells function to send up boolean if not valid instead of throwing an error.
 */
export function validateLocation(
  location: GeoFirestoreTypes.web.GeoPoint | GeoFirestoreTypes.cloud.GeoPoint,
  flag = false
): boolean {
  let error: string;

  if (!location) {
    error = 'GeoPoint must exist';
  } else if (typeof location.latitude === 'undefined') {
    error = 'latitude must exist on GeoPoint';
  } else if (typeof location.longitude === 'undefined') {
    error = 'longitude must exist on GeoPoint';
  } else {
    const latitude = location.latitude;
    const longitude = location.longitude;

    if (typeof latitude !== 'number' || isNaN(latitude)) {
      error = 'latitude must be a number';
    } else if (latitude < -90 || latitude > 90) {
      error = 'latitude must be within the range [-90, 90]';
    } else if (typeof longitude !== 'number' || isNaN(longitude)) {
      error = 'longitude must be a number';
    } else if (longitude < -180 || longitude > 180) {
      error = 'longitude must be within the range [-180, 180]';
    }
  }

  if (typeof error !== 'undefined' && !flag) {
    throw new Error('Invalid location: ' + error);
  } else {
    return !error;
  }
}
