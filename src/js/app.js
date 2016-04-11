angular.module('Openhealth-MedAdhere', [
  'ngRoute',
  'mobile-angular-ui',
  'Openhealth-MedAdhere.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
});