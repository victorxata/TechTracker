/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Roles')
        .controller('rolesCtrl', RolesController);

    RolesController.$inject = ['$scope', 'rolesService', '$timeout', '$state', 'alertService'];

    function RolesController($scope, rolesService, $timeout, $state, alertService) {

        var vm = this;

        $scope.error = false;

        vm.roles = null;

        vm.search = '';

        vm.open = false;

        $timeout(function(){
            vm.open = true;
        }, 200);

        refresh();

        function refresh() {

                        rolesService.getRoles()
                            .success(function (response) {
                                console.log(response);
                                vm.roles = response;
                            });


        }

        vm.addRole = function(){
            var role = {
                name: 'New Role 1',
                userIds: [],
                PermissionNames: []
            };
            rolesService.addRole(role)
                .success(function(response){
                    alertService.info('Created new Role with Id', response.id);

                    $state.go('roleDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new role', response);
                })
        };


    }
}());