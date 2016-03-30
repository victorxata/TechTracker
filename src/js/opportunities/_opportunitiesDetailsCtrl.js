/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.OpportunityDetails', [])
        .controller('opportunityDetailsCtrl', OpportunityDetailsController);

    OpportunityDetailsController.$inject = ['$scope', 'opportunitiesService', '$stateParams', '$window', '$timeout', 'toastr', '$state', 'accountsService'];

    function OpportunityDetailsController($scope, opportunitiesService, $stateParams, $window, $timeout, toastr, $state, accountsService) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editName = false;
        vm.editAccount = false;
        vm.editTarget = false;

        vm.allAccounts = [];


        refresh();

        vm.editNameFunc = function(){
            vm.editName = true;
            vm.editAccount = false;
            vm.editTarget = false;

            var element = $window.document.getElementById('editNameInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editAccountFunc = function(){
            vm.editName = false;
            vm.editAccount = true;
            vm.editTarget = false;
            var element = $window.document.getElementById('editAccountInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editTargetFunc = function(){
            vm.editName = false;
            vm.editTarget = true;
            vm.editAccount = false;
            var element = $window.document.getElementById('editTargetInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editNameSave = function(){
            opportunitiesService.saveOpportunity(vm.opportunity);
        };

        vm.editAccountSave = function(){
            opportunitiesService.saveOpportunity(vm.opportunity);
        };

        vm.editTargetSave = function(){
            opportunitiesService.saveOpportunity(vm.opportunity);
        };

        vm.editNameCancel = function(){
            vm.editName = false;
            refresh();
        };

        vm.editAccountCancel = function(){
            vm.editAccount = false;
            refresh();
        };
        
        vm.editTargetCancel = function(){
            vm.editTarget = false;
            refresh();
        };
        
        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                
                if (editor === 'name'){
                    vm.editNameSave();
                }
                if (editor === 'account'){
                    vm.editAccountSave();
                }
                if (editor === 'target'){
                    vm.editTargetSave();
                }
            }
            if (event.keyCode === 27){
                
                if (editor === 'name'){
                    vm.editNameCancel();
                }
                if (editor === 'account'){
                    vm.editAccountCancel();
                }
                if (editor === 'target'){
                    vm.editTargetCancel();
                }
            }
        };


        vm.deleteOpportunity = function(opportunityId){
            opportunitiesService.deleteOpportunity(opportunityId)
                .success(function(){
                    toastr.info('Opportunity removed from database.');
                    $state.go('opportunities');
                })
        };


        function refresh(){
            opportunitiesService.getOpportunity(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.opportunity = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
            accountsService.getAccounts()
                .success(function(response){
                    console.log('Accounts', response);
                    vm.allAccounts = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        }

    }
}());