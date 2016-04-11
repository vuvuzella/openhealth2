# openhealth2

openhealth2

# After cloning:
Run the following in order:

Install angular dependencies. If not previously installed, this may
take a while especially angularjs.
1. 'bower install'

Install gulp dependencies
2. npm install

# Building the mobileangular app

'gulp build' will just build the latest javascript files from 'src'
folder and output them in 'www' folder.
'gulp' builds the javascript files as well as sets up an auto-rebuild
server that watches changes made to the files inside the 'src' folder
1. 'gulp build' or  just 'gulp'

2. 'cordova run' - run in browser
   'cordova run (android | iphone | platformX)' run app in the specified
   platform

# Logging methods
1. Android-level logging can be done using 'adb logcat | grep Console'. The
   cordova specific activity is 'Web Console', where console.log's are
   outputted.

2. 'chrome://inspect' in google chrome. Haven't tried this yet.
   This is for android 4.4+ only

# Plugins:

Install the following cordova plugins:
* cordova-plugin-sms
* custom url scheme

# TODO:
* Make this code to be Service-Oriented Architecture, wherein 
components of the system communicate with each other using http
request API set by the component.
