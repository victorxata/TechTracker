/**
 * Created by victorzaragoza on 23/07/2015.
 */
(function() {
    'use strict';
    angular.module('txAdmin')
        .factory('apiListService', ApiListService);

    ApiListService.$inject = ['DS'];


    function ApiListService(DS) {

        var apis = [
            {
                name: 'Azure Websites API',
                url:'http://techtrackerapi.azurewebsites.net',
                default: true
            }
            //,{
            //    name: 'Windows (VM inside Mac)',
            //    url:'http://192.168.192.37:8080',
            //    default: true
            //}
        ];

        return {
            getApis: getApis,
            setApiDefault: setApiDefault
        };

        function getApis() {
            return apis;
        }

        function setApiDefault(api){
            angular.forEach(apis, function(oldApi){
                if (oldApi.name === api){
                    oldApi.default = true;
                    DS.defaults.rootPath = oldApi.url;
                    DS.defaults.basePath = DS.defaults.rootPath + '/api';
                }
                else{
                    oldApi.default = false;
                }
            })
        }

    }
}());