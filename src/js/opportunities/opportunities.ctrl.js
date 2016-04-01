/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function(){
    'use strict';

    angular.module('txAdmin.Opportunities')
        .controller('opportunitiesCtrl', OpportunitiesController);

    OpportunitiesController.$inject = ['$scope', 'opportunitiesService', 'alertService', '$state', 'accountsService'];

    function OpportunitiesController($scope, opportunitiesService, alertService, $state, accountsService) {

        var vm = this;

        $scope.error = false;

        vm.opportunities = null;

        vm.accounts = null;

        refresh();

        function refresh(){

            opportunitiesService.getOpportunities()
                .success(function (response) {
                    console.log('opportunities: ', response);
                    vm.opportunities = response;
                    accountsService.getAccounts()
                        .success(function(response){
                            console.log('Accounts: ', response)
                            vm.accounts = response;
                            angular.forEach(vm.opportunities, function(value){
                                vm.getAccountName(value);
                            })
                        })
                        .error(function(response){
                            alertService.error('Error retrieving accounts', response);
                        });

                })
                .error(function(response){
                    alertService.error('Error retrieving opportunities', response);
                });

        }

        vm.getAccountName = function(opportunity){
          angular.forEach(vm.accounts, function(value){
              if (value.id === opportunity.accountId){
                  opportunity.accountName = value.description;
              }
          })
        };

        vm.addOpportunity = function(){
            var opportunity = {
                role: 'New Role',
                target: 1,
                sold: false,
                employeeLevel: 0
            };
            opportunitiesService.addOpportunity(opportunity)
                .success(function(response){
                    alertService.info('Created new Opportunity with Id', response.id);

                    $state.go('opportunityDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Opportunity', response);
                })
        }


    }

}());