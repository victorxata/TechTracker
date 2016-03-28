/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.SecurableProperties')
        .controller('securablePropertiesCtrl', SecurableProperties);

    SecurableProperties.$inject = ['$scope', 'securablePropertiesService', 'alertService', '$state'];

    function SecurableProperties($scope, securablePropertiesService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.securableProperties = null;

        securablePropertiesService.getSecurableProperties()
            .success(function (response) {
                console.log(response);
                vm.securableProperties = response;
            });

        vm.addSecurableProperty = function(){
            var securableProperty = {
                typeName: 'ClassName1',
                properties: []
            };
            securablePropertiesService.addSecurableProperty(securableProperty)
                .success(function(response){
                    alertService.info('Created new Securable Property with Id', response.id);

                    $state.go('securablePropertiesDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Securable Property', response);
                })
        }
    }

}());