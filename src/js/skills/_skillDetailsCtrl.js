/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.SkillDetails', [])
        .controller('skillDetailsCtrl', SkillDetailsController);

    SkillDetailsController.$inject = ['$scope', 'skillsService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function SkillDetailsController($scope, skillsService, $stateParams, $window, $timeout, toastr, $state) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editName = false;


        refresh();

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
            skillsService.checkIfDescriptionExists(vm.skill)
                .then(function(exists){
                    if (!exists){
                        skillsService.saveSkill(vm.skill);
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

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                
                if (editor === 'description'){
                    vm.editDescriptionSave();
                }
            }
            if (event.keyCode === 27){
                
                if (editor === 'description'){
                    vm.editDescriptionCancel();
                }
            }
        };


        vm.deleteSkill = function(skillId){
            skillsService.deleteSkill(skillId)
                .success(function(){
                    toastr.info('Skill removed from database. If this skill is used in candidates or positions, there might be inconsistencies');
                    $state.go('skills');
                })
        };


        function refresh(){
            skillsService.getSkill(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.skill = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        };

    }
}());