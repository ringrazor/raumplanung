// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.text('').previousTitleText(false);

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login', 
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })  

  .state('registration', {
    url: '/registration', 
    templateUrl: 'templates/registration.html',
    controller: 'RegistrationCtrl'
  })

  .state('pwreset', {
    url: '/passwordreset',
    templateUrl: 'templates/passwordreset.html',
    controller: 'PasswordResetCtrl'
  })

  .state('app.searchroom', {
      url: '/searchroom',
      views: {
        'menuContent': {
          templateUrl: 'templates/searchroom.html',
          controller: 'SearchRoomCtrl'
        }
      }
    })

  .state('app.roomsearchresult', {
    url: '/roomsearchresult',
    views: {
      'menuContent': {
        templateUrl: 'templates/roomsearchresult.html',
        controller: 'RoomSearchResultCtrl'
      }
    }
  })

  .state('app.roomdetail', {
      url: '/roomdetail',
      views: {
        'menuContent': {
          templateUrl: 'templates/roomdetail.html',
          controller: 'RoomDetailCtrl'
        }
      }
    })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

  .state('app.mybookings', {
      url: '/mybookings',
      views: {
        'menuContent': {
          templateUrl: 'templates/mybookings.html',
          controller: 'MyBookingsCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
