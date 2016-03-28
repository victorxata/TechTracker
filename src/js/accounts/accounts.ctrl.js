/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Accounts')
        .controller('accountsCtrl', AccountsController);

    AccountsController.$inject = ['$scope', 'accountsService', 'alertService', '$state'];

    function AccountsController($scope, accountsService, alertService, $state) {

        var vm = this;

        $scope.error = false;

        vm.accounts = null;

        accountsService.getAccounts()
            .success(function (response) {
                console.log(response);
                vm.accounts = response;
            });

        vm.addAccount = function(){
            var account = {
                description: 'New Account'
            };
            accountsService.addAccount(account)
                .success(function(response){
                    alertService.info('Created new Account with Id', response.id);

                    $state.go('accountDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Account', response);
                })
        }
    }

}());