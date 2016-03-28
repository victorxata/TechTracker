/**
 * Created by victorzaragoza on 07/07/2015.
 */
'use strict';
angular.module('txAdmin.Roles', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('roles', {
                url: '/roles',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    '':{
                        templateUrl: '_roles.html',
                        controller: 'rolesCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('roleDetails',{
                url: '/roles/:id',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    '':{
                        templateUrl: '_roleDetails.html',
                        controller: 'roleDetailsCtrl',
                        controllerAs: 'vm'
                    }
                }
            });
    })
;