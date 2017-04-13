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
                },
                LocationInfo: function (LocationRes) {
                    // body...
                    return LocationRes.query().$promise;
                },
                SalaryInfo: function (SalaryRangeRes) {
                    // body...
                    return SalaryRangeRes.query().$promise;
                },
                ExperienceInfo: function (ExperienceLevelRes) {
                    // body...
                    return ExperienceLevelRes.query().$promise;
                },
                CompanyTypeInfo: function (CompanyTypeRes) {
                    // body...
                    return CompanyTypeRes.query().$promise;
                },
                WaitIntervalInfo: function (WaitIntervalRes) {
                    // body...
                    return WaitIntervalRes.query().$promise;
                },
                OnJobSuccessInfo: function (OnJobSuccessRes) {
                    // body...
                    return OnJobSuccessRes.query().$promise;
                },
                JobTypeInfo: function (JobTypeRes) {
                    // body...
                    return JobTypeRes.query().$promise;
                },
                JobDurationInfo: function (JobDurationRes) {
                    // body...
                    return JobDurationRes.query().$promise;
                },
                ExperienceLevelInfo: function (ExperienceLevelRes) {
                    // body...
                    return ExperienceLevelRes.query().$promise;
                },
                BlueprintTasksInfo: function (BlueprintTasksRes) {
                    // body...
                    return BlueprintTasksRes.query().$promise;
                },
                VisaStatusInfo: function (VisaStatusRes) {
                    // body...
                    return VisaStatusRes.query().$promise;
                },
                UserInfo: function (UserInfoRes) {
                    // body...
                    return UserInfoRes.query().$promise;
                },
                UserListInfo: function (UserListRes) {
                    // body...
                    return UserListRes.query().$promise;
                },
                DesiredEmployeesInfo: function (DesiredEmployeeRes) {
                    // body...
                    return DesiredEmployeeRes.query().$promise;
                },
                QueueInfo: function (QueueRes) {
                    // body...
                    return QueueRes.query().$promise;
                },
                QueueStackInfo: function (QueueStackRes) {
                    // body...
                    return QueueStackRes.query().$promise;
                },
                AppliedBlueprintsInfo: function (AppliedBlueprintsRes) {
                    // body...
                    return AppliedBlueprintsRes.query().$promise;
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
                },
                VisaStatusInfo: function (VisaStatusRes) {
                    // body...
                    return VisaStatusRes.query().$promise;
                },
                QueueInfo: function (QueueRes) {
                    // body...
                    return QueueRes.query().$promise;
                },
                UserInfo: function (UserInfoRes) {
                    // body...
                    return UserInfoRes.query().$promise;
                },
                QueueStackInfo: function (QueueStackRes) {
                    // body...
                    return QueueStackRes.query().$promise;
                },
                AppliedBlueprintsInfo: function (AppliedBlueprintsRes) {
                    // body...
                    return AppliedBlueprintsRes.query().$promise;
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
                },
                Pilots: function (PilotsRes) {
                    return PilotsRes.query().$promise;
                }
            }
        }).state('root.profile', {
            url: '/profile/',
            controller: 'ProfileCtrl',
            templateUrl: '/static/templates/auth/profile.html',
            resolve: {
                metaTags: function (metaTagsRes) {
                    // body...
                    return metaTagsRes.get({
                        page_name: 'profile'
                    }).$promise;
                },
                UserInfo: function (UserInfoRes) {
                    // body...
                    return UserInfoRes.query().$promise;
                }
            }
        }).state('root.activate', {
            url: '/activate/?params',
            controller: 'ActivationCtrl',
            templateUrl: '/static/templates/auth/activation.html',
            resolve: {
                params: function ($stateParams) {
                    return $stateParams.params;
                },
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'activation'
                    }).$promise;
                }
            }
        }).state('root.non_pilot', {
            url: '/not-approved/',
            controller: 'NonPilotCtrl',
            templateUrl: '/static/templates/auth/non_pilot.html',
            resolve: {
                metaTags: function (metaTagsRes) {
                    return metaTagsRes.get({
                        page_name: 'non_pilot'
                    }).$promise;
                }
            }
        });
    }
})();











