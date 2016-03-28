'use strict';
angular.module('txAdmin.Models.User', [])
    .factory('User', function(DS){
        var User = DS.defineResource('user');

        return User;
    });
