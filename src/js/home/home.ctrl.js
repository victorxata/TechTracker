
(function(){
    'use strict';

    angular.module('txAdmin.Home')
        .controller('homeCtrl', HomeController);

    HomeController.$inject = ['$scope', '$http', 'user', 'endpointsService', 'usersService', 'rolesService', 
        'securablePropertiesService', 'fieldsFilterService', 'alertService', '$state'];

    function HomeController($scope, $http, user, endpointsService, usersService, rolesService, 
                            securablePropertiesService, fieldsFilterService, alertService, $state) {
        
        var vm = this;

        vm.labels = ["Year Target", "Target to date"];
        vm.data = [300, 100];

        vm.seriesbar1 = ['Target', 'Current']
        vm.labelsbar1 = ['Garda', 'VHI', 'CoI', 'BoI', 'BNM', 'DSP', 'Revenue', 'Axis', 'Products', 'Pool'];
        vm.databar1 = [
            [25, 65, 11, 86, 43, 77, 44, 12, 87, 21],
            [10, 50, 5, 44, 21, 21, 15, 3, 32, 2]
        ];
        
        vm.user = user;

        vm.users = 0;

        vm.roles = 0;

        vm.endpoints = 0;

        vm.securableProperties = 0;

        vm.fieldsFilter = 0;


        vm.refresh = function(){

        };

        vm.getFieldsFilters = function(){
        };


        vm.getRoles = function(){

        };

        vm.refresh();


        vm.addRole = function(){
            var num = vm.roles + 1;
            var role = {
                name: 'New Role ' + num,
                userIds: [],
                OrgUnitIds: [],
                PermissionNames: []
            };
            rolesService.addRole(role)
                .success(function(response){
                    alertService.info('Created new Role with Id', response.id);

                    $state.go('roleDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new role', response);
                })
        };

        vm.addEndpoint = function(){
            var num = vm.endpoints + 1;
            var endpoint = {
                description: 'New Endpoint ' + num,
                method: 'GET',
                endpoint: '/api/endpoint'
            };
            endpointsService.addEndpoint(endpoint)
                .success(function(response){
                    alertService.info('Created new Endpoint with Id', response.id);

                    $state.go('endpointDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new endpoint', response);
                })
        };

        vm.addSecurableProperty = function(){
            var securableProperty = {
                typeName: 'ClassName1',
                properties: []
            };
            securablePropertiesService.addSecurableProperty(securableProperty)
                .success(function(response){
                    alertService.info('Created new Securable Property with Id', response.id);

                    $state.go('securablePropertiesDetails', {id:response.id});
                })
                .error(function(response){
                    alertService.error('Error creating new Securable Property', response);
                })
        };

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