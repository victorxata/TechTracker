/**
 * Created by victorzaragoza on 08/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.UserDetails', [])
        .controller('userDetailsCtrl', UserDetailsController);

    UserDetailsController.$inject = ['$scope', 'usersService', '$stateParams', '$window', '$timeout', '$rootScope', 'rolesService', 'ngDialog', 'toastr', 'fieldsFilterService', 'alertService', 'securablePropertiesService'];

    function UserDetailsController($scope, usersService, $stateParams, $window, $timeout, $rootScope, rolesService, ngDialog, toastr, fieldsFilterService, alertService, securablePropertiesService) {

        var vm = this;

        $scope.error = false;

        $rootScope.$on('refreshData', goBack);

        $rootScope.$on('loadData', loadData);

        function goBack(){
            $state.go('users');
        }

        vm.user = null;

        vm.roles = null;
        vm.endpoints = null;
        vm.allRoles = null;
        vm.allPermissions = null;
        vm.allSecurableProperties = null;
        vm.allProperties = [];
        vm.sp = null;
        vm.permissions = null;

        vm.id = $stateParams.id;
        vm.password = '';
        vm.confirmPassword = '';

        vm.editName = false;
        vm.editEmail = false;
        vm.editPassword = false;

        refresh();

        vm.setProperties = function(){
            vm.selectedProperty.class = vm.sp.typeName;

            vm.allProperties = vm.sp.properties;
        };

        vm.isSuperUser = function(){
            if (vm.user){
                var result = false;
                angular.forEach(vm.user.roles, function(value){
                    if (value === 'Admin'){
                        result = true;
                    }
                });
                return result;
            }
        };

        vm.setToSuper = function(){
            if (vm.user){
                usersService.setUserSuper(vm.user.id)
                    .success(function(response){
                        console.log(response);
                        vm.user = response;
                    })
                    .error(function(response){
                        refresh();
                        toastr.error(response);
                        console.log(response);
                    })            }
        };

        vm.setToNormal = function(){
            if (vm.user){
                usersService.setUserNormal(vm.user.id)
                    .success(function(response){
                        console.log(response);
                        vm.user = response;
                    })
                    .error(function(response){
                        refresh();
                        toastr.error(response);
                        console.log(response);
                    })
            }
        };

        vm.editNameFunc = function(){
            vm.editName = true;
            vm.editEmail = false;
            vm.editPassword = false;
            var element = $window.document.getElementById('editNameInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editEmailFunc = function(){
            vm.editName = false;
            vm.editEmail = true;
            vm.editPassword = false;
            var element = $window.document.getElementById('editEmailInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editPasswordFunc = function(){
            vm.editName = false;
            vm.editEmail = false;
            vm.editPassword = true;
            setFocus('editPasswordInput');
        };

        vm.editNameSave = function(){
            usersService.saveUser(vm.user);
            vm.editName = false;
        };

        vm.editEmailSave = function(){
            usersService.saveUser(vm.user);
            vm.editEmail = false;
        };

        vm.editNameCancel = function(){
            vm.editName = false;
            refresh();
        };

        vm.editEmailCancel = function(){
            vm.editEmail = false;
            refresh();
        };

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                if (editor === 'name'){
                    vm.editNameSave();
                }
                if (editor === 'email'){
                    vm.editEmailSave();
                }
                if (editor === 'password'){
                    setFocus('editConfirmPasswordInput');
                }
                if (editor === 'confirmPassword'){
                    vm.savePassword();
                    vm.editPassword = false;
                }
            }
            if (event.keyCode === 27){
                if (editor === 'name'){
                    vm.editNameCancel();
                }
                if (editor === 'email'){
                    vm.editEmailCancel();
                }
                if (editor === 'password'){
                    vm.editPassword = false;
                }
                if (editor === 'confirmPassword'){
                    vm.editPassword = false;
                }
            }
            if (event.keyCode === 9){
                if (editor === 'name'){
                    vm.editNameSave();
                    vm.editEmailFunc();
                }
                if (editor === 'email'){
                    vm.editEmailSave();
                }
                if (editor === 'password'){
                    setFocus('editConfirmPasswordInput');
                }
                if (editor === 'confirmPassword'){
                    setFocus('savePasswordButton');
                }
            }

        };

        vm.savePassword = function(){
            usersService.changePassword(vm.id, {userName: vm.user.realName, token: 'xxx', password: vm.password, confirmPassword: vm.confirmPassword})
                .success(function(response){
                    refresh();
                    console.log(response);
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
            })
        };

        vm.deleteRole = function(roleId){
            rolesService.removeUserFromRole(vm.id, roleId)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
                });
        };

        vm.addRole = function() {
            ngDialog.open({
                template: 'item.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                showClose: false
            });
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
                userName : vm.user.userName,
                className: vm.selectedProperty.class,
                propertyName: vm.selectedProperty.property,
                action: vm.selectedProperty.action,
                substitutionText: vm.selectedProperty.substitutionText
            };
            fieldsFilterService.addFieldsFilter(ff)
                .success(function(){
                    alertService.success('Added field filter attached to the user');
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                });
        };

        vm.updateFieldFilterItem = function(){
            var ff = {
                id: vm.selectedProperty.id,
                userName : vm.user.userName,
                className: vm.selectedProperty.class,
                propertyName: vm.selectedProperty.property,
                action: vm.selectedProperty.action,
                substitutionText: vm.selectedProperty.substitutionText
            };
            fieldsFilterService.saveFieldsFilter(ff)
                .success(function(){
                    alertService.success('Updated field filter attached to the user');
                    refresh();
                })
                .error(function(response){
                    alertService.error(response);
                });
        };

        vm.toggleOption = function(option) {

            vm.roles.push(option);
            console.log('adding user to role');
            console.log(option);
            rolesService.addUserToRole(vm.id, option)
                .success(function(response){
                    console.log(response);
                    refresh();
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
                });
        };

        vm.toggleOptionFp = function(option) {


        };

        vm.addItem = function(role) {

            vm.roles.push(role);
            ngDialog.close();
            console.log(vm.roles);
        };

        vm.cancel = function() {
            ngDialog.close();
        };

        function removeUsedRoles(){
            var originList = vm.allRoles;
            var itemsToSearch = vm.roles;
            vm.allRoles = [];
            angular.forEach(originList, function(role){
                var match = itemsToSearch.reduce(function(prev, curr) {
                    return (role.id === curr.id) || prev;
                }, false);

                if (!match) vm.allRoles.push(role);
            });
        }

        function addUsedPermissions(){
            var originList = vm.allPermissions;
            var itemToSearch = [vm.user.userName];
            vm.allPermissions = [];
            vm.permissions = [];
            angular.forEach(originList, function(permission){
                var match = itemToSearch.reduce(function(prev, curr) {
                    return (permission.userName === curr) || prev;
                }, false);

                if (match) {
                    vm.permissions.push(permission);
                }
            });
        }

        function setFocus(pageElement){
            var element = $window.document.getElementById(pageElement);

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        }

        function loadData(){
            refresh();
        }

        function refresh(){
            vm.selectedProperty = {class:null, property:null, action:null, substitutionText: null};
            usersService.getUser(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.user = response;
                    vm.password = "";
                    vm.confirmPassword = "";
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
                });
            rolesService.getUserRoles(vm.id)
                .success(function(response){
                    console.log(response);
                    vm.roles = response;

                    rolesService.getRoles()
                        .success(function(response){
                        console.log('All Roles: ' + response);
                        vm.allRoles = response;
                        removeUsedRoles();
                        })
                        .error(function(response){
                            refresh();
                            alertService.error(response);
                        });
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
                });
            fieldsFilterService.getFieldsFilters()
                .success(function(response){
                    console.log('Get FieldsFilter:', response);
                    vm.allPermissions = response;
                    addUsedPermissions();
                })
                .error(function(response){
                    alertService.error(response);
                });
            securablePropertiesService.getSecurableProperties()
                .success(function(response){
                    console.log('Securable Properties: ', response);
                    vm.allSecurableProperties = response;
                })
        }
    }
}());