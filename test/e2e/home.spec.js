'use strict';

var LoginPage = require('./po/LoginPage');
var HomePage = require('./po/HomePage');

describe('Home page Suite', function (){
  var loginPage = new LoginPage();
  var homePage = new HomePage();

  it('should show login screen when try to access home without being logged', function () {

    homePage.open();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/');

    loginPage.login('test','test');

    expect(element(by.css('.welcome')).getText()).toEqual('Hi, test');
    expect(browser.getCurrentUrl()).toEqual('http://localhost:9000/#/home');
  });


  it('should select date range', function () {

    homePage.selectDateRange({
      from: '10-01-2013',
      to: '10-03-2013'
    });

    expect(element(by.binding('reportFilter.from')).getText()).toEqual('Tuesday, October 01');
    expect(element(by.binding('reportFilter.to')).getText()).toEqual('Thursday, October 03');
  });

  it('should hide group label when line graph type is selected', function() {
    expect(element(by.css('.graphType-block label')).isDisplayed()).toBeTruthy();
    element(by.model('type')).click();
    element(by.model('type')).findElement(by.css('[value="liniar"]')).click();
    expect(element(by.css('.graphType-block label')).isDisplayed()).toBeFalsy();
  });
});
