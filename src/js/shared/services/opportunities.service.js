/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('opportunitiesService', OpportunitiesService);

    OpportunitiesService.$inject = ['$http', 'DS', 'alertService', '$q'];

    function OpportunitiesService($http, DS, alertService, $q) {
        return {
            getOpportunities: getOpportunities,
            getOpportunity: getOpportunity,
            saveOpportunity: saveOpportunity,
            deleteOpportunity: deleteOpportunity,
            addOpportunity: addOpportunity,
            countOpportunities: countOpportunities
        };

        function countOpportunities(){
            return $q(function(resolve){
                getOpportunities()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        alertService.error('Error retrieving candidates', response);
                        resolve(-1);
                    })
            })
        }
        function getOpportunities() {
            var rUrl = DS.defaults.basePath + '/Opportunities';
            return $http({method: 'GET', url:rUrl});
        }

        function saveOpportunity(candidate){
            var rUrl = DS.defaults.basePath + '/Opportunities/' + candidate.id;
            return $http({method: 'PUT', url:rUrl, data: candidate});
        }

        function addOpportunity(candidate){
            var rUrl = DS.defaults.basePath + '/Opportunities/';
            return $http({method: 'POST', url:rUrl, data: candidate});
        }

        function getOpportunity(id) {
            var rUrl = DS.defaults.basePath + '/Opportunities/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteOpportunity(id) {
            var rUrl = DS.defaults.basePath + '/Opportunities/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }
    }
}());