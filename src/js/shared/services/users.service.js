/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('usersService', UsersService);

    UsersService.$inject = ['$http', 'DS', 'toastr', '$q'];

    function UsersService($http, DS, toastr, $q) {
        return {
            getUsers: getUsers,
            setUserSuper: setUserSuper,
            setUserNormal: setUserNormal,
            getUser: getUser,
            saveUser: saveUser,
            changePassword: changePassword,
            countUsers: countUsers,
            getUserByName: getUserByName
        };

        function countUsers(){
            return $q(function(resolve){
                getUsers()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving users', response);
                        resolve(-1);
                    })
            })
        }
        function getUsers() {
            var rUrl = DS.defaults.basePath + '/Users';
            return $http({method: 'GET', url:rUrl});
        }

        function saveUser(user){
            var rUrl = DS.defaults.basePath + '/Users/' + user.id;
            return $http({method: 'PUT', url:rUrl, data: user});
        }

        function getUser(id) {
            var rUrl = DS.defaults.basePath + '/Users/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function getUserByName(name) {
            var rUrl = DS.defaults.basePath + '/Users/ByName/' + name;
            return $http({method: 'GET', url:rUrl});
        }


        function setUserSuper(userId) {
            var rUrl = DS.defaults.basePath + '/Users/' + userId + '/ToSuper';
            return $http({method: 'POST', url:rUrl});
        }

        function setUserNormal(userId) {
            var rUrl = DS.defaults.basePath + '/Users/' + userId + '/ToNormal';
            return $http({method: 'POST', url:rUrl});
        }

        function changePassword(userId, model){
            var rUrl = DS.defaults.basePath + '/Users/' + userId + '/SetPassword';
            return $http({method: 'POST', url:rUrl, data: model});
        }


    }
}());