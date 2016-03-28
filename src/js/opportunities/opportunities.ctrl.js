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

        vm.addCandidate = function(){
            var opportunity = {
                description: 'New Candidate'
            };
            opportunitiesService.addCandidate(opportunity)
                .success(function(response){
                    alertService.info('Created new Candidate with Id', response.id);

                    $state.go('opportunityDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Candidate', response);
                })
        }
    }

}());