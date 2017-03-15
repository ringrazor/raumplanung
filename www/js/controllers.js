angular.module('starter.controllers', [])

// MAIN-CONTROLLER, MENUE

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicHistory, $ionicSideMenuDelegate, StorageService) {

  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;

  $scope.doLogout = function(){
    StorageService.delData();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $state.go('login');
  };
})

// LOGIN

.controller('LoginCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $http, $ionicPopup, StorageService) {

  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  //Variabeln

  $scope.loginData = {};

  $scope.inputType = "password";
  
  // Funktionen

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
         });
  };
  $scope.wrongVerifyCode = function() {
         var wrongVerifyPopup = $ionicPopup.alert({
           title: 'Falscher Bestätigungscode',
           template: 'Bitte versuchen Sie es erneut'
         });
  };
  $scope.correctVerifyCode = function() {
         var correctVerifyPopup = $ionicPopup.alert({
           title: 'Erfolg',
           template: 'Sie können sich nun einloggen'
         });
  };
  $scope.successNewPw = function(){
        var successNewPwPopup = $ionicPopup.alert({
           title: 'Passwort geändert',
           template: 'Sie können sich nun einloggen'
         });
  };
  $scope.failedLoginNewPw = function(emailadress){
      $scope.npwData = {};
      $scope.npwData.email = emailadress;

      var npwPopup = $ionicPopup.show({
        template: '<div class="list"><input type="password" ng-model="npwData.newPw" placeholder="Neues Passwort"/></br><input type="password" ng-model="npwData.newPwWh" placeholder="Passwort wiederholen"/></div>',
        title: 'Neues Passwort eingeben',
        scope: $scope,
        buttons: [
          {
            text: '<b>Bestätigen</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.npwData.newPw && !$scope.npwData.newPwWh) {
                e.preventDefault();
              } else {
                  $http.post('http://193.196.175.194/php/newPassword.php/', $scope.npwData).success(function (data,status){
                    console.log('HTTP: ' + status + data);
                    if(data == 1){
                      $scope.successNewPw();
                      npwPopup.close();
                    }
                    else{
                      $scope.wrongNewPw(emailadress);
                    }
                  });
                }
              }
          },
          { text: '<b>Abbrechen</b>',
            type: 'button-dark',
            onTap: function(){
              npwPopup.close();
            }  
          }
        ]
      });
  };
  $scope.wrongNewPw = function(emailadress){
    var wrongNewPwPopup = $ionicPopup.alert({
           title: 'Fehlgeschlagen!',
           template: 'Eingaben stimmen nicht überein'
         });
    wrongNewPwPopup.then(function(res) {
       $scope.failedLoginNewPw(emailadress);
     });

  };
  $scope.failedLoginVerify = function(emailadress) {
         $scope.verifyData = {};
         $scope.verifyData.email = emailadress;

        var verifyPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="verifyData.verifycode"/>',
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
                    $http.post('http://193.196.175.194/php/checkVerifyCode.php/', $scope.verifyData).success(function (data,status){
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
  };
  
  $scope.successfulLogin = function(name) {
         var failedLoginPopup = $ionicPopup.alert({
           title: 'Erfolgreich angemeldet!',
           template: '<p align="center">Willkommen ' + name + '</p>'
         })
  };

  $scope.doLogin = function(){

    StorageService.delData();
    StorageService.setData($scope.loginData.email, $scope.loginData.password);
    
    $http.post('http://193.196.175.194/php/login.php/', $scope.loginData).success(function (data,status){
      console.log("HTTP POST: " + status + data);
      
      if(data.verified == 1 && status == 200){
        $scope.loginData = {};
        $scope.successfulLogin(data.vname.VNAME);
        $state.go('app.searchroom');
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
      }
      else if(data.verified == 0) {
        $scope.failedLogin();
      }
      else if(data.verified == 2){
        $scope.failedLoginVerify(data.email);
      }
      else if(data.verified == 3){
        $scope.failedLoginNewPw(data.email);
      }
    });
  };

})

// REGISTRIERUNG

