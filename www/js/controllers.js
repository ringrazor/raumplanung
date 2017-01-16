angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicHistory) {

  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  $scope.doLogout = function(){
    $state.go('login');
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $http, $ionicPopup) {

  $scope.loginData = {};

  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  $scope.inputType = "password";
  
  $scope.hideShowPassword = function(){
    if ($scope.inputType == 'password')
      $scope.inputType = 'text';
    else
      $scope.inputType = 'password';
  };

  $scope.forgotPassword = function(){
    $state.go('pwreset');
  };

  $scope.toRegistration = function(){
    $state.go('registration');
  };

  $scope.failedLogin = function() {
         var failedLoginPopup = $ionicPopup.alert({
           title: 'Fehlgeschlagen!',
           template: 'Benutzername oder Passwort falsch'
         })};

  $http.get('http://localhost/MemoRandomBackend/getContactdata.php/').then(function (response) {
    console.log(response);
    $scope.data = response.data;

  });

  $scope.doLogin = function(){

    $http.post('http://localhost/MemoRandomBackend/setContactdata.php', $scope.loginData).success(function (data,status){
      console.log("HTTP POST: " + status + data);

      if(data == 1){
        $state.go('app.searchroom');
      }
      else {
        $scope.failedLogin();
      }
    });

   /* $state.go('app.searchroom');
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });*/
  };

})
.controller('RegistrationCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $ionicPopup) {

  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  $scope.toLogin = function(){
      $state.go('login');
   };

  $scope.inputType = "password";
  
  $scope.hideShowPassword = function(){
    if ($scope.inputType == 'password')
      $scope.inputType = 'text';
    else
      $scope.inputType = 'password';
  };

  $scope.showSuccess = function() {
     var successPopup = $ionicPopup.alert({
       title: 'Erfolg!',
       template: 'Ihr Account wurde erfolgreicherstellt'
     });

     successPopup.then(function(res) {
       $scope.toLogin();
     });
   };

   $scope.newAccount = function(){
      $scope.showSuccess();
   };

   

})


.controller('PasswordResetCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $ionicPopup) {
  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  $scope.toLogin = function(){
      $state.go('login');
   };

  $scope.showSuccess = function() {
   var successPopup = $ionicPopup.alert({
     title: 'Passwort zurückgesetzt!',
     template: 'Ihnen wurde eine Email mit ihrem neuen Passwort an die angegebene Email-Adresse gesendet'
   });

   successPopup.then(function(res) {
     $scope.toLogin();
   });
 };


  $scope.resetPassword = function(){
    $scope.showSuccess();
  };
})
.controller('SearchRoomCtrl', function($scope, $state) {
  
  $scope.searchRoom = function(){
    $state.go('app.roomsearchresult');
  };

})

.controller('RoomSearchResultCtrl', function($scope, $stateParams) {
})
.controller('RoomDetailCtrl', function($scope, $ionicPopup, $ionicModal) {


  $scope.book = function() {
     $ionicModal.fromTemplateUrl('templates/book.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
  };

  $scope.bookSuccess = function() {
   var successPopup = $ionicPopup.alert({
     title: 'Erfolg!',
     template: 'Die Räumlichkeiten wurden gebucht'
   });

   successPopup.then(function(res) {
     $scope.modal.remove();
   });
 };

  $scope.bookSubmit = function(){
    $scope.bookSuccess();
  };

})

.controller('ProfileCtrl', function($scope, $ionicModal, $ionicPopup) {

  $scope.validatePassword = function() {
  $scope.data = {};


  var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.password">',
    title: 'Aktuelles Passwort eingeben',
    scope: $scope,
    buttons: [
      {
        text: '<b>Bestätigen</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.password) {
            
            e.preventDefault();
          } else {
            $scope.editProfile();
          }
        }
      },
      { text: '<b>Abbrechen</b>',
        type: 'button-dark',
        onTap: function(){
          myPopup.close();
        }  
      }
    ]
  });
 };

  $scope.editProfile = function() {
     $ionicModal.fromTemplateUrl('templates/editprofile.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
  };


})

.controller('MyBookingsCtrl', function($scope, $stateParams) {
});
