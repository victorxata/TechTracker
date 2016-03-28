/**
 * Created by victorzaragoza on 24/03/2016.
 */
'use strict';
angular.module('txAdmin.Accounts', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('accounts', {
                url: '/accounts',
                parent:'authenticated',
                templateUrl: '_accounts.html',
                controller: 'accountsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('accountDetails',{
                url: '/accounts/:id',
                parent:'authenticated',
                templateUrl: '_accountDetails.html',
                controller: 'accountDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;