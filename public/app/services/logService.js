angular.module('logService', [])

    .factory('Log', function ($http) {

        // create a new object
        var logFactory = {};

        // get a single drillLog
        logFactory.get = function (id) {
            return $http.get('/api/v1/drillLog/' + id);
        };

        // get all drillLogs
        logFactory.all = function () {
            return $http.get('/api/v1/drillLog/');
        };

        // create a drillLog
        logFactory.create = function (logData) {
            return $http.post('/api/v1/drillLog/', logData);
        };

        // update a drillLog
        logFactory.update = function (id, logData) {
            return $http.put('/api/v1/drillLog/' + id, logData);
        };

        // delete a drillLog
        logFactory.delete = function (id) {
            return $http.delete('/api/v1/drillLog/' + id);
        };

        // return our entire userFactory object
        return logFactory;

    });