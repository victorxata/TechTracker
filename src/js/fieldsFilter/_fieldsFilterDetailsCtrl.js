/**
 * Created by victorzaragoza on 08/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.fieldFiltersDetails', [])
        .controller('fieldsFilterDetailsCtrl', FieldFiltersDetailsController);

    FieldFiltersDetailsController.$inject = ['$scope', '$rootScope', 'fieldsFilterService', '$stateParams', 'alertService', 'rolesService', 'usersService', 'securablePropertiesService', '$state'];

    function FieldFiltersDetailsController($scope, $rootScope, fieldsFilterService, $stateParams, alertService, rolesService, usersService, securablePropertiesService, $state) {

        var vm = this;
        vm.fieldFilter = null;

        $scope.error = false;

        $rootScope.$on('refreshData', goBack);

        function goBack(){
            $state.go('fieldsFilter');
        }

        vm.id = $stateParams.id;

        vm.roles = null;

        vm.users = null;

        vm.classes = null;

        vm.selectedClass = null;

        vm.selectedUser = null;

        vm.selectedRole = null;

        vm.selectedAction = 0;

        vm.selectedProperty = null;

        vm.properties = [];

        vm.changeClass = function(){
            console.log('Selected class: ', vm.selectedClass);
            vm.properties = [];
            vm.selectedProperty = null;
            angular.forEach(vm.selectedClass.properties, function(property){
                vm.properties.push(property);
            });
            vm.save();
        };

        vm.save = function(){
            if (vm.selectedClass)
                vm.fieldFilter.className = vm.selectedClass.typeName;
            if (vm.selectedUser)
                vm.fieldFilter.userName = vm.selectedUser.userName;
            if (vm.selectedRole)
                vm.fieldFilter.roleName = vm.selectedRole.name;
            if (vm.selectedAction)
                vm.fieldFilter.action = vm.selectedAction;

            fieldsFilterService.saveFieldsFilter(vm.fieldFilter)
                .success(function(){
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                    console.log(response);
                });
        };

        refresh();

        function refresh(){

            fieldsFilterService.getFieldsFilter(vm.id)
                .success(function (response) {

                    vm.fieldFilter = response;
                    vm.selectedAction = vm.fieldFilter.action;
                    console.log('Filter: ', response);
                    rolesService.getRoles()
                        .success(function(response){
                            vm.roles = response;

                            angular.forEach(vm.roles, function(role){
                                if (vm.fieldFilter.roleName === role.name){

                                    vm.selectedRole = role;
                                }
                            });
                        })
                        .error(function(response){
                            alertService.error(response);
                            console.log(response);
                        });
                    usersService.getUsers()
                        .success(function(response){
                            vm.users = response;

                            angular.forEach(vm.users, function(user){
                                if (vm.fieldFilter.userName === user.userName){

                                    vm.selectedUser = user;
                                }
                            });
                        })
                        .error(function(response){
                            alertService.error(response);
                            console.log(response);
                        });
                    securablePropertiesService.getSecurableProperties()
                        .success(function(response){
                            vm.classes = response;
                            angular.forEach(vm.classes, function(clas){
                                if (vm.fieldFilter.className === clas.typeName){
                                    console.log('Setting selectedClass to: ', clas);
                                    vm.selectedClass = clas;
                                    vm.properties = clas.properties;
                                    vm.selectedProperty = vm.fieldFilter.propertyName;
                                }
                            })
                        })
                        .error(function(response){
                            alertService.error(response);
                            console.log(response);
                        });



                })
                .error(function(response){
                    alertService.error(response);
                    console.log(response);
                });


        }

        vm.deleteFieldFilter = function(){
            fieldsFilterService.deleteFieldsFilter(vm.id)
                .success(function(){
                    alertService.info('Removed field filter with id: ', vm.id);
                    $state.go('fieldsFilter');
                })
        };

        
    }
}());