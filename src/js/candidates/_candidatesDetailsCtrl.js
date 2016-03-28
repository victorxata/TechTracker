/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.CandidateDetails', [])
        .controller('candidateDetailsCtrl', CandidateDetailsController);

    CandidateDetailsController.$inject = ['$scope', 'candidatesService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function CandidateDetailsController($scope, candidatesService, $stateParams, $window, $timeout, toastr, $state) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editName = false;


        refresh();

        vm.editNameFunc = function(){
            vm.editName = true;
            vm.editEndpoint = false;
            var element = $window.document.getElementById('editNameInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editNameSave = function(){
            candidatesService.checkIfNameExists(vm.candidate)
                .then(function(exists){
                    if (!exists){
                        candidatesService.saveCandidate(vm.candidate);
                    }
                    else{
                        toastr.error('The name selected already exists in the database');
                    }
                    vm.editName = false;
                    refresh();
                });

        };

        vm.editNameCancel = function(){
            vm.editName = false;
            refresh();
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


        vm.deleteCandidate = function(candidateId){
            candidatesService.deleteCandidate(candidateId)
                .success(function(){
                    toastr.info('Candidate removed from database.');
                    $state.go('candidates');
                })
        };


        function refresh(){
            candidatesService.getCandidate(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.candidate = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        };

    }
}());