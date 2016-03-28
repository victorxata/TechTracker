/**
 * Created by victorzaragoza on 07/07/2015.
 */
'use strict';
angular.module('txAdmin.Users', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('users', {
                url: '/users',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    "":{
                        templateUrl: '_users.html',
                        controller: 'usersCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('userDetails',{
                url: '/users/:id',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    "":{
                        templateUrl: '_userDetails.html',
                        controller: 'userDetailsCtrl',
                        controllerAs: 'vm'
                    }
                }
            });
    })
;