/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin.FieldsFilter')
        .controller('fieldsFilterCtrl', FieldsFilterController);

    FieldsFilterController.$inject = ['$scope', '$rootScope', 'fieldsFilterService', '$state', 'alertService'];

    function FieldsFilterController($scope, $rootScope, fieldsFilterService, $state, alertService) {

        var vm = this;

        $scope.error = false;

        vm.fieldFilters = null;

        vm.search = '';

        $rootScope.$on('refreshData', refresh);

        refresh();

        function refresh(){
            fieldsFilterService.getFieldsFilters()
                .success(function (response) {
                    vm.fieldFilters = response;
                });
        }

        vm.addfieldFilter = function(){

            var filterField = {
                roleName: '',
                userName: '',
                className: '',
                propertyName: '',
                action: '0'
            };
            fieldsFilterService.addFieldsFilter(filterField)
                .success(function(response){
                    alertService.info('Created new Field Filter with Id', response.id);

                    $state.go('fieldsFilterDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Field Filter', response);
                })
        };


    }
}());