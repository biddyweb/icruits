(function () {
    "use strict";
    angular.module('app').config(Routes);

    Routes.$inject = ['$resourceProvider', '$routeProvider', '$locationProvider', '$stateProvider'];

    function Routes($resourceProvider, $routeProvider, $locationProvider, $stateProvider) {
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
                BluePrints: function (JobFeedsRes) {
                    // body...
                    return JobFeedsRes.query().$promise;
                },
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'dashboard'
                    }).$promise;
                },
                IndustryInfo: function (IndustryRes) {
                    // body...
                    return IndustryRes.query().$promise;
                }
            }
        })
        .state('root.blueprint', {
            url: '/blueprint/:name_slug/',
            controller: 'BluprintDetailsCtrl',
            templateUrl: '/static/templates/job/job_detail.html',
            resolve: {
                JobFeed: function (JobFeedsRes, $stateParams) {
                    return JobFeedsRes.get({
                        name_slug: $stateParams.name_slug
                    }).$promise;
                },
                SalaryInfo: function (SalaryRangeRes) {
                    // body...
                    return SalaryRangeRes.query().$promise;
                },
                JobType: function (JobTypeRes) {
                    // body...
                    return JobTypeRes.query().$promise;
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











