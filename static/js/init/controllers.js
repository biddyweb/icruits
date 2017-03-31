(function () {
    "use strict";

    angular.module('app').controller('BluprintDetailsCtrl', BluprintDetailsCtrl);

    BluprintDetailsCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$state', 'JobFeed', 'UserInfoRes', 'SalaryInfo', 'JobType', 'VisaStatusInfo'];

    function BluprintDetailsCtrl ($scope, $rootScope, $cookies, $state, JobFeed, UserInfoRes, SalaryInfo, JobType, VisaStatusInfo) {

        $scope.blueprint = JobFeed;

        $scope.salary = SalaryInfo;

        $scope.type = JobType;

        $scope.visa_status = VisaStatusInfo;

        $scope.sent_mail = false;

        angular.forEach($scope.type, function (value, key) {
            // body...
            if(value.id == $scope.blueprint.related_job_type){
                $scope.job_type = value;
            }
        });

        angular.forEach($scope.salary, function(value, key){
            if(value.id == $scope.blueprint.related_salary){
                $scope.job_salary = value;
                // body...
            }
        });

        angular.forEach($scope.visa_status, function (value, key) {
            // body...
            if(value.id == $scope.blueprint.related_visa_status){
                $scope.visa_status_info = value;
            }
        });

        $scope.user = UserInfoRes.query();

        if ($cookies.get('token')) {
            var user_logged;
        } else {
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 100);
        }

        $scope.SendMail = function () {
            // body...
            $scope.sent_mail = true;
        }
        
        $scope.$emit('metaTagsChanged', {
            title: $scope.blueprint.name,
            description: $scope.blueprint.description
        });
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('SeoCtrl', SeoCtrl);

    SeoCtrl.$inject = ['$scope', '$rootScope', '$location'];

    function SeoCtrl ($scope, $rootScope, $location) {
        $scope.$on('metaTagsChanged', function (event, metaTags) {
            $rootScope.title = metaTags.title;
            $rootScope.description = metaTags.description;
            $rootScope.location = $location.path();
        });
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HomeAbstractCtrl', HomeAbstractCtrl);

    HomeAbstractCtrl.$inject = ['$scope', '$location', '$window'];

    function HomeAbstractCtrl ($scope, $location, $window) {
        $scope.home = $location.path() == '/';
        $scope.$on('$stateChangeSuccess', function () {
                $scope.home = $location.path() == '/';
        });
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$state', '$cookies', 'metaTags', 'BluePrints', 'UserInfo',
    'IndustryInfo', 'LocationInfo', 'SalaryInfo', 'ExperienceInfo', 'CompanyTypeInfo', 'WaitIntervalInfo', 'OnJobSuccessInfo',
    'JobTypeInfo', 'JobDurationInfo', 'ExperienceLevelInfo', 'BlueprintTasksInfo', 'VisaStatusInfo', 'UserListInfo', 'Upload', 'CreateBlueprintRes'];

    function DashboardCtrl ($scope, $rootScope, $state, $cookies, metaTags, BluePrints, UserInfo,
    IndustryInfo, LocationInfo, SalaryInfo, ExperienceInfo, CompanyTypeInfo, WaitIntervalInfo, OnJobSuccessInfo,
    JobTypeInfo, JobDurationInfo, ExperienceLevelInfo, BlueprintTasksInfo, VisaStatusInfo, UserListInfo, Upload, CreateBlueprintRes) {
        
        $scope.blueprints = BluePrints;

        $scope.make_blueprint = {};

        $scope.user = UserInfo;

        $scope.industry_info = IndustryInfo;

        $scope.location_info = LocationInfo;

        $scope.salary_info = SalaryInfo;

        $scope.experience_info = ExperienceInfo;

        $scope.company_type_info = CompanyTypeInfo;

        $scope.wait_interval_info = WaitIntervalInfo;

        $scope.on_job_success_info = OnJobSuccessInfo;

        $scope.job_type_info = JobTypeInfo;

        $scope.job_duration_info = JobDurationInfo;

        $scope.experience_level_info = ExperienceLevelInfo;

        $scope.blueprint_tasks_info = BlueprintTasksInfo;

        $scope.blueprint_tasks = [];

        angular.forEach($scope.blueprint_tasks_info, function (value, key) {
            // body...
            if(value.expert === ""){
                $scope.blueprint_tasks.push(value);
            };
        });

        $scope.visa_status_info = VisaStatusInfo;

        $scope.user_list_info = UserListInfo;

        $scope.make_blueprint_tasks = [];

        $scope.make_blueprint = {related_user: $scope.user.id};

        $scope.user_list = [];

        angular.forEach($scope.user_list_info, function (value, key) {
            // body...
            if(value.profile_type){
                $scope.user_list.push(value);
            }
        });

        /* FILTER PART */

        $scope.industryIncludes = [];

        $scope.locationIncludes = [];

        $scope.salaryIncludes = [];

        $scope.experienceIncludes = [];

        $scope.FilterIndustry = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.industryIncludes);
            if(i > -1 ){
                $scope.industryIncludes.splice(i, 1);
            } else {
                $scope.industryIncludes.push(filter);
            }
        }

        $scope.industryFilter = function (blueprints) {
            // body...
            if($scope.industryIncludes.length > 0){
                if ($.inArray(blueprints.related_industry, $scope.industryIncludes) < 0)
                    return;
            }
            return blueprints;
        }

        $scope.FilterLocation = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.locationIncludes);
            if(i > -1 ){
                $scope.locationIncludes.splice(i, 1);
            } else {
                $scope.locationIncludes.push(filter);
            }
        }

        $scope.locationFilter = function (blueprints) {
            // body...
            if($scope.locationIncludes.length > 0){
                if ($.inArray(blueprints.related_location, $scope.locationIncludes) < 0)
                    return;
            }
            return blueprints;
            console.log(blueprints);
        }

        $scope.FilterSalary = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.salaryIncludes);
            if(i > -1 ){
                $scope.salaryIncludes.splice(i, 1);
            } else {
                $scope.salaryIncludes.push(filter);
            }
        }

        $scope.salaryFilter = function (blueprints) {
            // body...
            if($scope.salaryIncludes.length > 0){
                if ($.inArray(blueprints.related_salary, $scope.salaryIncludes) < 0)
                    return;
            }
            return blueprints;
            console.log(blueprints);
        }

        $scope.FilterExperience = function (filter) {
            // body...
            var i = $.inArray(filter, $scope.experienceIncludes);
            if(i > -1 ){
                $scope.experienceIncludes.splice(i, 1);
            } else {
                $scope.experienceIncludes.push(filter);
            }
        }

        $scope.experienceFilter = function (blueprints) {
            // body...
            if($scope.experienceIncludes.length > 0){
                if ($.inArray(blueprints.related_experience, $scope.experienceIncludes) < 0)
                    return;
            }
            return blueprints;
            console.log(blueprints);
        }

        /* END OF FILTER PART */

        if ($cookies.get('token')) {
            var user_logged;
        } else {
            console.log('not found');
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 600);
        }

        $scope.$emit('metaTagsChanged', metaTags);

        $rootScope.image = '';

        /* WORK ENVIORMENT UPLOAD PHOTO */

        $scope.upload = function (file) {
            // body...
            if(!file){
                return;
            }
            Upload.upload({
                url: '/api/work-enviorment/',
                file: file
            }).success(function (data, status, headers, config) {
                // body...
                $scope.make_blueprint.work_enviorment = data.image;
                $scope.preview = data.image;
                $scope.errors = null;
            }).errors(function (data, status, headers, config) {
                // body...
                $scope.errors = data.errors;
            });
        };

        /* END OF WORK ENVIORMENT PHOTO UPLOAD */

        /* ADDING BLUEPRINT TASK */
        $scope.addTask = function (task) {
            // body...
            $scope.make_blueprint_tasks.push(task);
        };

        /* REMOVING BLUEPRINT TASK */
        $scope.removeTask = function (task) {
            // body...
            angular.forEach($scope.make_blueprint_tasks, function (object, index) {
                // body...
                if(object.name === task) {
                    $scope.make_blueprint_tasks.splice(index, 1);
                }
            });
        };

        /* CREATING BLUEPRINT */
        $scope.createBlueprint = function () {
            // body...
            $scope.send_blueprint = []
            $scope.send_blueprint.push($scope.make_blueprint);
            $scope.send_blueprint.push({tasks: $scope.make_blueprint_tasks});
            CreateBlueprintRes.save($scope.send_blueprint, function (response) {
                // body...
            }, function (response) {
                // body...
            });
        };

    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HelpCtrl', HelpCtrl);

    HelpCtrl.$inject = ['$scope', '$rootScope', 'Help', 'metaTags'];

    function HelpCtrl($scope, $rootScope, Help, metaTags) {

        $scope.activatedTab = 1;
        $scope.setActivatedTab = function (setTab) {
            $scope.activatedTab = setTab;
        };

        $scope.help = Help;

        $scope.$emit('metaTagsChanged', metaTags);
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', 'metaTags'];

    function HomeCtrl($scope, $rootScope, metaTags) {

        $scope.$emit('metaTagsChanged', metaTags);
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$rootScope', '$state', '$window', 'AuthRes', 'metaTags'];

    function RegisterCtrl($scope, $rootScope, $state, $window, AuthRes, metaTags) {

        $scope.$emit('metaTagsChanged', metaTags);

        $scope.reg = {};

        $scope.profile_types = [{profile_type: true, label: 'JobSeeker'}, {profile_type: false, label: 'Employer'}];

        $scope.registration = function () {
            AuthRes.save($scope.reg, function (resource) {
                $state.go('root.home', { reload: true });
                setTimeout(function() {
                    $window.location.reload();
                }, 600);
            }, function (response) {
                $scope.errors = response.data;
            });
        };
        
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'LoginRes', 'JWTTokenRes', 'CheckUserRes'];

    function LoginCtrl($scope, $rootScope, $state, $timeout, LoginRes, JWTTokenRes, CheckUserRes) {


        $scope.checkuser = function (data) {
            // body...
            CheckUserRes.save(data, function (response) {
                // body...
                console.log(response);
            }, function (response) {
                // body...
                console.log(response);
                console.log(response.status);
                if(response.status === 400){
                    setTimeout(function() {
                        $state.go('root.register', { reload: true });
                    }, 600);
                } else {
                    setTimeout(function () {
                        // body...
                        $state.go('root.dashboard', { reload: true });
                    }, 600)
                }
            });
        };

        $scope.login = function() {
            LoginRes.login($scope.log.username, $scope.log.password).then(loginSuccessFn, loginErrorFn);

            function loginSuccessFn(response) {
                // body...
                JWTTokenRes.jwt($scope.log.username, $scope.log.password);
            }

            function loginErrorFn(response) {
                // body...
                $scope.errors = response.data;
                $scope.logged_in = false;
           }
        };

        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('LogoutCtrl', LogoutCtrl);

    LogoutCtrl.$inject = ['$scope', '$state', '$window', 'LogoutRes', 'UserInfoRes'];

    function LogoutCtrl($scope, $state, $window, LogoutRes, UserInfoRes) {
        $scope.user = UserInfoRes.query();

        $scope.user.user_company = false;

        if($scope.user.is_superuser){
            $scope.user.user_company = true;
            console.log('');
        } else {
            console.log('');
        };

        $scope.logoutNow = function () {
            // body...
            LogoutRes.logout().then(logoutSuccess, logoutFail);

            function logoutSuccess(response) {
                $state.go('root.home');
                setTimeout(function() {
                    $window.location.reload();
                }, 600);
            }

            function logoutFail(response) {
                return response
            }
        }
    }
})();

(function () {
    // body...
    angular.module('app').directive('customValidation', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {

                    var transformedInput = inputValue.toLowerCase().replace(/ /g, ''); 

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }         

                    return transformedInput;         
                });
            }
        };
    });    
})();

(function () {
    // body...
    "use strict";

    angular.module('app').controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$rootScope', '$scope', 'metaTags', 'UserInfo'];

    function ProfileCtrl($rootScope, $scope, metaTags, UserInfo) {
        // body...

        $scope.$on('metaTagsChanged', metaTags);

        $scope.user_info = UserInfo;

        $rootScope.image = '';
    }
})();