/*
 * SMSController
 * TODO: Better if getSMS functionality is a service than a controller
 * TODO: deviceReady will be called repeatedly before any call to SMS
 *       is made. This makes repeated code. Re-organize so that deviceReady
 *       is called only once, on startUp?
 * TODO: Add console logging
 */
angular.module('Openhealth.controllers.SMS',
               ['Openhealth.services.Cordova'])

.controller('SMSController',
            ['$rootScope', 
             '$scope',
             'deviceReady',
             '$q',
  function($rootScope, $scope, deviceReady, $q){

    $scope.smsMsgList = [];

    // getSMS()
    // Async - Retrieves the messages from the inbox of the phone
    $scope.getSMS = function() {
      console.log('openHealth: Entering listSMS()');
      var deferred = $q.defer();

      deferred.promise.then(function(newList) {
        $scope.smsMsgList = newList;
      }, 
      function(newList) {
        $scope.smsMsgList = newList;
      });

      var smsList = [];

      setTimeout(function() {

        deviceReady(function() {
          if (typeof(SMS) != 'undefined') {
            SMS.listSMS({}, function(data) {
              var sms = '';
              if (Array.isArray(data)) {
                for (var index in data) {
                  sms = data[index];
                  smsList.push(sms.address + ': ' + sms.body);
                }
                deferred.resolve(smsList);
              } else {
                smsList.push('Inbox is empty');
                deferred.reject(smsList);
              }
            });
          } else {
            smsList.push('Error in SMS plugin');
            deferred.reject(smsList);
          }
        });

      }, 1000);

      return deferred.promise;
    }
    
    // sendSMS()
    // Async sending of SMS message
    // TODO: Add mobile number and message checking
    $scope.sendSMS = function() {
      var mobileNo = $scope.number;
      var strMsg = $scope.message;

      console.log('openHealth: Entering sendSMS()');
      var deferred = $q.defer();

      deferred.promise.then(function(message) {
        alert(message);
        console.log(message)
      },
      function(message) {
        alert(message);
        console.log(message)
      })

      setTimeout(function() {
        deviceReady(function() {

          if (typeof(SMS) != 'defined') {
            console.log('sending message');
            SMS.sendSMS(mobileNo, strMsg,
              function() {
                deferred.resolve('Message Sent');
              },
              function() {
                deferred.reject('Failed to send message');
              });
          }
        });
      }, 2000);

      return deferred.promise;
    }

}]);
