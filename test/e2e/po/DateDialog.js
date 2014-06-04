'use strict';

var DateDialog = function () {

  var dialogLocator = by.css('.modal');
  var dialog;
  var Utils = require('./Utils');

  function getDialog() {
    if (!dialog) {
      Utils.waitUntilIsDisplayed(dialogLocator);
      dialog = element(dialogLocator);
    }

    return dialog;
  }

  return {

    setDateRange: function (range) {
      var fromDateElement = getDialog().findElement(by.model('range.from'));
      var toDateElement = getDialog().findElement(by.model('range.to'));
      this.setDate(range.from, fromDateElement);
      this.setDate(range.to, toDateElement);

      getDialog().findElement(by.css('.btn-primary')).click();
    },

    setDate: function (dateString, blockElement) {
      var prevButton, month;
      var date = new Date(dateString);
      var shortMonth = date.toString().split(' ')[1];
      var dateDigit = date.getDate();

      protractor.getInstance().driver.wait(function(){
        prevButton = blockElement.findElement(by.css('.ui-datepicker-prev'));
        month = blockElement.findElement(by.css('.ui-datepicker-month'));
        return month.getText()
          .then(function(text) {
            var monthSelected = text.indexOf(shortMonth) !== -1;

            if (!monthSelected) {
              prevButton.click();
            }

            return monthSelected;
          });
      }, 5000, 'zzz');

      blockElement.findElements(by.css('.ui-datepicker-calendar a')).then(function(hrefs){
        hrefs[dateDigit -1].click();
      });
      //console.log('dateDigit: ', dateDigit)
    },

    getFromInput: function () {
      var fromSelector = getDialog().findElement(by.model('range.from'));
      return fromSelector.findElement(by.css('input')).then(function(tagName){
        console.log('tag name', tagName);
      });

      //return fromSelector.findElement(by.css('input'));
    }
  };
};

module.exports = DateDialog;
