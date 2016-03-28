'use strict';
angular.module('txAdmin.Authentication', ['ui.router', 'txAdmin.Models.User', 'txAdmin.services.Authentication'])
    .config(function($stateProvider){
        $stateProvider.state('authenticated', {
            abstract: true,
            views:{
              header: {
                  templateUrl: '_header.html',
                  controller: 'headerCtrl'
              },
              '': {
                  templateUrl: '_authenticated.html'
              }
            },
            resolve: {
                user: function(Authentication, User, $state, $q){
                    return Authentication.checkCredentials().then(
                        function(userData){
                            return User.inject(userData);
                        },
                        function(){
                            return $q.reject($state.go('login'));
                        }
                    );
                }
            }
        });
    });