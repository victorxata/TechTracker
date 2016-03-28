/**
 * Created by victorzaragoza on 24/03/2016.
 */
'use strict';
angular.module('txAdmin.Candidates', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('candidates', {
                url: '/candidates',
                parent:'authenticated',
                templateUrl: '_candidates.html',
                controller: 'candidatesCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('candidateDetails',{
                url: '/candidates/:id',
                parent:'authenticated',
                templateUrl: '_candidatesDetails.html',
                controller: 'candidateDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;