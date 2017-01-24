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

  $scope.emailTest = function(){
      $http.post('http://193.196.175.194/emailtest.php/').success(function (response){
        console.log("HTTP GET: " + response);
      });
   };

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
  $scope.wrongVerifyCode = function() {
         var wrongVerifyPopup = $ionicPopup.alert({
           title: 'Falscher Bestätigungscode',
           template: 'Bitte versuchen Sie es erneut'
         })};
  $scope.correctVerifyCode = function() {
         var correctVerifyPopup = $ionicPopup.alert({
           title: 'Erfolg',
           template: 'Sie können sich nun einloggen'
         })};
  $scope.failedLoginVerify = function(emailadress) {
         $scope.verifyData = {};
         $scope.verifyData.email = emailadress;

        var verifyPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="verifyData.verifycode">',
          title: 'Bestätigungscode eingeben',
          scope: $scope,
          buttons: [
            {
              text: '<b>Bestätigen</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.verifyData.verifycode) {
                  
                  e.preventDefault();
                } else {
                    $http.post('http://193.196.175.194/checkVerifyCode.php/', $scope.verifyData).success(function (data,status){
                      console.log('HTTP: ' + status + data);
                      if(data == 1){
                        $scope.correctVerifyCode();
                        verifyPopup.close();
                      }
                      else{
                        $scope.wrongVerifyCode();

                      }
                    });


                  }
                }
            },
            { text: '<b>Abbrechen</b>',
              type: 'button-dark',
              onTap: function(){
                verifyPopup.close();
              }  
            }
          ]
        });
  }
  
  $scope.successfulLogin = function(name) {
         var failedLoginPopup = $ionicPopup.alert({
           title: 'Erfolgreich angemeldet!',
           template: '<p align="center">Willkommen ' + name + '</p>'
         })};

  $scope.doLogin = function(){
    
    $http.post('http://193.196.175.194/login.php/', $scope.loginData).success(function (data,status){
      console.log("HTTP POST: " + status + data);
      
      if(data.verified == 1 && status == 200){
        $scope.successfulLogin(data.vname.VNAME);
        $state.go('app.searchroom');
      }
      else if(data.verified == 0) {
        $scope.failedLogin();
      }
      else if(data.verified == 2){
        $scope.failedLoginVerify(data.email);
      }
    });

   /* $state.go('app.searchroom');
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });*/
  };

})
.controller('RegistrationCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $ionicPopup, $http) {

  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  //Variabeln

  $scope.regData = {};

  //Funktionen

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
       title: 'Account erstellt!',
       template: 'Ein Bestätigungscode wurden Ihnen per Mail gesendet'
     });

     successPopup.then(function(res) {
       $scope.toLogin();
     });
   };

   $scope.showFail = function() {
     var successPopup = $ionicPopup.alert({
       title: 'Fehlgeschlagen!',
       template: 'Bitte alle Felder ausfüllen'
     });
   };

   $scope.createAccount = function(){

      $http.post('http://193.196.175.194/createAccount.php/', $scope.regData).success(function (data,status){
      console.log("HTTP POST: " + status + data);
      if(data == 1){
        $scope.showSuccess();
      }
      else{
        $scope.showFail();
      }
      
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
