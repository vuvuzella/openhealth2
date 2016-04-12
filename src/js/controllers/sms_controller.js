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
    // TODO: Accept only messages with correct filters?
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
      var filters = {
        indexFrom : 0,  // just to be sure to start from 0
        maxCount  : 999 // plugin default is 10
      };

      setTimeout(function() {

        deviceReady(function() {
          if (typeof(SMS) != 'undefined') {
            SMS.listSMS(filters, function(data) {
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
    $scope.toggleListen = false;
    var KWORD = 'medapp';
    var KEYWORDLENGTH = KWORD.length;
    $scope.smsListen = function() {
      console.log('openHealth: Entering smsListen()');
      deviceReady(function() {

        if (typeof(SMS) != 'undefined') {
          SMS.startWatch(function() {
            console.log('Now listening for incoming SMS...');
            alert('Now listening for incoming SMS...');
            $scope.toggleListen = true;
            document.addEventListener('onSMSArrive', function(receivedSMS){
              alert('SMS Received!');
              console.log('SMS Received!');
              // console.log('typeof data is ' + typeof(receivedSMS.data));
              // console.log('typeof receivedMsg is ' + typeof(receivedSMS));
              // add processing of sms
              // If it has the keywords, add to list
              // else restore and give to other SMS apps
              var smsData = receivedSMS.data;
              var dataList = [];
              dataList.push(smsData);
              var keyword = smsData.body.substr(0, KEYWORDLENGTH); // get the first three 
              console.log('keyword is ' + keyword);

              if (KWORD.localeCompare(keyword) == 0) {
                // process the body after the keyword.
                // entry for other services
                console.log('keyword accepted.');
                console.log('Body of the message is ' + 
                  smsData.body.substr(KEYWORDLENGTH + 1, smsData.body.length));
              } else {
                // restore SMS message for other apps to process
                console.log('Received message does not contain a keyword');
                // restoreSMS(receivedSMS);
                restoreSMS(dataList);
              }

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

    // function variable for removeEventListener
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
            $scope.toggleListen = false;
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

    // startIntercept
    $scope.startIntercept = function() {
      if ($scope.toggleListen != true) {
        console.log('Cannot start intercepting, not listening to SMS');
        return;
      }
      console.log('openHealth: Entering startIntercept()');

      deviceReady(function() {
        if (typeof(SMS) != 'undefined') {
          SMS.enableIntercept(true,
            function() {
              console.log('Start intercepting messages');
              alert('Start intercepting messages');
            },
            function() {
              console.log('Failed to start intercepting');
              alert('Failed to start intercepting');
            });
          
        } else {
          console.log('SMS module not loaded');
          alert('SMS module not loaded');
        }
      });
    }
    
    // startIntercept
    $scope.stopIntercept = function() {
      console.log('openHealth: Entering stopIntercept()');

      deviceReady(function() {
        if (typeof(SMS) != 'undefined') {
          SMS.stopWatch(function() {
            console.log('Stopeed intercepting messages');
            alert('Stopeed intercepting messages');
          },
          function() {
            console.log('Failed to stop intercepting messages');
            alert('Failed to stop intercepting messages');
          });
        } else {
          console.log('SMS module not loaded');
          alert('SMS module not loaded');
        }
      });
    }

    // restoreSMS()
    // restore intercepted messages back to the inbox
    // messageList MUST be a list of receivedSMS.data objects
    // By default, no phone notification is done. Add ringing notification
    var restoreSMS = function(messageList) {
      console.log('openHealth: Entering restoreSMS()');
      deviceReady(function() {
        if (typeof(SMS) != 'undefined') {
          SMS.restoreSMS(messageList,
            function(numOfRestoredMsg) {
              // Do message clean up
              alert('Successfully restored' + numOfRestoredMsg +
                ' messages!' );
              console.log('Restoring ' + numOfRestoredMsg + 'sms message');
            },
            function(err) {
              alert('Error in restoring sms messge: ' + err);
              console.log('Error in restoring sms messge: ' + err);
            });
        } else {
          console.log('SMS module not loaded');
          alert('SMS module not loaded');
        }
      });
    }
}]);
