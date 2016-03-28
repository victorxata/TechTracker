/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('candidatesService', CandidatesService);

    CandidatesService.$inject = ['$http', 'DS', 'alertService', '$q'];

    function CandidatesService($http, DS, alertService, $q) {
        return {
            getCandidates: getCandidates,
            getCandidate: getCandidate,
            saveCandidate: saveCandidate,
            deleteCandidate: deleteCandidate,
            addCandidate: addCandidate,
            countCandidates: countCandidates
        };

        function countCandidates(){
            return $q(function(resolve){
                getCandidates()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        alertService.error('Error retrieving candidates', response);
                        resolve(-1);
                    })
            })
        }
        function getCandidates() {
            var rUrl = DS.defaults.basePath + '/Candidates';
            return $http({method: 'GET', url:rUrl});
        }

        function saveCandidate(candidate){
            var rUrl = DS.defaults.basePath + '/Candidates/' + candidate.id;
            return $http({method: 'PUT', url:rUrl, data: candidate});
        }

        function addCandidate(candidate){
            var rUrl = DS.defaults.basePath + '/Candidates/';
            return $http({method: 'POST', url:rUrl, data: candidate});
        }

        function getCandidate(id) {
            var rUrl = DS.defaults.basePath + '/Candidates/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteCandidate(id) {
            var rUrl = DS.defaults.basePath + '/Candidates/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }
    }
}());