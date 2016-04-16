angular.module('projectService', [])

    .factory('Project', function ($http) {

        // create a new object
        var projectFactory = {};

        // get a single project
        projectFactory.get = function (id) {
            return $http.get('/api/v1/project/' + id);
        };

        // get all projects
        projectFactory.all = function () {
            return $http.get('/api/v1/project/');
        };

        // create a project
        projectFactory.create = function (logData) {
            return $http.post('/api/v1/project/', logData);
        };

        // update a project
        projectFactory.update = function (id, logData) {
            return $http.put('/api/v1/project/' + id, logData);
        };

        // delete a project
        projectFactory.delete = function (id) {
            return $http.delete('/api/v1/project/' + id);
        };

        // return our entire userFactory object
        return projectFactory;

    });