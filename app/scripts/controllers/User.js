'use strict';

angular.module('partnerApp')
  .controller('UserCtrl', ['$scope', 'SessionService', 'ACCESS_LEVELS', 'AuthService',
    function($scope, SessionService, ACCESS_LEVELS, AuthService) {
      var navigationLinks = [
        {
          display: 'Home',
          url: 'home',
          access_level: ACCESS_LEVELS.PARTNER
        },
        {
          display: 'Integration Guide',
          url: 'integration',
          access_level: ACCESS_LEVELS.PARTNER
        },
        {
          display: 'Partners',
          url: 'partners',
          access_level: ACCESS_LEVELS.ADMIN
        }
      ];

      $scope.getPartnerName = function(){
        return AuthService.getUserName();
      };

      function updateNavigationLinks() {
        var links = [];
        _.each(navigationLinks, function(link) {
          if (AuthService.isAuthorized(link.access_level)) {
            links.push(link);
          }
        });
        $scope.navigation = links;
      }

      $scope.logout = function() {
        SessionService.logout();
      };

      updateNavigationLinks();

    }
  ]);
