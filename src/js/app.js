'use strict';
angular.module('txAdmin', [
    'baseApp.shared',
    'ui.router',
    'js-data',
    'ngDialog',
    'ngAnimate',
    'toastr',
    'ngFileUpload',
    'ui.bootstrap',
    'angularjs-dropdown-multiselect',

    'txAdmin.services.TokenInterceptor',
    'txAdmin.services.UnauthorizedInterceptor',
    'txAdmin.Authentication',
    'txAdmin.Login',
    'txAdmin.Home',
    'txAdmin.Users',
    'txAdmin.UserDetails',
    'txAdmin.Roles',
    'txAdmin.RoleDetails',
    'txAdmin.Endpoints',
    'txAdmin.EndpointDetails',
    'txAdmin.FieldsFilter',
    'txAdmin.fieldFiltersDetails',
    'txAdmin.SecurableProperties',
    'txAdmin.SecurablePropertiesDetails',
    'txAdmin.Skills',
    'txAdmin.SkillDetails',
    'txAdmin.Accounts',
    'txAdmin.AccountDetails',
    'txAdmin.Candidates',
    'txAdmin.CandidateDetails',
    'txAdmin.Opportunities',
    'txAdmin.OpportunityDetails'

])
    .config(function($urlRouterProvider, $httpProvider, DSProvider, toastrConfig){



        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push('UnauthorizedInterceptor');

        $urlRouterProvider.otherwise('/');

        angular.extend(toastrConfig, {
            positionClass: 'toast-top-center',
            target: '#notificationCenter',
            maxOpened: 1,
            progressBar: true
        });

    })
    .run(function(apiListService, DS){
        var apis = apiListService.getApis();

        angular.forEach(apis, function(api){
            if (api.default){
                console.log('Selected API: ', api.name);
                DS.defaults.rootPath = api.url;
            }
        });

        //DSProvider.defaults.rootPath = 'http://windows:8080';

        //DSProvider.defaults.rootPath = 'http://dev-pgr2.cloudapp.net:8080';

        DS.defaults.basePath = DS.defaults.rootPath + '/api';
    })
;