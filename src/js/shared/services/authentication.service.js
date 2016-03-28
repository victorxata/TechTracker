'use strict';
angular.module('txAdmin.services.Authentication', ['txAdmin.Models.User'])
    .factory('Authentication', function($q, $injector, DS, User){

        var _getTokenCached = function(){
            var token = localStorage.getItem('token');
            return token;
        };

        var _setToken = function(token){
            localStorage.setItem('token', token);
            _token = token;
        };

        var _setUserData = function(userData){
            localStorage.setItem('user', JSON.stringify(userData));
        };

        var _getUserCached = function(){
            var user;

            try{
                user = JSON.parse(localStorage.getItem('user'));
            }catch(e){
                user = null;
            }
            return user;
        };

        var _token;

        return {
            getToken: function(){
                return _token?_token:_getTokenCached();
            },
            checkCredentials: function(){

                var $http = $injector.get('$http');

                var defer = $q.defer(),
                    _token = _getTokenCached(),
                    _tempUser = _getUserCached();

                if(_token && _tempUser){
                    $http.get(DS.defaults.basePath + '/UserProfile/profile')
                        .success(function(userDetails){
                            User.inject(userDetails);
                        });
                    defer.resolve(_tempUser);
                }else{
                    defer.reject();
                }

                return defer.promise;
            },
            logout: function(){
                var defer = $q.defer();
                _token = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                defer.resolve();
                return defer.promise;
            },
            login: function(username, password){
                var $http = $injector.get('$http');

                var defer = $q.defer();

                $http({method: 'POST',
                    url: DS.defaults.rootPath + '/token',
                    data: 'Username='+username+'&Password='+password+'&grant_type=password',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(token){
                    console.log(token);
                    _setToken(token.access_token);
                    $http.get(DS.defaults.basePath + '/UserProfile/profile')
                        .success(function(userDetails){
                            User.inject(userDetails);
                            _setUserData(userDetails);
                            defer.resolve();
                        });
                }).error(function(error){
                    defer.reject(error);
                });

                return defer.promise;
            }
        };

    });