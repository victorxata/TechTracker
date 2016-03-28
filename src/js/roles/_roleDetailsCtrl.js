/**
 * Created by victorzaragoza on 08/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.RoleDetails', [])
        .controller('roleDetailsCtrl', RoleDetailsController);

    RoleDetailsController.$inject = ['$scope', '$rootScope', 'rolesService', '$stateParams', '$window', '$timeout', 'fieldsFilterService', 'alertService', 'endpointsService', 'ngDialog', 'usersService', '$state', 'securablePropertiesService'];

    function RoleDetailsController($scope,      $rootScope,   rolesService,   $stateParams,   $window,   $timeout,   fieldsFilterService,   alertService,   endpointsService,   ngDialog,   usersService,   $state,   securablePropertiesService) {

        var vm = this;
        vm.role = null;

        $scope.error = false;

        $rootScope.$on('refreshData', goBack);

        $rootScope.$on('loadData', loadData);

        function goBack(){
            $state.go('users');
        }

        vm.id = $stateParams.id;

        vm.editName = false;


        vm.searchRole = '';
        vm.searchUser = '';
        vm.searchUsers = '';
        vm.searchEndpoints = '';
        vm.searchPermission = '';

        vm.allEndpoints = null;
        vm.allUsers = null;
        vm.permissions = null;
        vm.allPermissions = null;
        vm.allSecurableProperties = null;

        //refresh();

        vm.editNameFunc = function(){
            vm.editName = true;
            var element = $window.document.getElementById('editNameInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editNameSave = function(){
            vm.role.id = vm.id;
            vm.role.permissions = [];
            vm.role.users = [];
            rolesService.saveRole(vm.role);
            vm.editName = false;
        };

        vm.editNameCancel = function(){
            vm.editName = false;
            rolesService.getRole(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.role = response;
                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        };

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                if (editor === 'name'){
                    vm.editNameSave();
                }
            }
            if (event.keyCode === 27){
                if (editor === 'name'){
                    vm.editNameCancel();
                }
            }
        };

        function loadData(){
            refresh();
        }

        function refresh(){
            vm.selectedProperty = {class:null, property:null, action:null, substitutionText: null};
            rolesService.getRole(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.role = response;
                    endpointsService.getEndpoints()
                        .success(function(response){
                            console.log('All Endpoints: ' , response);
                            vm.allEndpoints = response;
                            removeUsedEndpoints();
                        })
                        .error(function(response){
                            refresh();
                            alertService.error(response);
                            console.log(response);
                        });
                    usersService.getUsers()
                        .success(function(response){
                            console.log('All Users: ' , response);
                            vm.allUsers = response;
                            removeUsedUsers();
                        })
                        .error(function(response){
                            refresh();
                            alertService.error(response);
                            console.log(response);
                        });
                    fieldsFilterService.getFieldsFilters()
                        .success(function(response){
                            console.log('Get FieldsFilter:', response);
                            vm.allPermissions = response;
                            addRolePermissions();
                        })
                        .error(function(response){
                            alertService.error(response);
                        });
                    securablePropertiesService.getSecurableProperties()
                        .success(function(response){
                            console.log('Securable Properties: ', response);
                            vm.allSecurableProperties = response;
                        })

                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        }

        function addRolePermissions(){
            var originList = vm.allPermissions;
            var itemToSearch = [vm.role.name];
            vm.allPermissions = [];
            vm.permissions = [];
            angular.forEach(originList, function(permission){
                var match = itemToSearch.reduce(function(prev, curr) {
                    return (permission.roleName === curr) || prev;
                }, false);

                if (match) {
                    vm.permissions.push(permission);
                }
            });
        }

        function removeUsedUsers(){
            if (vm.role.users){
                var originList = vm.allUsers;
                var itemsToSearch = vm.role.users;
                vm.allUsers = [];
                angular.forEach(originList, function(user){
                    var match = itemsToSearch.reduce(function(prev, curr) {
                        return (user.id === curr.id) || prev;
                    }, false);

                    if (!match) vm.allUsers.push(user);
                });
            }
        }

        function removeUsedEndpoints(){
            if (vm.role.permissions) {
                var originList = vm.allEndpoints;
                var itemsToSearch = vm.role.permissions;
                vm.allEndpoints = [];
                angular.forEach(originList, function (endpoint) {
                    var match = itemsToSearch.reduce(function (prev, curr) {
                        return (endpoint.id === curr.id) || prev;
                    }, false);

                    if (!match) vm.allEndpoints.push(endpoint);
                });
            }
        }

        vm.deleteEndpoint = function(endpointId){
            rolesService.removeEndpointFromRole(endpointId, vm.id)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        };

        vm.addEndpoint = function() {
            ngDialog.open({
                template: 'itemEndpoint.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });
        };

        vm.toggleOptionPermission = function(option) {

            vm.role.permissions.push(option);
            console.log('adding permission to role');
            console.log(option);
            rolesService.addEndpointToRole(option, vm.id)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        };

        vm.addUser = function() {
            ngDialog.open({
                template: 'itemUser.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });
        };

        vm.toggleOptionUser = function(option) {

            vm.role.users.push(option);
            console.log('adding user to role');
            console.log(option);
            rolesService.addUserToRole(option, vm.id)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        };

        vm.deleteUser = function(userId){
            rolesService.removeUserFromRole(userId, vm.id)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    alertService.error(response);
                    console.log(response);
                });
        };

        vm.deleteRole = function(roleId){
            rolesService.deleteRole(roleId)
                .success(function(){
                    alertService.info('Role removed from database. If this role is used in endpoints or users, there might be inconsistencies');
                    $state.go('roles');
                })
        };

        vm.addFieldsFilter = function(){
            vm.ffMode = 'Add';
            ngDialog.open({
                template: 'itemFieldsFilter.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });
        };

        vm.editFieldsFilter = function(per){
            console.log('To Edit: ', per);
            vm.ffMode = 'Update';
            vm.selectedProperty.id = per.id;
            vm.selectedProperty.class = per.className;
            vm.selectedProperty.property = per.propertyName;
            vm.selectedProperty.action = per.action;
            vm.selectedProperty.substitutionText = per.substitutionText;
            console.log('Editing: ', vm.selectedProperty);
            ngDialog.open({
                template: 'itemFieldsFilter.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });
        };

        vm.deleteFieldsFilter = function(id){
            fieldsFilterService.deleteFieldsFilter(id)
                .success(function(){
                    alertService.success('Removed field filter');
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                });
        };

        vm.addFieldFilterItem = function(){
            var ff = {
                roleName : vm.role.name,
                className: vm.selectedProperty.class,
                propertyName: vm.selectedProperty.property,
                action: vm.selectedProperty.action,
                substitutionText: vm.selectedProperty.substitutionText
            };
            fieldsFilterService.addFieldsFilter(ff)
                .success(function(){
                    alertService.success('Added field filter attached to the role');
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                });
        };

        vm.updateFieldFilterItem = function(){
            var ff = {
                id: vm.selectedProperty.id,
                roleName : vm.role.name,
                className: vm.selectedProperty.class,
                propertyName: vm.selectedProperty.property,
                action: vm.selectedProperty.action,
                substitutionText: vm.selectedProperty.substitutionText
            };
            fieldsFilterService.saveFieldsFilter(ff)
                .success(function(){
                    alertService.success('Updated field filter attached to the role');
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                });
        };

        vm.setProperties = function(){
            vm.selectedProperty.class = vm.sp.typeName;

            vm.allProperties = vm.sp.properties;
        };

    }
}());