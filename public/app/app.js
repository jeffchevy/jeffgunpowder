angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'projectCtrl', 'projectService', 'ui.bootstrap'/*, 'ui.grid'*/])

// application configuration to integrate token into requests
    .config(function ($httpProvider) {

        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');

    });