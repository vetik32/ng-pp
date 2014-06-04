'use strict';

var Utils = {
  waitUntilIsDisplayed: function (elementLocator) {
    var driver = protractor.getInstance().driver;

    return driver.wait(function () {
      return element(elementLocator).isDisplayed().then(function (displayValue) {
        return displayValue !== 'none';
      });
    }, 2000, 'element did not show up');
  }
};

module.exports = Utils;
