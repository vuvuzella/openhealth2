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

          if (typeof(SMS) != 'undefined') {
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

    // startWatch()
    $scope.smsListen = function() {
      console.log('openHealth: Entering smsListen()');
      deviceReady(function() {

        if (typeof(SMS) != 'undefined') {
          SMS.startWatch(function() {
            console.log('Now listening for incoming SMS...');
            alert('Now listening for incoming SMS...');
            document.addEventListener('onSMSArrive', function(){
              alert('SMS Received!');
              console.log('SMS Received!');
            });
          },
          function() {
            console.log('Failed to start listening');
            alert('Failed to start listening');
          });
        } else {
          console.log('SMS module not loaded');
          alert('SMS module not loaded');
        }
      });
    }

    var removeListener = function() {
      alert('SMS Listener removed!');
      console.log('SMS Listener removed');
    }

    // stopWatch()
    $scope.smsStop = function() {
      console.log('openHealth: Entering smsStop()');
      deviceReady(function() {

        if (typeof(SMS) != 'undefined') {
          SMS.stopWatch(function() {
            console.log('Stopped listening for incoming SMS...');
            alert('Stoppped listening for incoming SMS...');
            document.removeEventListener('onSMSArrive', removeListener);
          },
          function() {
            console.log('Failed to stop listening');
            alert('Failed to stop listening');
          });
        } else {
          console.log('SMS module not loaded');
          alert('SMS module not loaded');
        }
      });
    }

}]);
