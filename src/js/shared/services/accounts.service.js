/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('accountsService', AccountsService);

    AccountsService.$inject = ['$http', 'DS' ,'$q', 'toastr'];

    function AccountsService($http, DS, $q, toastr) {
        return {
            getAccounts: getAccounts,
            getAccount: getAccount,
            saveAccount: saveAccount,
            addAccount: addAccount,
            deleteAccount: deleteAccount,
            checkIfExists: checkIfExists,
            checkIfDescriptionExists: checkIfDescriptionExists,
            countAccounts: countAccounts
        };

        function getAccounts() {
            var rUrl = DS.defaults.basePath + '/Accounts';
            return $http({method: 'GET', url:rUrl});
        }

        function countAccounts(){
            return $q(function(resolve){
                getAccounts()
                    .success(function(response){
                        resolve(response.length);
                    })
                    .error(function(response){
                        toastr.error('Error retrieving accounts', response);
                        resolve(-1);
                    })
            })
        }

        function saveAccount(account){
            var rUrl = DS.defaults.basePath + '/Accounts/' + account.id;
            return $http({method: 'PUT', url:rUrl, data: account});
        }

        function addAccount(account){
            var rUrl = DS.defaults.basePath + '/Accounts/';
            return $http({method: 'POST', url:rUrl, data: account});
        }

        function getAccount(id) {
            var rUrl = DS.defaults.basePath + '/Accounts/' + id;
            return $http({method: 'GET', url:rUrl});
        }

        function deleteAccount(id) {
            var rUrl = DS.defaults.basePath + '/Accounts/' + id;
            return $http({method: 'DELETE', url:rUrl});
        }

        function checkIfExists(account){
            var result = false;
            return $q(function(resolve, reject){
                getAccounts()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [account];

                        angular.forEach(originList, function(account){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                var exists = ((account.account === curr.account) && (account.method === curr.method)) || prev;
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

        function checkIfDescriptionExists(account){
            var result = false;
            return $q(function(resolve, reject){
                getAccounts()
                    .success(function(response){

                        var originList = response;
                        var itemToSearch = [account];

                        angular.forEach(originList, function(account){
                            var match = itemToSearch.reduce(function(prev, curr) {
                                return (account.description === curr.description) || prev;
                            }, false);

                            if (match) result = true;
                        });

                        resolve(result);
                    })
            });
        }
    }
}());