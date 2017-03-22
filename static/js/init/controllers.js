(function () {
    angular.module('app').controller('JobCtrl', JobCtrl);

    JobCtrl.$inject = ['$scope', '$rootScope', '$cookies', '$state', 'JobFeed'];

    function JobCtrl ($scope, $rootScope, $cookies, $state, JobFeed) {
        "use strict";

        if ($cookies.get('token')) {
            var user_logged;
        } else {
            setTimeout(function() {
                $state.go('root.home', { reload: true });
            }, 100);
        }
        
        $scope.activatedTab = 1;
        $scope.setActivatedTab = function (setTab) {
            $scope.activatedTab = setTab;
        };

        $scope.JobFeed = JobFeed;
        $scope.$emit('metaTagsChanged', {
            title: JobFeed.title,
            description: JobFeed.description
        });
        $rootScope.image = '';
    }
})();

(function () {
    "use strict";

    angular.module('app').controller('JobFeedListCtrl', JobFeedListCtrl);

    JobFeedListCtrl.$inject = ['$scope', '$rootScope', '$sce', 'JobFeedsRes'];

    function JobFeedListCtrl ($scope, $rootScope, $sce, JobFeedsRes) {
        var data = JobFeedsRes.query();
        $scope.JobFeeds = data;

        $scope.selectedDuration = [];

        $scope.setSelectedDuration = function () {
            var dur = this.duration;
            if (_.contains($scope.selectedDuration, dur)) {
                $scope.selectedDuration = _.without($scope.selectedDuration, dur);
            } else {
                $scope.selectedDuration.push(dur)
            }
            return false;
        };

        $scope.isDurChecked = function (dur) {
            if (_.contains($scope.selectedDuration, dur)) {
                return 'icon-ok pull-right';
            }
            return false;
        };

        $scope.checkAllDur = function () {
            $scope.selectedDuration = _.pluck($scope.JobFeeds.duration);
        };

        $rootScope.image = '';
    }
})();

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

    DashboardCtrl.$inject = ['$scope', '$rootScope', '$state', '$cookies', 'metaTags'];

    function DashboardCtrl ($scope, $rootScope, $state, $cookies, metaTags) {
        "use strict";

        if ($cookies.get('token')) {
            var user_logged;
            console.log('found');
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

    angular.module('app').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'LoginRes', 'JWTTokenRes', 'AuthRes'];

    function LoginCtrl($scope, $rootScope, $state, $timeout, LoginRes, JWTTokenRes, AuthRes) {

        $scope.reg = {};

        $scope.profile_types = [{profile_type: 'JobSeeker', label: 'JobSeeker'}, {profile_type: 'Employer', label: 'Employer'}];

        $scope.registration = function () {
            AuthRes.save($scope.reg, function (resource) {
                $scope.sent_activation = true;
                return $timeout(function () {
                    $state.go('root.home', { reload: true });
                }, 500);
            }, function (response) {
                $scope.errors = response.data;
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
