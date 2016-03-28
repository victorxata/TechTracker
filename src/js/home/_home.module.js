'use strict';
angular.module('txAdmin.Home', [])
.config(function($stateProvider){
    $stateProvider
        .state('home', {
            parent:'authenticated',
            url: '/',
        views:{
            '':{
                templateUrl: '_home.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            },
            'queueManager':{
                template: '../queueManager/_queueManager.html',
                controller: '../queueManager/queueManagerCtrl',
                controllerAs: 'vmq'
           }
        }
        });
});