.controller('RegistrationCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $ionicPopup, $http, $filter, $cordovaDatePicker) {

  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  //1. Variabeln

    //1.0 Inputdaten des Registrationsformulars
    $scope.regData = {};

    //1.1 Optionen für den Datepicker
    var optionsBday = {
      date: new Date(),
      mode: 'date',
      doneButtonLabel: 'DONE',
      doneButtonColor: '#000000',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    //1.2 Variable für DatePicker
    $scope.bDay = "";

  //2. Funktionen

    //2.0 Zurück zum Login-View
    $scope.toLogin = function(){
        $state.go('login');
     };

    //2.1 Passwort anzeigen/verstecken
    $scope.inputType = "password";
    
    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password'){
        $scope.inputType = 'text';
      }
      else 
      {
        $scope.inputType = 'password';
      }
    };

    //2.2 Accounterstellung erfolgreich Popup
    $scope.showSuccess = function() {
      var successPopup = $ionicPopup.alert({
        title: 'Account erstellt!',
        template: 'Ein Bestätigungscode wurden Ihnen per Mail gesendet'
      });

      successPopup.then(function(res) {
        $scope.toLogin();
      });
    };

    //2.3 Accounterstellung nicht erfolgreich Popup
    $scope.showFail = function() {
      var successPopup = $ionicPopup.alert({
        title: 'Fehlgeschlagen!',
        template: 'Bitte alle Felder ausfüllen'
      });
    };

    //2.4 Passwortwiederholungscheck Popup
    $scope.showErrorPw = function() {
      var successPopup = $ionicPopup.alert({
        title: 'Fehler!',
        template: 'Passwörter ungleich'
     });
    };

    //2.5 Email-Validations Popup
    $scope.showErrorMail = function() {
     var successPopup = $ionicPopup.alert({
       title: 'Fehler!',
       template: 'Bitte gültige Emailadresse angeben'
     });
    };

    //2.6 Datepicker
    $scope.showDatePickerBday = function() {
        $cordovaDatePicker.show(optionsBday).then(function (date) {
            $scope.bDay = $filter('date')(date,'dd.MM.yyyy');
            $scope.regData.gebdat = $scope.bDay;
        });
    };

    //2.7 Accounterstellung
    $scope.createAccount = function(){
      if($scope.regData.password != $scope.regData.passwordrepeat){
        $scope.showErrorPw();
      }
      else if (!($scope.regData.email) || !($scope.regData.email.includes('@')) || !($scope.regData.email.includes('.'))){
        $scope.showErrorMail();
      }
      else
      {
        $http.post('http://193.196.175.194/php/createAccount.php/', $scope.regData).success(function (data,status){
          console.log("HTTP POST: " + status + data);
          if(data == 1){
            $scope.showSuccess();
          }
          else{
            $scope.showFail();
          }
        });
      }
    };
})

// PASSWORT ZURÜCKSETZEN
.controller('PasswordResetCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $ionicPopup, $http) {
  
  $ionicSideMenuDelegate.canDragContent(false);
  $ionicHistory.nextViewOptions({
    disableBack: true,
    historyRoot: true
  });

  //Variabeln

  $scope.resetData = {};

  //Funktionen

  $scope.toLogin = function(){
      $state.go('login');
   };

  $scope.showFail = function() {
   var failPopup = $ionicPopup.alert({
     title: 'Fehlgeschlagen!',
     template: 'Kein Konto mit eingegebener Email-Adresse vorhanden'
   });
  };

  $scope.showError = function() {
   var errorPopup = $ionicPopup.alert({
     title: 'Fehler!',
     template: 'Bitte gültige Emailadresse angeben'
   });
  };

  $scope.showSuccess = function() {
   var successPopup = $ionicPopup.alert({
     title: 'Passwort zurückgesetzt!',
     template: 'Ihnen wurde eine Email mit ihrem neuen Passwort an die angegebene Email-Adresse gesendet'
   });

   successPopup.then(function(res) {
      $scope.resetData = {};
      $scope.toLogin();
   });
  };


  $scope.resetPassword = function(){

    if(!$scope.pwReset.$valid){
      $scope.showError();
    }
    else
    {
      $http.post('http://193.196.175.194/php/resetPassword.php/', $scope.resetData).success(function (data,status){
        console.log("HTTP POST: " + status + data);
        if(data == 1){
          $scope.showSuccess();
        }
        else{
          $scope.showFail();
        };
        
      });
    }
  };

})

