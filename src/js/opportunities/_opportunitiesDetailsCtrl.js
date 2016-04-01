/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.OpportunityDetails', [])
        .controller('opportunityDetailsCtrl', OpportunityDetailsController);

    OpportunityDetailsController.$inject = ['$scope', 'opportunitiesService', '$stateParams', '$window', '$timeout', 'toastr', '$state', 'accountsService', 'skillsService'];

    function OpportunityDetailsController($scope, opportunitiesService, $stateParams, $window, $timeout, toastr, $state, accountsService, skillsService) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.employeeLevels = [
            'unknown',
            'cm',
            'manager',
            'consultant',
            'analyst',
            'level1',
            'level2',
            'level3',
            'level4',
            'level5',
            'level6',
            'level7',
            'level8',
            'level9',
            'level10',
            'level11',
            'level12',
            'level13',
            'level14',
            'level15'
        ];

        vm.targets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

        vm.skills = [];

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

        vm.save = function(){
            vm.editName = false;
            opportunitiesService.saveOpportunity(vm.opportunity);
            refresh()
        };

        vm.editNameCancel = function(){
            vm.editName = false;
            refresh();
        };

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                
                if (editor === 'name'){
                    vm.save();
                }
            }
            if (event.keyCode === 27){
                
                if (editor === 'name'){
                    vm.editNameCancel();
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
                    console.log('Accounts:', response);
                    vm.allAccounts = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
            skillsService.getSkills()
                .success(function(response){
                    console.log('Skills:', response);
                    vm.skills = response;
                    vm.availableskills = vm.skills;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        }

        vm.moveItem = function(item, from, to, putOrRemove) {

            console.log('Move item   Item: '+item+' From:: '+from+' To:: '+to);

            var idx=from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);

                if (putOrRemove === 'Put'){
                    opportunitiesService.addSkillToOpportunity(vm.id, item);
                }
                else{
                    opportunitiesService.removeSkillToOpportunity(vm.id, item.id);
                }
            }
        };


        vm.selectedskills = [];

    }
}());