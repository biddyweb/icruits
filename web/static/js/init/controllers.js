(function () {
    "use strict";

    angular.module('app').controller('BluprintDetailsCtrl', BluprintDetailsCtrl);

    BluprintDetailsCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$state', 'JobFeed', 'UserInfoRes', 'SalaryRangeRes'];

    function BluprintDetailsCtrl ($scope, $rootScope, $cookies, $state, JobFeed, UserInfoRes, SalaryRangeRes) {

        $scope.blueprint = JobFeed;

        $scope.salary = SalaryRangeRes.query();

        $scope.test = []

        angular.forEach($scope.salary, function(value, key){
            console.log(value, ": ", key);
            $scope.test.push(value);
            // body...

        });

        $scope.user = UserInfoRes.query();

        if ($cookies.get('token')) {
            var user_logged;
        } else {
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 100);
        }
        
        $scope.JobFeed = JobFeed;
        $scope.$emit('metaTagsChanged', {
            title: JobFeed.title,
            description: JobFeed.description
        });
        $rootScope.image = '';
    }
})();
/*
(function () {
    'use strict';
    
    angular.module('app').filter('durationFilter', durationFilter);
    
    durationFilter.$inject = [];
    
    function durationFilter() {
        return function (clients, selectedDuration) {
            if (!angular.isUndefined(clients) && !angular.isUndefined(selectedDuration) && selectedDuration.length > 0) {
                var tempDuration = [];
                angular.forEach(selectedDuration, function (id) {
                    angular.forEach(clients, function (client) {
                        if (angular.equals(client.company.id, id)) {
                            tempDuration.push(client);
                        }
                    });
                });
                return tempDuration;
            } else {
                return clients;
            }
        };
    }
})();
*/
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

    HomeAbstractCtrl.$inject = ['$scope', '$location'];

    function HomeAbstractCtrl ($scope, $location) {
        $scope.home = $location.path() == '/';
        $scope.$on('$stateChangeSuccess', function () {
            $scope.home = $location.path() == '/';
        });
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('DashboardCtrl', DashboardCtrl);

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$state', '$cookies', 'metaTags', 'BluePrints', 'UserInfoRes',
    'IndustryRes'];

    function DashboardCtrl ($scope, $rootScope, $state, $cookies, metaTags, BluePrints, UserInfoRes,
    IndustryRes) {
        
        $scope.blueprints = BluePrints;

        $scope.user = UserInfoRes.query();

        $scope.industry = IndustryRes.query();

        if ($cookies.get('token')) {
            var user_logged;
        } else {
            console.log('not found');
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 100);
        }

        $scope.$emit('metaTagsChanged', metaTags);

        $rootScope.image = '';
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

    RegisterCtrl.$inject = ['$scope', '$rootScope', '$state', 'AuthRes', 'metaTags'];

    function RegisterCtrl($scope, $rootScope, $state, AuthRes, metaTags) {

        $scope.$emit('metaTagsChanged', metaTags);

        $scope.reg = {};

        $scope.profile_types = [{profile_type: true, label: 'JobSeeker'}, {profile_type: false, label: 'Employer'}];

        $scope.registration = function () {
            AuthRes.save($scope.reg, function (resource) {
                $scope.sent_activation = true;
                $state.go('root.home', { reload: true });
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
            }, function (response) {
                // body...
                setTimeout(function() {
                    $state.go('root.register', { reload: true });
                }, 100);
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

        console.log($scope.user.email);

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
                $window.location.reload();
            }

            function logoutFail(response) {
                return response
            }
        }
    }
})();
