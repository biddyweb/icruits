(function () {
    "use strict";
    angular.module('app').factory('metaTagsRes', metaTagsRes);

    metaTagsRes.$inject = ['$resource'];

    function metaTagsRes($resource) {
        return $resource('/api/seo/meta_tags/:page_name/ ');
    }
})();


(function () {
    'use strict';

    angular.module('app').factory('JobFeedsRes', JobFeedsRes);

    JobFeedsRes.$inject = ['$resource'];

    function JobFeedsRes($resource) {
        return $resource('/api/job/:name_slug/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('QueueRes', QueueRes);

    QueueRes.$inject = ['$resource'];

    function QueueRes($resource) {
        return $resource('/api/queue/ ');
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('HelpRes', HelpRes);

    HelpRes.$inject = ['$resource'];

    function HelpRes($resource) {
        return $resource('/api/help/ ');
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('CheckUserRes', CheckUserRes);

    CheckUserRes.$inject = ['$resource'];

    function CheckUserRes($resource) {
        return $resource('/api/auth/check-user/ ');
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('LoginRes', LoginRes);

    LoginRes.$inject = ['$cookies', '$http'];

    function LoginRes($cookies, $http) {

        var LoginRes = {
            login: login,
            isAuthenticated: isAuthenticated
        };

        function login(username, password) {
            return $http.post('/api/auth/login/', {
                username: username,
                password: password
            }).then(loginSuccess, loginFail);

            function loginSuccess(response) {
                var user = response.data.user;
                var expireTime = new Date();
                expireTime.setDate(expireTime.getTime() + 1);
                $cookies.put('authenticatedAccount', user, {'expires': expireTime});
            }

            function loginFail(response) {
                return response.data;
            }
        }

        function isAuthenticated() {
            if (!$cookies.get('authenticatedAccount')) {
                return !!$cookies;
            }
            return $cookies.get('authenticatedAccount');
        }

        return LoginRes;
    }
})();

(function () {
    // body...
    'use strict';

    angular.module('app').factory('UserInfoRes', UserInfoRes);

    UserInfoRes.$inject = ['$resource'];

    function UserInfoRes($resource) {
        // body...
        return $resource('/api/auth/whoami/ ' ,{}, {
            query: {
                isArray: false
            },
            'update': { method:'PUT' }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('AuthRes', AuthRes);

    AuthRes.$inject = ['$resource'];

    function AuthRes($resource) {
        return $resource('/api/auth/register/ ');
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('LogoutRes', LogoutRes);

    LogoutRes.$inject = ['$cookies', '$http', '$state'];

    function LogoutRes($cookies, $http, $state) {

        var LogoutRes = {
            logout: logout
        };

        return LogoutRes;

        function logout() {
            return $http.post('/api/auth/logout/').then(logoutSuccess, logoutFail);

            function logoutSuccess(response) {
                unauthenticated();
            }
            function logoutFail(response) {
                return response.data;
            }

            function unauthenticated() {
                delete $cookies.remove('authenticatedAccount');
                delete $cookies.remove('token');
                $cookies.remove('authenticatedAccount');
                $cookies.remove('token');
                $http.defaults.headers.common.Authorization = '';
                $state.go('root.home', { reload: true });
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('JWTTokenRes', JWTTokenRes);

    JWTTokenRes.$inject = ['$http', '$cookies', '$timeout', '$window', '$state'];

    function JWTTokenRes($http, $cookies, $timeout, $window, $state) {
        var JWTTokenRes = {
            jwt: jwt,
            isAuthorized: isAuthorized
        };

        function jwt(username, password) {
            return $http.post('/api/auth/get-jtw-token/', {
                username: username,
                password: password
            }).then(SuccessFn, FailFn);

            function SuccessFn(response) {
                var expireTime = new Date();
                expireTime.setDate(expireTime.getTime() + 1);
                var token = response.data.token;
                $cookies.put('token', token, {'expires': expireTime});
                $http.defaults.headers.common.Authorization = 'JWT ' + token;
                return $timeout(function () {
                    $state.go('root.dashboard', { reload: true });
                }, 500);
           }

            function FailFn(response) {
                //$window.location.reload();
            }
        }

        function isAuthorized() {
            // body...
            if (!$cookies.get('token')) {
                return !!$cookies;
            } else {
                return $cookies.get('token');
            };
        }
        return JWTTokenRes;
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('LocationRes', LocationRes);

    LocationRes.$inject = ['$resource'];

    function LocationRes($resource) {
        return $resource('/api/location/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('IndustryRes', IndustryRes);

    IndustryRes.$inject = ['$resource'];

    function IndustryRes($resource) {
        return $resource('/api/industry/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('CompanyTypeRes', CompanyTypeRes);

    CompanyTypeRes.$inject = ['$resource'];

    function CompanyTypeRes($resource) {
        return $resource('/api/company-type/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('SalaryRangeRes', SalaryRangeRes);

    SalaryRangeRes.$inject = ['$resource'];

    function SalaryRangeRes($resource) {
        return $resource('/api/salary-range/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('WaitIntervalRes', WaitIntervalRes);

    WaitIntervalRes.$inject = ['$resource'];

    function WaitIntervalRes($resource) {
        return $resource('/api/wait-interval/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('OnJobSuccessRes', OnJobSuccessRes);

    OnJobSuccessRes.$inject = ['$resource'];

    function OnJobSuccessRes($resource) {
        return $resource('/api/on-job-success/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('JobTypeRes', JobTypeRes);

    JobTypeRes.$inject = ['$resource'];

    function JobTypeRes($resource) {
        return $resource('/api/job-type/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('JobDurationRes', JobDurationRes);

    JobDurationRes.$inject = ['$resource'];

    function JobDurationRes($resource) {
        return $resource('/api/job-duration/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('ExperienceLevelRes', ExperienceLevelRes);

    ExperienceLevelRes.$inject = ['$resource'];

    function ExperienceLevelRes($resource) {
        return $resource('/api/experience-level/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('BlueprintTasksRes', BlueprintTasksRes);

    BlueprintTasksRes.$inject = ['$resource'];

    function BlueprintTasksRes($resource) {
        return $resource('/api/blueprint-tasks/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('VisaStatusRes', VisaStatusRes);

    VisaStatusRes.$inject = ['$resource'];

    function VisaStatusRes($resource) {
        return $resource('/api/visa-status/', {}, {
            'query': {
                method: 'GET',
                isArray: true,
                cache: true
            },
            'get': {
                method: 'GET',
                isArray: false,
                cache: true
            }
        });
    }
})();
