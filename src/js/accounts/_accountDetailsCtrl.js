/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.AccountDetails', [])
        .controller('accountDetailsCtrl', AccountDetailsController);

    AccountDetailsController.$inject = ['$scope', 'accountsService', '$stateParams', '$window', '$timeout', 'toastr', '$state'];

    function AccountDetailsController($scope, accountsService, $stateParams, $window, $timeout, toastr, $state) {

        var vm = this;

        $scope.error = false;

        vm.id = $stateParams.id;

        vm.editDescription = false;


        refresh();

        vm.editDescriptionFunc = function(){
            vm.editDescription = true;
            vm.editEndpoint = false;
            var element = $window.document.getElementById('editDescriptionInput');

            console.log(element);
            if(element) {

                $timeout(function(){
                    element.focus();
                }, 10);
            }
        };

        vm.editDescriptionSave = function(){
            accountsService.checkIfDescriptionExists(vm.account)
                .then(function(exists){
                    if (!exists){
                        accountsService.saveAccount(vm.account);
                    }
                    else{
                        toastr.error('The description selected already exists in the database');
                    }
                    vm.editDescription = false;
                    refresh();
                });

        };

        vm.editDescriptionCancel = function(){
            vm.editDescription = false;
            refresh();
        };

        vm.checkKey = function(event, editor){
            console.log(event.keyCode);

            if (event.keyCode === 13){
                
                if (editor === 'description'){
                    vm.editDescriptionSave();
                }
            }
            if (event.keyCode === 27){
                
                if (editor === 'description'){
                    vm.editDescriptionCancel();
                }
            }
        };


        vm.deleteAccount = function(accountId){
            accountsService.deleteAccount(accountId)
                .success(function(){
                    toastr.info('Account removed from database. If this account is used in candidates or positions, there might be inconsistencies');
                    $state.go('accounts');
                })
        };


        function refresh(){
            accountsService.getAccount(vm.id)
                .success(function (response) {
                    console.log(response);
                    vm.account = response;
                })
                .error(function(response){
                    toastr.error(response);
                    console.log(response);
                });
        };

    }
}());