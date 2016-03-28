/**
 * Created by victorzaragoza on 24/03/2016.
 */
'use strict';
angular.module('txAdmin.Opportunities', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('opportunities', {
                url: '/opportunities',
                parent:'authenticated',
                templateUrl: '_opportunities.html',
                controller: 'opportunitiesCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            })
            .state('opportunityDetails',{
                url: '/opportunities/:id',
                parent:'authenticated',
                templateUrl: '_opportunitiesDetails.html',
                controller: 'opportunityDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                }
            });
    })
;