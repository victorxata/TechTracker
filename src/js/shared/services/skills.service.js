/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('skillsService', SkillsService);

    SkillsService.$inject = ['$http', 'DS' ,'$q', 'toastr'];

    function SkillsService($http, DS, $q, toastr) {
        return {
            getSkills: getSkills,
            getSkill: getSkill,
            saveSkill: saveSkill,
            addSkill: addSkill,
            deleteSkill: deleteSkill,
            checkIfExists: checkIfExists,
            checkIfDescriptionExists: checkIfDescriptionExists,
            countSkills: countSkills
        };

        function getSkills() {
            var rUrl = DS.defaults.basePath + '/Skills';
            return $http({method: 'GET', url:rUrl});
        }

        function countSkills(){
            return $q(function(resolve){
                getSkills()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving skills', response);
                        resolve(-1);
                    })
            })
        }

        function saveSkill(skill){
            var rUrl = DS.defaults.basePath + '/Skills/' + skill.id;
            return $http({method: 'PUT', url:rUrl, data: skill});
        }

        function addSkill(skill){
            var rUrl = DS.defaults.basePath + '/Skills/';
            return $http({method: 'POST', url:rUrl, data: skill});
        }

        function getSkill(id) {
            var rUrl = DS.defaults.basePath + '/Skills/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteSkill(id) {
            var rUrl = DS.defaults.basePath + '/Skills/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }

        function checkIfExists(skill){
            var result = false;
            return $q(function(resolve, reject){
                getSkills()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [skill];

                        angular.forEach(originList, function(skill){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                var exists = ((skill.skill === curr.skill) && (skill.method === curr.method)) || prev;
                                console.log(exists);
                                return exists;
                            }, false);

                            if (match) result = true;
                        });
                        console.log('Return value: ', result);

                       resolve(result);
                    })
            });
        }

        function checkIfDescriptionExists(skill){
            var result = false;
            return $q(function(resolve, reject){
                getSkills()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [skill];

                        angular.forEach(originList, function(skill){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                return (skill.description === curr.description) || prev;
                            }, false);

                            if (match) result = true;
                        });

                        resolve(result);
                    })
            });
        }
    }
}());