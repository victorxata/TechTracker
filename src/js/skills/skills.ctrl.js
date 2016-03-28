/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Skills')
        .controller('skillsCtrl', SkillsController);

    SkillsController.$inject = ['$scope', 'skillsService', 'alertService', '$state'];

    function SkillsController($scope, skillsService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.skills = null;

        skillsService.getSkills()
            .success(function (response) {
                console.log(response);
                vm.skills = response;
            });

        vm.addSkill = function(){
            var skill = {
                description: 'New Skill'
            };
            skillsService.addSkill(skill)
                .success(function(response){
                    alertService.info('Created new Skill with Id', response.id);

                    $state.go('skillDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Skill', response);
                })
        }
    }

}());