// RAUMSUCHE

.controller('SearchRoomCtrl', function($scope, $state, $ionicHistory, $ionicModal, $ionicPopup, $filter, $cordovaDatePicker, CheckUserService, SearchService) {
  
  //Validation des Zugriffs
  $scope.$on('$ionicView.beforeEnter', function(){
    CheckUserService.checkUser().success(function(data,status){
      if(!(data.checkSessful == 1 && status == 200)){
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('errorPage');
      }
    }); 
  });

  $scope.searchData = {};
  $scope.dateFrom = "";
  $scope.dateTo = "";

  var options = {
        date: new Date(),
        mode: 'datetime', // or 'time'
        minDate: new Date() - 10000,
        allowOldDates: false,
        allowFutureDates: true,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#000000',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000',
        is24Hour: true
    };

    $scope.showDatePickerFrom = function() {
        $cordovaDatePicker.show(options).then(function (date) {
            $scope.dateFrom = $filter('date')(date,'dd.MM.yyyy HH:mm:ss');
            $scope.searchData.from = $scope.dateFrom;
        });
    };

    $scope.showDatePickerTo = function() {
        $cordovaDatePicker.show(options).then(function (date) {
            $scope.dateTo = $filter('date')(date,'dd.MM.yyyy HH:mm:ss');
            $scope.searchData.to = $scope.dateTo;
        });
    };

    $scope.newSearch = function(){
      SearchService.clearSearchResults();
    };

    $scope.searchRoom = function(data){
      SearchService.setFromDateTime($scope.searchData.from);
      SearchService.setToDateTime($scope.searchData.to);
      SearchService.search(data).success(function(data,status){
        if(status == 200){
          console.log(data + status);
          SearchService.setSearchResults(data);
          $state.go('app.roomsearchresult');
        }
        else
        {
          alert("Fehler!");
        }
      });
    };

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.searchData = {};
    $scope.dateFrom = "";
    $scope.dateTo = "";
  });



})

// RAUM-SUCHERGEBNISSE
.controller('RoomSearchResultCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $http, CheckUserService, StorageService, SearchService) {
  
  //Validation des Zugriffs
  $scope.$on('$ionicView.beforeEnter', function(){
    CheckUserService.checkUser().success(function(data,status){
      if(!(data.checkSessful == 1 && status == 200)){
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('errorPage');
      }
    }); 

    $scope.searchRes = SearchService.getSearchResults();

    $scope.fromDt = SearchService.getFromDateTime();

    $scope.toDt = SearchService.getToDateTime();

    $scope.bookData = {};

    $scope.bookData.from = $scope.fromDt;
    $scope.bookData.to = $scope.toDt;

    $scope.bookData.userMail = StorageService.getEmail();

  });



  $scope.showSuccess = function() {
   var successPopup = $ionicPopup.alert({
     title: 'Raum gebucht!',
     template: 'Stornieren unter Meine Buchungen möglich'
   });
   successPopup.then(function(res) {
      $state.go('app.searchroom');
   });
  };

  $scope.showFail = function() {
   var failPopup = $ionicPopup.alert({
     title: 'Fehlgeschlagen!',
     template: 'Bei Ihrer Buchung ist ein Fehler aufgetreten'
   });
  };

  $scope.book = function(bookdata,roomid){
    $scope.bookData.roomId = roomid;
    $http.post('http://193.196.175.194/php/bookRoom.php/', $scope.bookData).success(function(data,status){
      console.log(data + status);
      if(data == 1){
        $scope.showSuccess();
        StorageService.clearToDateTime();
        StorageService.clearFromDateTime();
      }
      else{
        $scope.showFail();
      };
    });
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.searchRes = {};
    $scope.fromDt = "";
    $scope.toDt = "";
    $scope.bookData = {};
    StorageService.clearToDateTime();
    StorageService.clearFromDateTime();
  });
})

