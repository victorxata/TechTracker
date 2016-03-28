'use strict';
angular.module('txAdmin.services.TokenInterceptor', ['txAdmin.services.Authentication'])
    .service('TokenInterceptor', function(Authentication){
        var service = this;

        service.request = function(config){
            var token = Authentication.getToken();

            if(token){
                config.headers.authorization = 'Bearer ' + token;
            }

            return config;
        };
    });