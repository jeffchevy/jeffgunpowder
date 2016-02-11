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
            .when('/logs/view', {
                templateUrl: 'app/views/pages/drillLog/view.html',
                controller: 'logController',
                controllerAs: 'log'
            })
            .when('/logs/create', {
                templateUrl: 'app/views/pages/drillLog/create.html',
                controller: 'logController',
                controllerAs: 'log'
            })
            .when('/logs/edit/:id', {
                templateUrl: 'app/views/pages/drillLog/edit.html',
                controller: 'logController',
                controllerAs: 'log'
            });

        $locationProvider.html5Mode(true);

    });
