(function () {
    "use strict";
    var app = angular.module('app', ['ngCookies', 'ui.router', 'ngResource', 
        'ngRoute', 'ngAnimate', 'ngFileUpload']);

    app.run(run);

    run.$inject = ['$http', '$rootScope', '$timeout', '$anchorScroll', '$state', 'JWTTokenRes', '$cookies'];

    function run($http, $rootScope, $timeout, $anchorScroll, $state, JWTTokenRes, $cookies) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        if (JWTTokenRes.isAuthorized() === $cookies.get('token')) {
            $http.defaults.headers.common.Authorization = 'JWT ' + $cookies.get('token');
            if(!$rootScope.$on("$locationChangeSuccess")) {
                setTimeout(function () {
                    $state.go('root.dashboard', {reload: true});
                }, 600);
            }
        } else {
            $http.defaults.headers.common.Authorization = '';
            //setTimeout(function() {
            //    $state.go('root.home', { reload: true });
            //}, 600);
        }
        $rootScope.$on("$locationChangeSuccess", function(){
            $timeout(function() {
                $anchorScroll();
            });
        });
        $rootScope.title = 'iCruits';
        $rootScope.description = "Find your job";
    }
})();
