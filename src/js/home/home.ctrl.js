
(function(){
    'use strict';

    angular.module('txAdmin.Home')
        .controller('homeCtrl', HomeController);

    HomeController.$inject = ['user', 'summaryService'];

    function HomeController(user, summaryService) {
        
        var vm = this;

        vm.labels = ["Year Target", "Hired to date"];
        vm.data = [0, 0];

        vm.seriesbar1 = ['Target', 'Hired'];

        vm.labelsbar1 = [];
        vm.databar1 = [[],[]];
        
        vm.user = user;
        vm.refresh = function(){
            summaryService.getSummary()
                .success(function(response){
                    vm.data[0] = response.target;
                    vm.data[1] = response.hired;
                    vm.labelsbar1 = [];
                    vm.databar1 = [[],[]];
                    angular.forEach(response.byAccount, function(account){
                        vm.labelsbar1.push(account.accountName);
                        vm.databar1[0].push(account.target);
                        vm.databar1[1].push(account.hired);
                    })
                })

        };
        vm.refresh();
    }
}());