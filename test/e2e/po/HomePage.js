'use strict';

var DateDialog = require('./DateDialog');

var HomePage = function(){

  var dateDialog = new DateDialog();

  return {
    open: function() {
      browser.get('http://localhost:9000/#/home');
    },

    selectDateRange: function(range) {
      var radioButton = element.all(by.repeater('date in dates'));
      radioButton.get(2).click();
      dateDialog.setDateRange(range);
    },

    logout: function(){
      element(by.css('.greeting-area a')).click();
    }
  };
};

module.exports = HomePage;
