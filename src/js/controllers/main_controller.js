angular.module('Openhealth.controllers.Main',
               ['Openhealth.services.Cordova'])

.controller('MainController', ['$rootScope',
                               '$scope',
                               '$window',
                               function($rootScope, $scope, $window){ 
  
  //DUMMY data
  //Insert SMS inbox
  // var scrollItems = [];

  // for (var i=1; i<=100; i++) {
  //   scrollItems.push('Message ' + i);
  // }

  // $scope.scrollItems = scrollItems;
  // alert(typeof(SMS))

  var smsList = [];

  if (typeof(SMS) != 'undefined') {
    SMS.listSMS({}, function(data) {
      var html = '';
      var sms = '';
      if (Array.isArray(data)) {
        for (i in data) {
          sms = data[i];
          smsList.push(sms.address + ': ' + sms.body);
        }
      }
    }, function(err) {
      smsList.push('error in listSMS: ' + err);
    });
  }
  else {
    smsList.push('SMS undefined');
  }

  $scope.scrollItems = smsList;

  $scope.hello = function() {
    // alert('hello');  // Replace with window.open call
    result = $window.open('openHealth://', '_blank');
  }

}]);
