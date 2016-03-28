'use strict';
angular.module('txAdmin.Login')
    .controller('loginCtrl', function($scope, $state, Authentication, apiListService){
        $scope.error = false;

        $scope.login = function(){
            Authentication.login($scope.username, $scope.password).then(
                function(){
                    $scope.error = false;
                    $state.go('home');
                },
                function(){
                    $scope.error = true;
                }
            );
        };

        $scope.apis = apiListService.getApis();

        $scope.selectedApi = $scope.apis[0];

        $scope.changeApi = function(){
            apiListService.setApiDefault($scope.selectedApi.name);
        }
    });