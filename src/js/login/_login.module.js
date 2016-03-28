'use strict';
angular.module('txAdmin.Login', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '_login.html',
                controller: 'loginCtrl',
                resolve: {
                    /*user: function(User, $q, $state){
                        return User.checkCredentials().then(
                            function(){
                                return $q.reject($state.go('home'));
                            }, function(){
                                return null;
                            }
                        );
                    },*/
                }
            })
            .state('logout', {
                url: '/logout',
                onEnter: function(Authentication, $state){
                    Authentication.logout().then(function(){
                        $state.go('login');
                    });
                }
            });
    })
;