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

        // get active projects
        projectFactory.active = function () {
            return $http.get('/api/v1/activeProjects/');            
        };

        // get active projects
        projectFactory.closed = function () {
            return $http.get('/api/v1/closedProjects/');
        };

        // get deleted projects
        projectFactory.deleted = function () {
            return $http.get('/api/v1/deletedProjects/');
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

        // unDelete a project
        projectFactory.unDelete = function (id, logData) {
            logData.status = 'active';
            return $http.put('/api/v1/project/' + id, logData);
        };

        // close a project
        projectFactory.closeProject = function (id, logData) {
            logData.status = 'closed';
            logData.closingDate = Date.now();
            return $http.put('/api/v1/project/' + id, logData);
        };

        // reOpen a project
        projectFactory.reOpenProject = function (id, logData) {
            logData.status = 'active';
            logData.closingDate = null;
            return $http.put('/api/v1/project/' + id, logData);
        };


        
        // return our entire userFactory object
        return projectFactory;

    });