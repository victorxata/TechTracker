'use strict';
angular.module('txAdmin.Authentication')
    .controller('headerCtrl', function($scope, user){
        $scope.user = user;


    });