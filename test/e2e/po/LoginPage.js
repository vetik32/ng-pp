'use strict';

var LoginPage = function(){

  return {

    open: function() {
      browser.get('http://localhost:9000');
    },

    setName: function(name){
      element(by.model('partner.name')).sendKeys(name);
    },

    setPassword: function(password){
      element(by.model('partner.password')).sendKeys(password);
    },

    submit: function () {
      element(by.css('.submit')).click();
    },

    login: function(name, pass){
      this.setName(name);
      this.setPassword(pass);
      this.submit();
    }
  };
};

module.exports = LoginPage;
