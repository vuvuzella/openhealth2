angular.module('Openhealth', [
  'ngRoute',
  'mobile-angular-ui',
  'Openhealth.controllers.Main',
  'Openhealth.controllers.SMS',
])


.config(function($routeProvider) {
  $routeProvider.when('/', 
    {
      templateUrl:'home.html',
      reloadOnSearch: false
    });

  $routeProvider.when('/send', 
    {
        controller: 'SMSController',  
        templateUrl:'send.html',  
        reloadOnSearch: false
    });
  $routeProvider.when('/inbox', 
    {
        controller: 'SMSController',  
        templateUrl:'inbox.html',  
        reloadOnSearch: false
    });


});

