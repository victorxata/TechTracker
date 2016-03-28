/**
 * Created by victorzaragoza on 24/03/2016.
 */
'use strict';
angular.module('txAdmin.Skills', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('skills', {
                url: '/skills',
                parent:'authenticated',
                templateUrl: '_skills.html',
                controller: 'skillsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('skillDetails',{
                url: '/skills/:id',
                parent:'authenticated',
                templateUrl: '_skillDetails.html',
                controller: 'skillDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;