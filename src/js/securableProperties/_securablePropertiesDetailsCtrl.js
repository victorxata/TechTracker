/**
 * Created by victorzaragoza on 08/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.SecurablePropertiesDetails', [])
        .controller('securablePropertiesDetailsCtrl', SecurablePropertiesDetailsController);

    SecurablePropertiesDetailsController.$inject = ['$scope', 'securablePropertiesService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function SecurablePropertiesDetailsController($scope, securablePropertiesService, $stateParams, $window, $timeout, toastr, $state) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editTypeName = false;

        vm.newProperty = null;

        refresh();

        vm.editTypeNameFunc = function(){
            vm.editTypeName = true;
            var element = $window.document.getElementById('editTypeNameInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editTypeNameSave = function(){
            securablePropertiesService.saveSecurableProperty(vm.securableProperty);
            vm.editTypeName = false;
        };

        vm.editTypeNameCancel = function(){
            vm.editTypeName = false;
            securablePropertiesService.getEndpoint(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.securableProperty = response
                })
                .error(function(response){
                    refresh();
                    toastr.error(response);
                    console.log(response);
                });
        };

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                if (editor === 'typeName'){
                    vm.editTypeNameSave();
                }
            }
            if (event.keyCode === 27){
                if (editor === 'typeName'){
                    vm.editNameCancel();
                }
            }
        };

        vm.deleteSecurableProperty = function(spId){
            securablePropertiesService.deleteSecurableProperty(spId)
                .success(function(){
                    toastr.info('Endpoint removed from database. If this endpoint is used in roles or users, there might be inconsistencies');
                    $state.go('endpoints');
                })
        };

        function refresh(){
            securablePropertiesService.getSecurableProperty(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.securableProperty = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        }

        vm.removeProperty = function(property) {
            var index = vm.securableProperty.properties.indexOf(property);
            vm.securableProperty.properties.splice(index, 1);
            securablePropertiesService.saveSecurableProperty(vm.securableProperty);
        };

        vm.saveProperty = function() {
            var index = vm.securableProperty.properties.indexOf(vm.newProperty);
            if (index > -1) {
                toastr.error('The property you are trying to add, already exists in the type.');
                vm.clearProperty();
            } else {
                vm.securableProperty.properties.push(vm.newProperty);
                securablePropertiesService.saveSecurableProperty(vm.securableProperty);
                vm.clearProperty();
            }
        };

        vm.clearProperty = function(){
            vm.newProperty = null;
        }
    }
}());