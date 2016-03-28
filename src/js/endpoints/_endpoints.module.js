/**
 * Created by victorzaragoza on 07/07/2015.
 */
'use strict';
angular.module('txAdmin.Endpoints', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('endpoints', {
                url: '/endpoints',
                parent:'authenticated',
                templateUrl: '_endpoints.html',
                controller: 'endpointsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('endpointDetails',{
                url: '/endpoints/:id',
                parent:'authenticated',
                templateUrl: '_endpointDetails.html',
                controller: 'endpointDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;