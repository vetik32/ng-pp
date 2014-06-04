partner App
========

# Environment

Assuming you have already installed:

1. Node.js && npm

2. scss -> css will need compass

### Installing Ruby

> Compass runs on any computer that has ruby installed.
> For more advanced users you may want to install rvm.

> http://www.ruby-lang.org/en/downloads/

> Setting up the ruby environment

1. `$ gem update --system`
2. `$ gem install compass`




### Installing Grunt, bower

`$ npm install -g grunt-cli bower`

### Installing the project after cloning 

1. `$ npm install`
2. `$ bower install`

### Start app

1. `$ grunt server`

### Testing

>  might be requried to include chromedriver's path into your $PATH

1. for end to end testing
  * `$ grunt install:selenium`
  * `$ grunt test:e2e`
  
2. for unit testing 
  * `$ grunt test`

