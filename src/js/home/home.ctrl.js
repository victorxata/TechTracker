
(function(){
    'use strict';

    angular.module('txAdmin.Home')
        .controller('homeCtrl', HomeController);

    HomeController.$inject = ['user', 'summaryService'];

    function HomeController(user, summaryService) {
        
        var vm = this;

        vm.labels = ["Year Target", "Hired to date"];
        vm.data = [100, 0];

        vm.seriesbar1 = ['Target', 'Current']
        vm.labelsbar1 = ['Garda', 'VHI', 'CoI', 'BoI', 'BNM', 'DSP', 'Revenue', 'Axis', 'Products', 'Pool'];
        vm.databar1 = [
            [25, 65, 11, 86, 43, 77, 44, 12, 87, 21],
            [10, 50, 5, 44, 21, 21, 15, 3, 32, 2]
        ];
        
        vm.user = user;



        vm.refresh = function(){
            summaryService.getSummary()
                .success(function(response){
                    vm.data[0] = response.target;
                    vm.data[1] = response.hired;
                })

        };

        vm.getFieldsFilters = function(){
        };


        vm.getRoles = function(){

        };

        vm.refresh();





    }
}());