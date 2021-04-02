export const environment = {
  apiServer: 'localhost:8081',
  dataCaching: { // milliseconds data is allowed to remain cached before next request for that data re-retrieves it from the remote data source
    defaultLong: 86400000, // Default for data that rarely or never changes such as a list of states (one day)
    defaultShort: 60000, // Default for data that changes frequently, but still worth caching (one minute)
    userData: 600000 // 10 minutes
},
production: true
};
