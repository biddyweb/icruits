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
        return $resource('/api/job/:job_name_slug/ ');
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

    LogoutRes.$inject = ['$cookies', '$http'];

    function LogoutRes($cookies, $http) {

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
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('app').factory('JWTTokenRes', JWTTokenRes);

    JWTTokenRes.$inject = ['$http', '$cookies', '$timeout', '$state'];

    function JWTTokenRes($http, $cookies, $timeout, $state) {
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
                return response
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
