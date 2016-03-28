/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('securablePropertiesService', SecurablePropertiesService);

    SecurablePropertiesService.$inject = ['$http', 'DS' ,'$q', 'toastr'];

    function SecurablePropertiesService($http, DS, $q, toastr) {
        return {
            getSecurableProperties: getSecurableProperties,
            getSecurableProperty: getSecurableProperty,
            saveSecurableProperty: saveSecurableProperty,
            addSecurableProperty: addSecurableProperty,
            deleteSecurableProperty: deleteSecurableProperty,
            checkIfExists: checkIfExists,
            checkIfDescriptionExists: checkIfDescriptionExists,
            countSecurableProperties: countSecurableProperties
        };

        function getSecurableProperties() {
            var rUrl = DS.defaults.basePath + '/fieldPermissionTypes';
            return $http({method: 'GET', url:rUrl});
        }

        function countSecurableProperties(){
            return $q(function(resolve){
                getSecurableProperties()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving Securable Properties', response);
                        resolve(-1);
                    })
            })
        }

        function saveSecurableProperty(securableProperty){
            var rUrl = DS.defaults.basePath + '/fieldPermissionTypes/' + securableProperty.id;
            return $http({method: 'PUT', url:rUrl, data: securableProperty});
        }

        function addSecurableProperty(securableProperty){
            var rUrl = DS.defaults.basePath + '/fieldPermissionTypes/';
            return $http({method: 'POST', url:rUrl, data: securableProperty});
        }

        function getSecurableProperty(id) {
            var rUrl = DS.defaults.basePath + '/fieldPermissionTypes/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteSecurableProperty(id) {
            var rUrl = DS.defaults.basePath + '/fieldPermissionTypes/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }

        function checkIfExists(endpoint){
            var result = false;
            return $q(function(resolve, reject){
                getSecurableProperty()
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
                getSecurableProperty()
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