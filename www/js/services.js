angular.module('starter.services', ['ngStorage'])

.service('StorageService', function($localStorage) {

var data = $localStorage.$default({
    email: "",
    password: ""
});

var _getData = function () {
  return data;
};

var _getEmail = function () {
  return $localStorage.email;
};

var _setData = function (e,p) {
  $localStorage.email = e;
  $localStorage.password = p;
};

var _delData = function(){
  localStorage.clear();
  $localStorage.$reset({
    email: "",
    password: ""
  });
  $localStorage.email = "";
  $localStorage.password = "";
};

return {
    getData: _getData,
    setData: _setData,
    delData: _delData,
    getEmail: _getEmail
  };

  
})

.service('SearchService', function($http) {

var searchResults = {};

var fromDateTime = "";

var toDateTime = "";

var _search = function (searchdata) {
  return $http.post('http://193.196.175.194/php/search.php/', searchdata);
};

var _setSearchResults = function(searchres){
  searchResults = searchres;
};

var _clearFromDateTime = function(f){
  fromDateTime = "";
};

var _clearToDateTime = function(t){
  toDateTime = "";
};

var _setFromDateTime = function(f){
  fromDateTime = f;
};

var _setToDateTime = function(t){
  toDateTime = t;
};

var _getFromDateTime = function(){
  return fromDateTime;
};

var _getToDateTime = function(){
  return toDateTime;
};

var _getSearchResults = function () {
  return searchResults;
};

var _clearSearchResults = function(){
  searchResults = {};
};




return {
    search: _search,
    getSearchResults: _getSearchResults,
    setSearchResults: _setSearchResults,
    clearSearchResults: _clearSearchResults,
    setToDateTime: _setToDateTime,
    setFromDateTime: _setFromDateTime,
    getToDateTime: _getToDateTime,
    getFromDateTime: _getFromDateTime,
    clearFromDateTime: _clearFromDateTime,
    clearToDateTime: _clearToDateTime
  };

  
})

.service('CheckUserService', function($localStorage, $http) {

  return {
      checkUser: function(){ 

        return $http.post('http://193.196.175.194/php/checkUser.php/', $localStorage);
        
      }
  };

  
});
