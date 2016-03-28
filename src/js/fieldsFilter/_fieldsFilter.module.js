/**
 * Created by victorzaragoza on 07/07/2015.
 */
'use strict';
angular.module('txAdmin.FieldsFilter', ['ui.router'])
    .config(function($stateProvider){
        $stateProvider
            .state('fieldsFilter', {
                url: '/fieldsFilter',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    '':{
                        templateUrl: '_fieldsFilter.html',
                        controller: 'fieldsFilterCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('fieldsFilterDetails',{
                url: '/fieldsFilter/:id',
                parent:'authenticated',
                resolve: {
                },
                views:{
                    '':{
                        templateUrl: '_fieldsFilterDetails.html',
                        controller: 'fieldsFilterDetailsCtrl',
                        controllerAs: 'vm'
                    }
                }
            });
    })
;