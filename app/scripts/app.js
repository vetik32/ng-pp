'use strict';

//TODO: http://jsfiddle.net/cfulnecky/NRUxs/

angular.module('partnerApp',
    ['ui.router', 'ui.bootstrap', 'ui.date', 'ReportsServices', 'SessionServices', 'PartnerServices',
      'IntegrationsService', 'sjDates', 'CustomNgDirectives', 'sj.grid', 'sj.d3Directives',
      'angularSpinner', 'ajoslin.promise-tracker', 'cgBusy', 'ErrorHandlerService', 'Auth'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'ACCESS_LEVELS',
    function($stateProvider, $urlRouterProvider, $httpProvider, ACCESS_LEVELS) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: '../views/login.html',
        data: {
          access_level: ACCESS_LEVELS.PUB,
          title: 'ZZZ Traveler Platform - Login'
        }
      })
      .state('defaultLayout', {
        abstract: true,
        templateUrl: '../views/defaultLayout.html',
        data: {
          access_level: ACCESS_LEVELS.PARTNER
        }
      })
      .state('home', {
        parent: 'defaultLayout',
        url: '/home',
        templateUrl: '../views/home.html',
        data: {
          title: 'ZZZ Traveler Platform - Data Partner Home'
        }
      })
      .state('integration', {
        parent: 'defaultLayout',
        url: '/integration',
        templateUrl: '../views/integration.html',
        data: {
          title: 'ZZZ Traveler Platform - Integration Guide'
        }
      })
      .state('partners', {
        parent: 'defaultLayout',
        url: '/partners',
        templateUrl: '../views/partners.html',

        data: {
          access_level: ACCESS_LEVELS.ADMIN,
          title: 'ZZZ Traveler Platform - Partners'
        }
      });

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('$httpDelayInterceptor');

  }]);

angular.module('partnerApp').value('cgBusyTemplateName', 'views/spinner.html');

angular.module('partnerApp')
  .run(['$rootScope', '$state', 'AuthService',
    function($rootScope, $state, AuthService) {
      $rootScope.$state = $state;

      $rootScope.$on('$stateChangeStart', function(event, toState){
        if (toState.name === 'login') {
          return;
        }

        if (!AuthService.isAuthorized(toState.data.access_level)) {
          if (AuthService.isLoggedIn()) {
            // The user is logged in, but does not
            // have permissions to view the view
            $state.go('home');
          } else {
            $state.go('login');
          }

          event.preventDefault();
        }
      });
    }]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['partnerApp']);
});
