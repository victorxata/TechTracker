/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('rolesService', RolesService);

    RolesService.$inject = ['$http', 'DS', 'alertService', '$q'];

    function RolesService($http, DS, alertService, $q) {
        return {
            getRoles: getRoles,
            getRole: getRole,
            saveRole: saveRole,
            deleteRole: deleteRole,
            getUserRoles: getUserRoles,
            getUserEndpoints: getUserEndpoints,
            deleteUserRole: deleteUserRole,
            addUserToRole: addUserToRole,
            removeUserFromRole: removeUserFromRole,
            removeEndpointFromRole: removeEndpointFromRole,
            addEndpointToRole: addEndpointToRole,
            addRole: addRole,
            countRoles: countRoles
        };

        function countRoles(){
            return $q(function(resolve){
                getRoles()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        alertService.error('Error retrieving roles', response);
                        resolve(-1);
                    })
            })
        }
        function getRoles() {
            var rUrl = DS.defaults.basePath + '/Roles';
            return $http({method: 'GET', url:rUrl});
        }

        function saveRole(role){
            var rUrl = DS.defaults.basePath + '/Roles/' + role.id;
            return $http({method: 'PUT', url:rUrl, data: role});
        }

        function addRole(role){
            var rUrl = DS.defaults.basePath + '/Roles/';
            return $http({method: 'POST', url:rUrl, data: role});
        }

        function getRole(id) {
            var rUrl = DS.defaults.basePath + '/Roles/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteRole(id) {
            var rUrl = DS.defaults.basePath + '/Roles/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }

        function getUserRoles(userId) {
            var rUrl = DS.defaults.basePath + '/Roles/Users/' + userId;
            return $http({method: 'GET', url:rUrl});
        }

        function getUserEndpoints(userId){
            var rUrl = DS.defaults.basePath + '/Roles/Users/' + userId + '/Permissions';
            return $http({method: 'GET', url:rUrl});
        }

        function deleteUserRole(userId, id) {
            var rUrl = DS.defaults.basePath + 'Roles/' + id + '/Users/Remove/' + userId;
            return $http({method: 'POST', url:rUrl});
        }

        function addUserToRole(userId, roleId){
            var rUrl = DS.defaults.basePath + '/Roles/' + roleId + '/Users/Add/' + userId;
            return $http({method: 'POST', url:rUrl});
        }

        function removeUserFromRole(userId, roleId){
            var rUrl = DS.defaults.basePath + '/Roles/' + roleId + '/Users/Remove/' + userId;
            return $http({method: 'POST', url:rUrl});
        }

        function removeEndpointFromRole(endpointId, roleId){
            var rUrl = DS.defaults.basePath + '/Roles/' + roleId + '/Permissions/Remove/' + endpointId;
            return $http({method: 'POST', url:rUrl});
        }

        function addEndpointToRole(endpointId, roleId){
            var rUrl = DS.defaults.basePath + '/Roles/' + roleId + '/Permissions/Add/' + endpointId;
            return $http({method: 'POST', url:rUrl});
        }


    }
}());