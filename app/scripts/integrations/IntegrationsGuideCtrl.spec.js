'use strict';

describe('Controller: IntegrationsGuideCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp'));

  var IntegrationsGuideCtrl, createController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    var $controller =$injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    createController = function() {
      return $controller('IntegrationsGuideCtrl', {'$scope': scope });
    };

    IntegrationsGuideCtrl = createController();
  }));

  var guide_cruise_search = {
      'id': 'cruise_search',
      'title': 'Cruise',
      'url': 'cs',
      'params': [
        {
          'name': 'p1',
          'default': 'v1',
          'description': 'Name of the cruise line',
          'type': 'string'
        },
        {
          'name': 'p2',
          'default': 'v201234567890012345678900123456789001234567890012345678900123456789001234567890',
          'description': 'Departure date',
          'type': 'date (yyyy-mm-dd)'
        },
        {
          'name': 'p3',
          'default': 'v3',
          'description': 'Length of cruise in nights',
          'type': 'string'
        }
      ]
    };

  it('IntegrationsGuideCtrl should be able to access partner key, have several methods defined', inject(function() {

    expect(scope.getPartnerKey).toBeDefined();
    expect(scope.integration).toBeDefined();
    expect(scope.pageTitle).toBeDefined();
    expect(scope.loadSubPage).toBeDefined();
    expect(scope.buildURLOnly).toBeDefined();
    expect(scope.buildURL).toBeDefined();
    expect(scope.loadGuide).toBeDefined();
  }));

  it('IntegrationsGuideCtrl should be able to access partner\'s key', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);

    expect(scope.getPartnerKey()).toEqual(user.key);
  }));

  it('IntegrationsGuideCtrl should be able to loadSubPage', inject(function() {
    var subPage = 'tag_format';
    spyOn(scope, 'loadGuide');

    scope.loadSubPage(subPage);

    expect(scope.pageTitle).toEqual('ZZZ Tags');
    expect(scope.integration.url).toEqual( 'views/integration/' + subPage + '.html');
    expect(scope.loadGuide).toHaveBeenCalledWith(subPage);
  }));

  it('IntegrationsGuideCtrl should be able to loadGuide', inject(function($injector) {

    var subPage = 'cruise_search';
    scope.loadGuide(subPage);
    expect(scope.currentGuideId).toEqual(subPage);

    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('../views/login.html').respond();
    $httpBackend.whenGET(/data\/guide_[\w|_]*\.json/).respond(guide_cruise_search);

    scope.loadGuide('flight_search');
    $httpBackend.flush();
    expect(scope.currentGuideId).toEqual('flight_search');
    scope.loadGuide(subPage);
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('IntegrationsGuideCtrl should be able to buildURLOnly', inject(function($injector) {

    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');
    var $httpBackend = $injector.get('$httpBackend');
    var buildURL, url, subPage = 'cruise_search';

    AuthService.setUser(user);

    $httpBackend.whenGET('../views/login.html').respond();
    $httpBackend.whenGET(/data\/guide_[\w|_]*\.json/).respond(guide_cruise_search);
    scope.loadGuide(subPage);
    $httpBackend.flush();

    url = 'https://pixel.ZZZ.com/partner/' + AuthService.getUserKey() + '/' + guide_cruise_search.url ;

    buildURL = scope.buildURLOnly();

    expect(buildURL).toEqual(url);
  }));

  it('IntegrationsGuideCtrl should be able to buildURL', inject(function($injector) {

    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');
    var $httpBackend = $injector.get('$httpBackend');
    var buildURL, url, subPage = 'cruise_search';

    AuthService.setUser(user);

    expect(scope.buildURL()).toEqual('');

    $httpBackend.whenGET('../views/login.html').respond();
    $httpBackend.whenGET(/data\/guide_[\w|_]*\.json/).respond(guide_cruise_search);
    scope.loadGuide(subPage);
    $httpBackend.flush();

    url = 'https://pixel.ZZZ.com/partner/' + AuthService.getUserKey() + '/' +
      guide_cruise_search.url + '?p1=v1&p2=v201234567890012345678900123456789001234567890' +
      '012345678900123456789001234567890 &p3=v3';

    buildURL = scope.buildURL();

    expect(buildURL).toEqual(url);
  }));

});
