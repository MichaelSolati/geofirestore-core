### 4.1.0 (2020-07-02)

##### Bug Fixes

* **encodeGeoDocument:**  clone object instead of mutating original, fixes [#1](https://github.com/MichaelSolati/geofirestore-core/pull/1) ([b6f64e7d](https://github.com/MichaelSolati/geofirestore-core/commit/b6f64e7df172a92a1d9e85f391fa5d3e55348a2f))

##### Refactors

*  move all exported functions to `/api` ([246cc642](https://github.com/MichaelSolati/geofirestore-core/commit/246cc64223965dc48c06a77275130ff1cc1080e1))

##### Tests

*  add tests for `api/validate.ts` ([8a9f6dbc](https://github.com/MichaelSolati/geofirestore-core/commit/8a9f6dbc990b5ae2b284282a827e64cab5653436))
*  add tests for `api/encode.ts` ([11e5667d](https://github.com/MichaelSolati/geofirestore-core/commit/11e5667d4d4e14a37a6157191b39ef7b0c8448e8))

## 4.0.0 (2020-06-22)

##### Build System / Dependencies

*  add deploy action ([9926225a](https://github.com/MichaelSolati/geofirestore-core/commit/9926225a7d192465c30f02ac370b6cec6b6b82f8))

##### Chores

*  update `geokit` ([ea198451](https://github.com/MichaelSolati/geofirestore-core/commit/ea198451bad2d2050f32152560722864605cf068))
*  add badges ([e9b3b7a7](https://github.com/MichaelSolati/geofirestore-core/commit/e9b3b7a73f1a162343372712a1d296a5533a6924))
*  initial commit ([fc04ad6c](https://github.com/MichaelSolati/geofirestore-core/commit/fc04ad6c4b33a94f1cb9215128a3bc17b6b4e1bb))

##### Documentation Changes

* **README:**  add description ([2c6a643e](https://github.com/MichaelSolati/geofirestore-core/commit/2c6a643e4de2482713e1eaf08a2f07087ee692ab))

##### New Features

*  add functions for `onSnapshot` and `get` for geoqueries ([e95be225](https://github.com/MichaelSolati/geofirestore-core/commit/e95be225de9c0f79b5988dfb83162a603cae0261))
* **encode:**  add functions to encode a document ([7c314692](https://github.com/MichaelSolati/geofirestore-core/commit/7c314692d543824976588d2785108bc9c83c9412))

##### Refactors

*  export specific functions from `/utils` ([3af42212](https://github.com/MichaelSolati/geofirestore-core/commit/3af42212000c996fb29eff80fe2c7d3215c631fa))
