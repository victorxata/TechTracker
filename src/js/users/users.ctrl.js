/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Users')
        .controller('usersCtrl', UsersController);

    UsersController.$inject = ['$scope', 'usersService', '$rootScope'];

    function UsersController($scope, usersService, $rootScope) {

        var vm = this;

        $scope.error = false;

        $rootScope.$on('refreshData', refresh);

        vm.users = null;

        vm.open = false;

        vm.search = '';

        refresh();

        function refresh() {
            usersService.getUsers()
                .success(function (response) {
                    console.log(response);
                    vm.users = response
                });
        }

        vm.isSuperUser = function (roles) {
            var result = false;
            angular.forEach(roles, function (value) {
                if (value === 'Admin') {
                    result = true;
                }
            });
            return result;
        };
    }
}());