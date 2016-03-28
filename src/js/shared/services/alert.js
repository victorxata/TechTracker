/**
 * Created by victorzaragoza on 24/07/2015.
 */
'use strict';
angular.module('txAdmin')
    .factory('alertService', function(toastr ) {
        var service = {};

        service.info = function(message) {
            console.log(message);
            toastr.info(message);
        };

        service.warning = function(message) {
            console.log(message);
            toastr.warning(message);
        };

        service.success = function(message) {
            console.log(message);
            toastr.success(message);
        };

        service.error = function(message) {
            console.log(message);
            toastr.error(message);
        };

        return service;
    });