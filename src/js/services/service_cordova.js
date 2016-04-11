/*
 * service wrapper for cordova
 *
 */
angular.module('Openhealth.services.Cordova', [])

.factory('deviceReady', function(){
  return function(done){
    console.log('In deviceReady');
    if(typeof(window.cordova === 'object')) {
      console.log('Adding deviceready listener...');
      document.addEventListener('deviceready', function() {
        done();
      });
    } else {
      console.log('No deviceready listener added');
      done();
    }
    console.log('deviceReady done');
  };
});
