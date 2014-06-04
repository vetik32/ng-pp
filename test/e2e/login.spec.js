'use strict';

var LoginPage = require('./po/LoginPage');
var HomePage = require('./po/HomePage');

describe('Test', function (){

  it('should show login screen', function () {
    var partnerLoginPage = new LoginPage();
    var homePage = new HomePage();

    partnerLoginPage.open();
    partnerLoginPage.setName('test');
    partnerLoginPage.setPassword('test');
    partnerLoginPage.submit();

    expect(browser.getCurrentUrl()).toContain('#/home');

    homePage.logout();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/');
  });
});
