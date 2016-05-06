angular.module('app.routes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/ping', {
                templateUrl: 'app/views/pages/home.html'
            })

            // login page
            .when('/login', {
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })

            // show all users
            .when('/users', {
                templateUrl: 'app/views/pages/users/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            // form to create a new user
            // same view as edit page
            .when('/users/create', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userCreateController',
                controllerAs: 'user'
            })

            // page to edit a user
            .when('/users/:user_id', {
                templateUrl: 'app/views/pages/users/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            })
            .when('/project', {
                templateUrl: 'app/views/pages/project/allActive.html',
                controller: 'projectController',
                controllerAs: 'project'
            })
            .when('/closedProject', {
                templateUrl: 'app/views/pages/project/allClosed.html',
                controller: 'projectController',
                controllerAs: 'project'
            })
            .when('/deletedProject', {
                templateUrl: 'app/views/pages/project/allDeleted.html',
                controller: 'projectController',
                controllerAs: 'project'
            })
        
            .when('/project/create', {
                templateUrl: 'app/views/pages/project/single.html',
                controller: 'projectCreateController',
                controllerAs: 'project'
            })
            .when('/project/:project_id', {
                templateUrl: 'app/views/pages/project/single.html',
                controller: 'projectEditController',
                controllerAs: 'project'
            })
            .when('/project/view/:project_id', {
                templateUrl: 'app/views/pages/project/viewSingle.html',
                controller: 'projectEditController',
                controllerAs: 'project'
            })
            .when('/reports', {
                templateUrl: 'app/views/pages/reports/reportsIndex.html'
                //controller: 'reportsController',
                //controllerAs: 'report'
            });

        $locationProvider.html5Mode(true);

    });
