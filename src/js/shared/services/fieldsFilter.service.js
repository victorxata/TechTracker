/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('fieldsFilterService', fieldsFilterService);

    fieldsFilterService.$inject = ['$http', 'DS', 'toastr', '$q'];

    function fieldsFilterService($http, DS, toastr, $q) {
        return {
            getFieldsFilters: getFieldsFilters,
            getFieldsFilter: getFieldsFilter,
            saveFieldsFilter: saveFieldsFilter,
            deleteFieldsFilter: deleteFieldsFilter,
            addFieldsFilter: addFieldsFilter,
            countFieldsFilter: countFieldsFilter
        };

        function countFieldsFilter(){
            return $q(function(resolve){
                getFieldsFilters()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving fieldFilters', response);
                        resolve(-1);
                    })
            })
        }
        function getFieldsFilters() {
            var rUrl = DS.defaults.basePath + '/fieldPermissions';
            return $http({method: 'GET', url:rUrl});
        }

        function saveFieldsFilter(fieldFilter){
            var rUrl = DS.defaults.basePath + '/fieldPermissions/' + fieldFilter.id;
            return $http({method: 'PUT', url:rUrl, data: fieldFilter});
        }

        function addFieldsFilter(fieldFilter){
            var rUrl = DS.defaults.basePath + '/fieldPermissions/';
            return $http({method: 'POST', url:rUrl, data: fieldFilter});
        }

        function getFieldsFilter(id) {
            var rUrl = DS.defaults.basePath + '/fieldPermissions/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteFieldsFilter(id) {
            var rUrl = DS.defaults.basePath + '/fieldPermissions/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }


    }
}());