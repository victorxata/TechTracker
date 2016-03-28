'use strict';
angular.module('txAdmin.services.UnauthorizedInterceptor', ['txAdmin.services.Authentication'])
    .service('UnauthorizedInterceptor', function($q, $injector, Authentication){
        var service = this;

        service.responseError = function(rejection){
            var $state = $injector.get('$state');
            console.log('rejection', rejection);

            if(rejection.status === 401){
                Authentication.logout().then(function(){
                   $state.go('login');
                });
            }

            return $q.reject(rejection);
        };
    });