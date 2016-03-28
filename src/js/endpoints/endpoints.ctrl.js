/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Endpoints')
        .controller('endpointsCtrl', EndpointsController);

    EndpointsController.$inject = ['$scope', 'endpointsService', 'alertService', '$state'];

    function EndpointsController($scope, endpointsService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.endpoints = null;

        endpointsService.getEndpoints()
            .success(function (response) {
                console.log(response);
                vm.endpoints = response;
            });

        vm.addEndpoint = function(){
            var endpoint = {
                description: 'New Endpoint 1',
                method: 'GET',
                endpoint: '/api/endpoint'
            };
            endpointsService.addEndpoint(endpoint)
                .success(function(response){
                    alertService.info('Created new Endpoint with Id', response.id);

                    $state.go('endpointDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new endpoint', response);
                })
        }
    }

}());