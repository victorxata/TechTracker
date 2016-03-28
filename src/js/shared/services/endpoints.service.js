/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('endpointsService', EndpointsService);

    EndpointsService.$inject = ['$http', 'DS' ,'$q', 'toastr'];

    function EndpointsService($http, DS, $q, toastr) {
        return {
            getEndpoints: getEndpoints,
            getEndpoint: getEndpoint,
            saveEndpoint: saveEndpoint,
            addEndpoint: addEndpoint,
            deleteEndpoint: deleteEndpoint,
            checkIfExists: checkIfExists,
            checkIfDescriptionExists: checkIfDescriptionExists,
            countEndpoints: countEndpoints
        };

        function getEndpoints() {
            var rUrl = DS.defaults.basePath + '/Permissions';
            return $http({method: 'GET', url:rUrl});
        }

        function countEndpoints(){
            return $q(function(resolve){
                getEndpoints()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving endpoints', response);
                        resolve(-1);
                    })
            })
        }

        function saveEndpoint(endpoint){
            var rUrl = DS.defaults.basePath + '/Permissions/' + endpoint.id;
            return $http({method: 'PUT', url:rUrl, data: endpoint});
        }

        function addEndpoint(endpoint){
            var rUrl = DS.defaults.basePath + '/Permissions/';
            return $http({method: 'POST', url:rUrl, data: endpoint});
        }

        function getEndpoint(id) {
            var rUrl = DS.defaults.basePath + '/Permissions/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteEndpoint(id) {
            var rUrl = DS.defaults.basePath + '/Permissions/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }

        function checkIfExists(endpoint){
            var result = false;
            return $q(function(resolve, reject){
                getEndpoints()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [endpoint];

                        angular.forEach(originList, function(endpoint){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                var exists = ((endpoint.endpoint === curr.endpoint) && (endpoint.method === curr.method)) || prev;
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

        function checkIfDescriptionExists(endpoint){
            var result = false;
            return $q(function(resolve, reject){
                getEndpoints()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [endpoint];

                        angular.forEach(originList, function(endpoint){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                return (endpoint.description === curr.description) || prev;
                            }, false);

                            if (match) result = true;
                        });

                        resolve(result);
                    })
            });
        }
    }
}());