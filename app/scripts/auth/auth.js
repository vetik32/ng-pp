(function(angular, undefined) {
  'use strict';

  angular.module('Auth',[])
    .constant('ACCESS_LEVELS', {
      PUB: 1,
      PARTNER: 2,
      ADMIN: 4
    })
    .factory('AuthService', [
      'ACCESS_LEVELS',
      function(ACCESS_LEVELS) {
        var _user = null;

        return {
          isAuthorized: function(accessLevel) {
            if (_.isNull(_user) || _.isUndefined(_user)) {
              return false;
            }

            return _user.role >= accessLevel;
          },
          setUser: function(user) {
            if (user.authorized !== true) {
              return;
            }

            user.role = ACCESS_LEVELS.PARTNER;

            if (user.admin === true) {
              user.role = ACCESS_LEVELS.ADMIN;
            }

            _user = user;
          },
          getToken: function() {
            return _user ? _user.token : '';
          },
          isLoggedIn: function() {
            return _user ? true : false;
          },
          getUser: function() {
            return _user;
          },
          getUserKey: function() {
            return _user ? _user.key : null;
          },
          getUserName: function() {
            return _user ? _user.name : null;
          },
          logout: function() {
            _user = null;
          }
        };
      }
    ]);
})(window.angular);
