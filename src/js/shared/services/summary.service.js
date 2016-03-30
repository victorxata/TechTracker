/**
 * Created by victorzaragoza on 24/03/2016.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('summaryService', SummaryService);

    SummaryService.$inject = ['$http', 'DS' ,'$q', 'toastr'];

    function SummaryService($http, DS, $q, toastr) {
        return {
            getSummary: getSummary
        };

        function getSummary() {
            var rUrl = DS.defaults.basePath + '/Summary';
            return $http({method: 'GET', url:rUrl});
        }

    }
}());