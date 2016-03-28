/**
 * Created by victorzaragoza on 07/07/2015.
 */
'use strict';
angular.module('txAdmin.SecurableProperties', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('securableProperties', {
                url: '/securableProperties',
                parent:'authenticated',
                templateUrl: '_securableProperties.html',
                controller: 'securablePropertiesCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('securablePropertiesDetails',{
                url: '/securableProperties/:id',
                parent:'authenticated',
                templateUrl: '_securablePropertiesDetails.html',
                controller: 'securablePropertiesDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;