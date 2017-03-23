(function () {
    "use strict";
    angular.module('app').config(Routes);

    Routes.$inject = ['$resourceProvider', '$routeProvider', '$locationProvider', '$stateProvider'];

    function Routes($resourceProvider, $routeProvider, $locationProvider, $stateProvider) {
        'use strict';
        $routeProvider.otherwise('/');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $resourceProvider.defaults.stripTrailingSlashed = false;
        $stateProvider.state('root', {
            abstract: true,
            template: '<ui-view/>'
        }).state('root.home', {
            url: '/',
            controller: 'HomeCtrl',
            resolve: {
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'home'
                    }).$promise;
                }
            }
        })
        .state('root.dashboard', {
            url: '/dashboard/',
            controller: 'DashboardCtrl',
            templateUrl: '/static/templates/job/job_list.html',
            resolve: {
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'dashboard'
                    }).$promise;
                }
            }
        })
        .state('root.job', {
            url: '/job/:job_name_slug/',
            controller: 'JobCtrl',
            templateUrl: '/static/templates/job/job_detail.html',
            resolve: {
                JobFeed: function (JobFeedsRes, $stateParams) {
                    return JobFeedsRes.get({
                        job_name_slug: $stateParams.job_name_slug
                    }).$promise;
                }
            }
        }).state('root.help', {
            url: '/help/',
            controller: 'HelpCtrl',
            templateUrl: '/static/templates/help/help.html',
            resolve: {
                Help: function (HelpRes) {
                    return HelpRes.query().$promise;
                },
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'help'
                    }).$promise;
                }
            }
        }).state('root.register', {
            url: '/register/',
            controller: 'RegisterCtrl',
            templateUrl: '/static/templates/auth/register.html',
            resolve: {
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'register'
                    }).$promise;
                }
            }
        });
    }
})();











