import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {GeoFirestoreTypes} from '../src/definitions';
import {encodeDocumentAdd} from '../src/api/encode';

/*************/
/*  GLOBALS  */
/*************/
// Create global constiables to hold the Firebasestore and GeoFirestore constiables
export let firestore: firebase.firestore.Firestore;
export let collection: firebase.firestore.CollectionReference;
const testCollectionName = 'geofirestore-core-tests';

export const invalidDocumentData: () => any[] = () => [
  null,
  undefined,
  NaN,
  true,
  false,
  [],
  0,
  5,
  '',
  'a',
  ['hi', 1],
];
// Define dummy data for database
export const validDocumentData: () => GeoFirestoreTypes.DocumentData[] = () => [
  {coordinates: new firebase.firestore.GeoPoint(2, 3), count: 0},
  {coordinates: new firebase.firestore.GeoPoint(50, -7), count: 1},
  {coordinates: new firebase.firestore.GeoPoint(16, -150), count: 2},
  {coordinates: new firebase.firestore.GeoPoint(5, 5), count: 3},
  {coordinates: new firebase.firestore.GeoPoint(67, 55), count: 4},
  {coordinates: new firebase.firestore.GeoPoint(8, 8), count: 5},
];
export const validGeoDocumentData: () => GeoFirestoreTypes.GeoDocumentData[] = () =>
  validDocumentData().map(e => encodeDocumentAdd(e));

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88',
  databaseURL: 'https://geofirestore.firebaseio.com',
  projectId: 'geofirestore',
});

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Helper functions which runs before each Jasmine test has started */
export function beforeEachHelper(done: any): void {
  firestore = firebase.firestore();
  collection = firestore.collection(testCollectionName);
  done();
}

/* Helper functions which runs after each Jasmine test has completed */
export function afterEachHelper(done: any): void {
  deleteCollection()
    .then(() => wait(50))
    .then(done);
}

/* Used to purge Firestore collection. Used by afterEachHelperFirestore. */
function deleteCollection(): Promise<any> {
  /* Actually purges Firestore collection recursively through batch function. */
  function deleteQueryBatch(
    query: firebase.firestore.Query,
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    query
      .get()
      .then(snapshot => {
        if (snapshot.size === 0) return 0;
        // Delete documents in a batch
        const batch = firestore.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit().then(() => snapshot.size);
      })
      .then(numDeleted => {
        if (numDeleted === 0) {
          resolve();
        } else {
          process.nextTick(() => deleteQueryBatch(query, resolve, reject));
        }
      })
      .catch(err => reject(err));
  }

  return new Promise((resolve, reject) =>
    deleteQueryBatch(collection.limit(500), resolve, reject)
  );
}

/* Returns a promise which is fulfilled after the inputted number of milliseconds pass */
export function wait(milliseconds = 100): Promise<void> {
  return new Promise(resolve => {
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      resolve();
    }, milliseconds);
  });
}
