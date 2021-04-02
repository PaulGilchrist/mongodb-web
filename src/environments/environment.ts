// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiServer: 'localhost:8081',
  dataCaching: { // milliseconds data is allowed to remain cached before next request for that data re-retrieves it from the remote data source
    defaultLong: 86400000, // Default for data that rarely or never changes such as a list of states (one day)
    defaultShort: 60000, // Default for data that changes frequently, but still worth caching (one minute)
    userData: 600000 // 10 minutes
},
production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
