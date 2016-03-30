/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Opportunities')
        .controller('opportunitiesCtrl', OpportunitiesController);

    OpportunitiesController.$inject = ['$scope', 'opportunitiesService', 'alertService', '$state'];

    function OpportunitiesController($scope, opportunitiesService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.opportunities = null;

        opportunitiesService.getOpportunities()
            .success(function (response) {
                console.log(response);
                vm.opportunities = response;
            });

        vm.addOpportunity = function(){
            var opportunity = {
                role: 'New Role',
                accountId: null,
                target: 1,
                sold: false
            };
            opportunitiesService.addOpportunity(opportunity)
                .success(function(response){
                    alertService.info('Created new Opportunity with Id', response.id);

                    $state.go('opportunityDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Opportunity', response);
                })
        }
    }

}());