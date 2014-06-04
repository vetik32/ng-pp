'use strict';

describe('Controller: PartnerCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp', 'SessionServices', 'Auth'));
  var $httpBackend, $rootScope, createController, scope;
  var updatePartnerResponse = {
    'partner': {
      'name': 'United',
      'taxonomy_code': 'UA',
      'key': 'Ih7HqAoc9nAFaEFy'
    },
    'authorized': true,
    'admin': true
  };
  var PartnerCtrl;

  var adminJSONResponse = [
    {'created_at': '2013-01-03T18:37:02Z', 'data_key': 'WBCTXCZQ', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 3, 'name': 'kayak', 'password_digest': '$2a$10$eP3l/jjNLKfRVSZJSL8sDeJiJw2qlvA.BA7Q4hnT.yglGJF.nLTM2', 'remember_token': 'tvpv1itjPdbTxTMe8Nw1lg', 'stabilizer': 'generic', 'taxonomy_code': 'GQ', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:50Z', 'data_key': 'Ih7HqAoc9nAFaEFy', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 5, 'name': 'United', 'password_digest': '$2a$10$M4UFaEgtE/a.YpjxTXTShO/6Q47lLpf9QfX2byOFY.X4MjwRfItkC', 'remember_token': null, 'stabilizer': 'united', 'taxonomy_code': 'UA', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': 'V9X6KxGOM68wKfUY', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 6, 'name': 'UsAir', 'password_digest': '$2a$10$cxA6H9FmYLShTwPV/UTheO2YDXTZS9opWeP9oXjnuNQE32Agf8Iwa', 'remember_token': null, 'stabilizer': 'usair', 'taxonomy_code': 'US', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': 'k1xDI3QjiDXlI8AK', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 7, 'name': 'Alaska', 'password_digest': '$2a$10$/BgacdBerbelrgbq9iKGX.12SDEl.LSq0wM91jlTN.qhWm3bFvVU.', 'remember_token': null, 'stabilizer': 'alaska', 'taxonomy_code': 'AL', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': '3S1IflYUx6WmXQlQ', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 8, 'name': 'Delta', 'password_digest': '$2a$10$zeSchD8c4eI9nUPF0/ONAeetR8w1gNriZDF00RjxFyQ0CErVTFkhq', 'remember_token': null, 'stabilizer': 'delta', 'taxonomy_code': 'DL', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': '2ejGFw3SwjWkcVhh', 'exchange_ids': ['Turn', 'XL8'], 'id': 9, 'name': 'Kayak', 'password_digest': '$2a$10$hc9cIQ7Knv0Y1HZ59P/7lebugJcTQnIcAijDzkHro4P05vc3WDUUW', 'remember_token': null, 'stabilizer': 'generic', 'taxonomy_code': 'KA', 'updated_at': '2014-02-21T09:53:51Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': '13gVb9pQbw2uU7yY', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 10, 'name': 'Roomkey', 'password_digest': '$2a$10$qafzRxojOxsWzuFsicCY3uj66Uhcwt7KGSh9Yc.Clat1IauGnxEsa', 'remember_token': null, 'stabilizer': 'roomkey', 'taxonomy_code': 'RK', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:51Z', 'data_key': '2r2IOH8VeZHbToIg', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 11, 'name': 'WTH_1 ', 'password_digest': '$2a$10$/lXQjREYqCzp84et2sAznOrQ/O34vXUgrZWaZbi4CsvId.Y32qQqG', 'remember_token': null, 'stabilizer': 'generic', 'taxonomy_code': 'WTH1', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:52Z', 'data_key': 'KdLvBQ45jBLIgZFL', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 12, 'name': 'WTH_2', 'password_digest': '$2a$10$V9gEmmj5OO/IO55zq1SEJOoe1i1mOMFXh7TjQYm3IfZuxhpU/HzV.', 'remember_token': null, 'stabilizer': 'generic', 'taxonomy_code': 'WTH2', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:52Z', 'data_key': 'igTlX5Lgk4GXI1bk', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 13, 'name': 'Hipmunk', 'password_digest': '$2a$10$Mkcicj6/FcXR8jO2GhZ7Neog.uqs0adSK2clvEunfeAwxt/8RwFsW', 'remember_token': null, 'stabilizer': 'generic', 'taxonomy_code': 'HM', 'updated_at': '2014-02-21T09:53:53Z'},
    {'created_at': '2014-02-21T09:53:52Z', 'data_key': 'Hx7ej8LvyWcgkDN6', 'exchange_ids': ['Turn', 'COMSCORE'], 'id': 14, 'name': 'ClickTripz', 'password_digest': '$2a$10$xAVzEkLT8lQUgZySJhaqGOScNT.0p5qj8Zb8Cq9SysWEZXsrUZu8e', 'remember_token': null, 'stabilizer': 'generic', 'taxonomy_code': 'CT', 'updated_at': '2014-02-21T09:53:53Z'}
  ];

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET('/admin.json').respond(adminJSONResponse);
    $httpBackend.whenGET('/views/login.html').respond('');

    $httpBackend.whenPUT('/updatepartner').respond(updatePartnerResponse);
    $httpBackend.whenGET('../views/login.html').respond();

    $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');

    scope = $rootScope.$new();

    createController = function () {
      return $controller('PartnerCtrl', {'$scope': scope });
    };

    PartnerCtrl = createController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('PartnerCtrl should have no alerts', function () {
    $httpBackend.flush();
    expect(scope.alerts.length).toEqual(0);
  });

  it('PartnerCtrl should a list of partners', inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.flush();
    expect(scope.partners.length).not.toEqual(0);
  }));

  it('PartnerCtrl should be able to access partner name', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);
    $httpBackend.flush();

    expect(scope.getPartnerName()).toEqual(user.name);
  }));

  it('PartnerCtrl should update partner', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var $httpBackend = $injector.get('$httpBackend');
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);
    expect(scope.getPartnerName()).toEqual(user.name);

    scope.updatePartner(5);
    $httpBackend.flush();
    expect(scope.getPartnerName()).toEqual(updatePartnerResponse.partner.name);
  }));

  it('PartnerCtrl should fail to create a new partner when pass is missing', inject(function ($injector) {
    var $httpBackend = $injector.get('$httpBackend');
    var $compile = $injector.get('$compile');
    var element = angular.element('<div><alert ng-repeat="alert in alerts" type="alert.type"' +
      ' close="closeAlert($index)">{{alert.msg}}</alert></div>');
    var partnerCreateErrorResponseJSON = {
      'password_digest': ['can\'t be blank'],
      'password': ['can\'t be blank'],
      'password_confirmation': ['can\'t be blank']
    };

    $compile(element)(scope);

    scope.newpartner = {
      'partner': {
        'name': 'test',
        'password': '',
        'password_confirmation': ''
      }
    };

    scope.$digest();
    expect(scope.alerts.length).toEqual(0);

    scope.createPartner();
    $httpBackend.expectPOST('/admin.json').respond(422, partnerCreateErrorResponseJSON);

    $httpBackend.flush();
    scope.$digest();
    expect(scope.alerts.length).toEqual(1);
    expect(element.find('.alert-error').length).toEqual(1);
    expect(element.find('.alert-error span').text())
      .toEqual('There was an error. password_digest can\'t be blank.\n' +
        'password can\'t be blank.\n' +
        'password_confirmation can\'t be blank.\n');

    scope.closeAlert();
    scope.$digest();
    expect(element.find('.alert-success').length).toEqual(0);
    expect(element.text()).toBe('');

  }));

  it('PartnerCtrl should create a new partner', inject(function ($injector) {
    var $httpBackend = $injector.get('$httpBackend');
    var $compile = $injector.get('$compile');
    var element = angular.element('<div><alert ng-repeat="alert in alerts" type="alert.type" ' +
      'close="closeAlert($index)">{{alert.msg}}</alert></div>');
    var partnerCreateResponseJSON = {
      'created_at': '2014-03-04T09:04:49Z',
      'data_key': 'ExBSn3VEvTZYR6N3',
      'exchange_ids': ['Turn', 'COMSCORE'],
      'id': 21,
      'name': 'test',
      'password_digest': '$2a$10$aac1/W8RhHjSUkqSuAt2auwCVmnIAA8b1UZteRCXRGhOdHeoFIyA2',
      'remember_token': null,
      'stabilizer': 'generic',
      'taxonomy_code': 'HV',
      'updated_at': '2014-03-04T09:04:49Z'
    };

    $compile(element)(scope);

    scope.newpartner = {
      'partner': {
        'name': 'test',
        'password': 'test',
        'password_confirmation': 'test'
      }
    };

    scope.$digest();
    expect(scope.alerts.length).toEqual(0);

    scope.createPartner();
    $httpBackend.expectPOST('/admin.json').respond(201, partnerCreateResponseJSON);

    $httpBackend.flush();
    scope.$digest();
    expect(scope.alerts.length).toEqual(1);
    expect(element.find('.alert-success').length).toEqual(1);
    expect(element.find('.alert-success span').text()).toEqual('Partner created.');

    scope.closeAlert();
    scope.$digest();
    expect(element.find('.alert-success').length).toEqual(0);
    expect(element.text()).toBe('');
  }));

});
