/**
 * Created by victorzaragoza on 08/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.EndpointDetails', [])
        .controller('endpointDetailsCtrl', EndpointDetailsController);

    EndpointDetailsController.$inject = ['$scope', 'endpointsService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function EndpointDetailsController($scope, endpointsService, $stateParams, $window, $timeout, toastr, $state) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editName = false;
        vm.editDescription = false;
        vm.editEndpoint = false;


        refresh();

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
            endpointsService.saveEndpoint(vm.endpoint);
            vm.editName = false;
        };

        vm.editNameCancel = function(){
            vm.editName = false;
            endpointsService.getEndpoint(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.endpoint = response
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
                if (editor === 'name'){
                    vm.editNameSave();
                }
                if (editor === 'description'){
                    vm.editDescriptionSave();
                }
                if (editor === 'endpoint'){
                    vm.editEndpointSave();
                }
            }
            if (event.keyCode === 27){
                if (editor === 'name'){
                    vm.editNameCancel();
                }
                if (editor === 'description'){
                    vm.editDescriptionCancel();
                }
                if (editor === 'endpoint'){
                    vm.editEndpointCancel();
                }
            }
        };

        vm.editDescriptionFunc = function(){
            vm.editDescription = true;
            vm.editEndpoint = false;
            var element = $window.document.getElementById('editDescriptionInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editDescriptionSave = function(){
            endpointsService.checkIfDescriptionExists(vm.endpoint)
                .then(function(exists){
                    if (!exists){
                        endpointsService.saveEndpoint(vm.endpoint);
                    }
                    else{
                        toastr.error('The description selected already exists in the database');
                    }
                    vm.editDescription = false;
                    refresh();
                });

        };

        vm.editDescriptionCancel = function(){
            vm.editDescription = false;
            refresh();
        };

        vm.editEndpointFunc = function(){
            vm.editDescription = false;
            vm.editEndpoint = true;
            var element = $window.document.getElementById('editEndpointInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editEndpointSave = function(){
            endpointsService.checkIfExists(vm.endpoint)
                .then(function(exists){
                    if (!exists){
                        console.log('Returning ', exists);
                        endpointsService.saveEndpoint(vm.endpoint);
                    }
                    else{
                        console.log('Error ', exists);
                        toastr.error('The endpoint/method selected already exists in the database');
                    }
                    vm.editEndpoint = false;
                    refresh();
                });

        };

        vm.editEndpointCancel = function(){
            vm.editEndpoint = false;
            refresh();
        };

        vm.setMethod = function(method){
            vm.endpoint.method = method;
            endpointsService.checkIfExists(vm.endpoint)
                .then(function(exists){
                    if (!exists){
                        console.log('Returning ', exists);
                        endpointsService.saveEndpoint(vm.endpoint);
                    }
                    else{
                        console.log('Error ', exists);
                        toastr.error('The endpoint/method selected already exists in the database');
                    }
                    vm.editEndpoint = false;
                    refresh();
                });

        };

        vm.deleteEndpoint = function(endpointId){
            endpointsService.deleteEndpoint(endpointId)
                .success(function(){
                    toastr.info('Endpoint removed from database. If this endpoint is used in roles or users, there might be inconsistencies');
                    $state.go('endpoints');
                })
        };


        function refresh(){
            endpointsService.getEndpoint(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.endpoint = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        };

    }
}());