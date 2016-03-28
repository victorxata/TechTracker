/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.OpportunityDetails', [])
        .controller('opportunityDetailsCtrl', OpportunityDetailsController);

    OpportunityDetailsController.$inject = ['$scope', 'opportunitiesService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function OpportunityDetailsController($scope, opportunitiesService, $stateParams, $window, $timeout, toastr, $state) {

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
            opportunitiesService.checkIfNameExists(vm.opportunity)
                .then(function(exists){
                    if (!exists){
                        opportunitiesService.saveOpportunity(vm.opportunity);
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


        vm.deleteOpportunity = function(opportunityId){
            opportunitysService.deleteOpportunity(opportunityId)
                .success(function(){
                    toastr.info('Opportunity removed from database.');
                    $state.go('opportunities');
                })
        };


        function refresh(){
            opportunitysService.getOpportunity(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.opportunity = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        };

    }
}());