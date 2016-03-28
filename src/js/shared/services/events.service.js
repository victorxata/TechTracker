/**
 * Created by victorzaragoza on 07/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('eventsService', EventsService);

    EventsService.$inject = ['$http', 'DS'];

    function EventsService($http, DS) {
        return {
            getEvents: getEvents,
            countEvents: countEvents,
            getEventsWithFilter: getEventsWithFilter,
            countEventsWithFilter: countEventsWithFilter
        };

        function getEvents(skip, limit) {
            var rUrl = DS.defaults.basePath + '/events?skip=' + skip + '&limit=' + limit;
            return $http({method: 'GET', url:rUrl});
        }

        function countEvents(){
            var rUrl = DS.defaults.basePath + '/events/number';
            return $http({method: 'GET', url:rUrl});
        }

        function getEventsWithFilter(skip, limit, filter){
            var rUrl = DS.defaults.basePath + '/events/filter?skip=' + skip + '&limit=' + limit;
            return $http({method: 'POST', url:rUrl, data: filter});
        }

        function countEventsWithFilter(filter){
            var rUrl = DS.defaults.basePath + '/events/filter/number';
            return $http({method: 'POST', url:rUrl, data: filter});
        }

    }
}());