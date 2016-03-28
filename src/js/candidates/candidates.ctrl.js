/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Candidates')
        .controller('candidatesCtrl', CandidatesController);

    CandidatesController.$inject = ['$scope', 'candidatesService', 'alertService', '$state'];

    function CandidatesController($scope, candidatesService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.candidate = null;

        candidatesService.getCandidates()
            .success(function (response) {
                console.log(response);
                vm.candidate = response;
            });

        vm.addCandidate = function(){
            var candidate = {
                name: 'New Candidate'
            };
            candidatesService.addCandidate(candidate)
                .success(function(response){
                    alertService.info('Created new Candidate with Id', response.id);

                    $state.go('candidateDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Candidate', response);
                })
        }
    }

}());