// PROFIL
.controller('ProfileCtrl', function($scope, $state, $ionicModal, $ionicPopup, $ionicHistory, $http, StorageService, CheckUserService) {

  //Validation des Zugriffs und Besorgung der Profildaten
  $scope.$on('$ionicView.beforeEnter', function(){
    CheckUserService.checkUser().success(function(data,status){
      if(!(data.checkSessful == 1 && status == 200)){
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('errorPage');
      }
    }); 
    $http.post('http://193.196.175.194/php/getProfileData.php/', StorageService.getData()).success(function(data,status){
      $scope.profileData = data;
    });
  });

  $scope.validatePassword = function(edit) {

    $scope.data = {};
    $scope.edit = edit;

    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.password"></input>',
      title: 'Aktuelles Passwort eingeben',
      scope: $scope,
      buttons: [
        {
          text: '<b>Bestätigen</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.password) { 
              e.preventDefault();
            } 
            else {
              if($scope.data.password == StorageService.getData().password){
                $scope.editProfile($scope.edit);
              }
              else{
                $scope.validatePassword($scope.edit);
              }
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

  $scope.editProfile = function(edit) {
     $ionicModal.fromTemplateUrl('templates/edit_'+ edit +'_profile.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
  };

  $scope.failAlert = function(){
          var failPopup = $ionicPopup.alert({
          title: 'Fehler!',
          template: 'Bitte gültige Emailadresse angeben!'
          });      
        };

  $scope.updateProfile = function(update, fn, ln, e, pw, a, pc, l){

    if(update == 'email'){
      if(!$scope.emailChange.$valid){
        $scope.failAlert();
        $scope.popover.hide();
      };
    };

    $scope.localStorageData = StorageService.getData();

    $scope.postData = StorageService.getData();
    $scope.postData.type = update;
    $scope.postData.email = $scope.localStorageData.email;
    $scope.postData.password = $scope.localStorageData.password;
    $scope.postData.firstname = fn;
    $scope.postData.lastname = ln;
    $scope.postData.emailchange = e;
    $scope.postData.passwordchange = pw;
    $scope.postData.address = a;
    $scope.postData.postcode = pc;
    $scope.postData.location = l;

    $http.post('http://193.196.175.194/php/updateProfileData.php/', $scope.postData).success(function(data,status){
      if(data != 0){
        $state.reload();
      }
      else{

      }
    });
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.profileData = {};
  });

})

// MEINE BUCHUNGEN
.controller('MyBookingsCtrl', function($scope, $state, $stateParams, $ionicHistory,$ionicPopup, $http, CheckUserService, StorageService) {

  //Validation des Zugriffs
  $scope.$on('$ionicView.beforeEnter', function(){
    CheckUserService.checkUser().success(function(data,status){
      if(!(data.checkSessful == 1 && status == 200)){
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('errorPage');
      }
    });

    $scope.getBookingsData = {};
    $scope.getBookingsData.email = StorageService.getEmail();

    $scope.bookings = {};

    $http.post('http://193.196.175.194/php/getBookings.php/', $scope.getBookingsData).success(function(data,status){
      $scope.bookings = data;
    });
  });

  $scope.bid = "";
  $scope.delBook = {};

  $scope.showDelConfirm = function(bid) {
    $scope.bid = bid;
   var confirmPopup = $ionicPopup.confirm({
        title: 'Buchung löschen?',
        template: 'Bitte bestätigen',
        cancelText: 'Nein',
        okText: 'Ja'
    }).then(function(res) {
        if (res) {
          $scope.delBooking();
        }
        else
        {
          confirmPopup.close();
        }
    });
  };

  $scope.delBooking = function(){
    $scope.delBook.bid = $scope.bid;
    $http.post('http://193.196.175.194/php/delBooking.php/', $scope.delBook).success(function(){
      $scope.bid = "";
      $scope.delBook = {};
      $state.reload();
    });
  };

});
