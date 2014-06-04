'use strict';

angular.module('partnerApp')
  .controller('IntegrationsGuideCtrl', function ($location, $scope, IntegrationsGuide, SessionService, promiseTracker, AuthService) {

    var guideCache = {};
    var pagesTitles = {
      'tag_format' : 'ZZZ Tags',
      'search' : 'Search',
      'confirmation' : 'Confirmation',
      'homepage' : 'Homepage',
      'boarding_pass' : 'Boarding Pass'
    };

    $scope.activeSearchMenuItem = false;
    $scope.menu = 'tag_format';
    $scope.currentGuideId = '';

    $scope.getPartnerKey = function() {
      return AuthService.getUserKey();
    };

    $scope.integration = {
      'url': 'views/integration/tag_format.html'
    };
    $scope.pageTitle = pagesTitles.tag_format;

    $scope.loadSubPage = function(subPage, selectedGuide){

      if (!selectedGuide) {
        selectedGuide = subPage;
      }

      $scope.pageTitle = pagesTitles[subPage];
      $scope.integration.url  =   'views/integration/' + subPage + '.html';

      if (selectedGuide) {
        $scope.loadGuide(selectedGuide);
      }
    };


    var setGuide = function(guide){
      $scope.guide = guide;
      if (!guideCache[guide.id]) {
        guideCache[guide.id] = guide;
      }
    };

    var getGuide = function(guideId){
      return guideCache[guideId] || '';
    };

    var getCurrentGuide = function(){
      return getGuide($scope.currentGuideId);
    };

    $scope.buildURLOnly = function(){
      var url = 'https://pixel.ZZZ.com/partner/' + AuthService.getUserKey();
      var guide = getCurrentGuide();

      url += '/' + guide.url || '';

      return url;
    };

    $scope.buildURL = function(){
      var guide = getCurrentGuide();
      var params = [];
      var lines = 0, url;

      if (guide === '') {
        return '';
      }

      url = $scope.buildURLOnly();

      params[lines] = '';
      _.each(guide.params, function(param, index){

        if (index !== 0 ) {
          params[lines] += '&';
        }
        params[lines] += param.name;
        if (param.default) {
          params[lines] += '=' + param.default;

        }

        if (params[lines].length > 80) {
          lines += 1;
          params[lines] = '';
        }
      });
      return url + '?' + params.join(' ');
    };

    $scope.loadGuide = function(guideType) {
      var guide = getGuide(guideType);
      $scope.currentGuideId = guideType;

      if (guide !== '') {
        setGuide(guide);
      } else {
        var resource = IntegrationsGuide.get({guideType: guideType}, {
          tracker: 'integrationGuide'
        }, function (response) {
          setGuide({
            'id' : response.id,
            'title' : response.title,
            'url':   response.url,
            'params': response.params
          });
        }).$promise;
        promiseTracker('integrationGuide').addPromise(resource);
      }
    };


    $scope.loadGuide($scope.menu);
  });


