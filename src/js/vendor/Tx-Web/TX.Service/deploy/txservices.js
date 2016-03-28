/**
 * Created by tflorin on 4/29/2015.
 */
angular.module('txServices.resources',['txServices.common']);
/**
 * Created by tflorin on 4/29/2015.
 */
'use strict';
angular.module('txServices.resources')
    .factory('accountService', ["$http", "$window", "Restangular", "baseRoute", "url", function($http, $window, Restangular, baseRoute, url){

        var account = Restangular.all('userprofile');

        return {
            token:function(user, password){
                var obj = {username: user, password: password, grant_type: 'password'};
                return $http.post(baseRoute.apiRoute()+'/Token', url.encodeFromObject(obj), {headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
            },
            changePassword: function(newPassword, confirmPassword, oldPassword){
                return account.customPOST({newPassword: newPassword, confirmPassword: confirmPassword, oldPassword: oldPassword}, 'changePassword', {}, {TenantId:false});
            },
            setPassword: function(userName, newPassword, confirmPassword, token){
                return account.customPOST({userName: userName, password: newPassword, confirmPassword: confirmPassword, token: token}, 'setPassword');
            },
            getExternalProviders: function(){
                return account.customGETLIST('externallogins', {returnUrl: baseRoute.webRoute() + '/externalregister', generateState: true},{TenantId:false});
            },
            getUserExternalProviders: function(){
                return account.customGET('manageinfo', {returnUrl: baseRoute.webRoute() + '/settings/networks', generateState: true},{TenantId:false});
            },
            externalUserExists: function(){
                return account.customGET('externaluserexists');
            },
            getPregisteredUser: function(token){
                return account.customGET('registration', {token: token});
            },
            externalRegistration: function(Username, Email, FullName, image, language, country){
                return account.customPOST({username: Username, email: Email, realName: FullName, imageUrl: image, language: language, country: country}, 'externalregistration');
            },
            addExternalLogin: function(token){
                return account.customPOST({ExternalAccessToken: token}, 'addexternallogin');
            },
            removeExternalLogin: function(loginProvider, providerKey){
                return account.customPOST({loginProvider: loginProvider, providerKey: providerKey}, 'removelogin');
            },
            saveRegistration: function(register){
                return account.customPOST(register, 'registration');
            },
            uploadImage: function(images){
                return $http({
                    method: 'POST',
                    url: baseRoute.apiRoute() +  '/api/images/uploadimage',
                    data: images,
                    headers: {'Content-Type': undefined},
                    //Angular actually borks our data when we post it back, so to prevent that we prevent the default transform
                    transformRequest: function(data){return data;}
                });
            },
            getUserForPasswordRecovery: function(token){
                return account.customGET('recoverpassword/'+token);
            },
            userForPasswordRecovery: function(userName){
                return account.customPOST({}, 'rememberMe/' + userName);
            },
            savePregistration: function (user) {
                user.language = $window.navigator.language;  //TODO build getLanguageService
                return account.customPOST(user, 'preregistration');
            }
        };
    }]);

/**
 * Created by tflorin on 6/12/2015.
 */
angular.module('txServices.resources').factory('contentProcessingSequencesService',["Restangular", "txList", function(Restangular, txList){
    'use strict';
    var contentProcessorSequencesService = Restangular.all('sequences');
    var contentProcessorSequences = new txList();
    contentProcessorSequencesService.getList().then(function(result){
        contentProcessorSequences.addArray(result.plain());
    });
    return {
        contentProcessorSequences:function(){
            return contentProcessorSequences;
        },
        contentProcessorSequence:function(id){
            return contentProcessorSequences.findBy('id',id);
        }
    };
}]);
/**
 * Created by tflorin on 4/30/2015.
 */
'use strict';
angular.module('txServices.resources')
    .factory('countryLanguageService', ["Restangular", "$window", function(Restangular, $window){

        var countryLanguages = Restangular.all('languages');

        return {
            getCountryLanguages: function(){
                if(_.isUndefined($window.navigator.language)){
                    return countryLanguages.withHttpConfig({cache: true}).customGET('initialdata/en-US');
                }else{
                    return countryLanguages.withHttpConfig({cache: true}).customGET('initialdata/' + $window.navigator.language);
                }
            }
        };
    }]);
/**
 * Created by tflorin on 4/29/2015.
 */

angular.module('txServices.resources')
    .factory('profileService', ["Restangular", function(Restangular){
        'use strict';
        var profile = Restangular.all('userprofile/profile');

        return {
            //Prevent TenantId from being passed up, the api requires that TenantId not be there
            getProfile: function(){
                return profile.customGET('',{},{
                    TenantId:false
                }).then(
                    function(result){
                        result.birthday = new Date(result.birthday);
                        return result;
                    }
                );
            },
            //Prevent TenantId from being passed up, the api requires that TenantId not be there
            getTenants: function(id){
                return profile.one(''+id).withHttpConfig({cache: true}).getList('tenants', {}, { TenantId:false});
            }
        };
    }]);
/**
 * Created by tflorin on 4/29/2015.
 */
angular.module('txServices.resources')
    .factory('sessionService', ["loginState", "homeState", "localStorageService", "$q", "$state", "accountService", "profileService", "countryLanguageService", "gettextCatalog", function(loginState,
                                        homeState,
                                        localStorageService,
                                        $q,
                                        $state,
                                        accountService,
                                        profileService,
                                        countryLanguageService,
                                        gettextCatalog){
        'use strict';
        var tokenInfo = {
            token: '',
            expires: 0
        };
        var userInfo = {
            id: '',
            userName: '',
            password: '',
            image: '',
            realName: '',
            currentTenant: '',
            webSiteLanguage:''
        };

        var nextState = homeState;

        var getLocalStorageInfo = function(){

            tokenInfo = localStorageService.get('token');
            userInfo = localStorageService.get('userInfo');
            if(!tokenInfo || !userInfo){
                resetInfo();
            }
        };

        //This is used when the pages first load to get
        var setgettextLanguage = function(language, success, error){
            var isoCode = language.isoCode;
            //Sometimes this function gets called more than once.
            if(gettextCatalog.currentLanguage !== isoCode) {
                gettextCatalog.setCurrentLanguage(isoCode);
                if (isoCode === undefined && isoCode.toLowerCase() !== 'en-us') {
                    return gettextCatalog.loadRemote('/languages/' + isoCode.toLowerCase() + '.json').then(success, error);
                }
            }
        };

        var setWebSiteLanguage = function(language){
            setUserLanguage(language);
            setgettextLanguage(language,angular.noop,function(){
                throw Error('Language '+language.englishName+' is not supported');
            });
        };
        var resetInfo = function(){
            tokenInfo = {
                token: '',
                expires: 0
            };
            userInfo = {
                id: '',
                userName: '',
                password: '',
                image: '',
                realName: '',
                currentTenant: '',
                webSiteLanguage:''
            };
        };

        var getNextState = function(){
            return nextState;
        };

        var setNextState = function(state){
            nextState = state;
        };

        var saveLocalStorageInfo = function(){
            localStorageService.set('token', tokenInfo);
            localStorageService.set('userInfo', userInfo);
        };

        var deleteLocalStorageInfo = function(){
            localStorageService.remove('token');
            localStorageService.remove('userInfo');
        };

        var getTokenPromise = function(){
            var deferred = $q.defer();
            getLocalStorageInfo();
            if(needNewToken()) {
                if(requestNewToken()){
                    deferred.resolve(tokenInfo.token);
                }else{
                    deferred.reject();
                }
            }else{
                deferred.resolve(tokenInfo.token);
            }
            return deferred.promise;
        };

        var getToken = function(){
            return tokenInfo.token;
        };

        var getUserName = function(){
            return userInfo.userName;
        };

        var getTenant = function(){
            return userInfo.currentTenant;
        };

        var getId = function(){
            return userInfo.id;
        };

        var setId = function(id){
            userInfo.id = id;
            saveLocalStorageInfo();
        };

        var setToken = function(token, expireDate){
            tokenInfo.token = token;
            tokenInfo.expires = new Date().getTime() + (expireDate * 1000);
            saveLocalStorageInfo();
        };

        var setUserInfo = function(userName, image, realName, password, tenant){
            userInfo.userName = userName;
            userInfo.image = image;
            userInfo.realName = realName;
            if(password){
                userInfo.password = password;
            }
            if(tenant){
                userInfo.currentTenant = tenant;
            }
            saveLocalStorageInfo();
        };

        var setUserLanguage = function(webSiteLanguage){
            userInfo.webSiteLanguage = webSiteLanguage;
            saveLocalStorageInfo();
        };
        var setPassword = function(password){
            userInfo.password = password;
            saveLocalStorageInfo();
        };

        var setImage = function(img){
            userInfo.image = img;
            saveLocalStorageInfo();
        };

        var setRealName = function(realName){
            userInfo.realName = realName;
            saveLocalStorageInfo();
        };

        var setTenant = function(tenant){
            userInfo.currentTenant = tenant;
            saveLocalStorageInfo();
        };

        var getUserInfo = function(){
            var deferred = $q.defer();
            getLocalStorageInfo();
            if(!userInfo.id || userInfo.id === '') {
                requestUserInfo().then(
                    function(result){
                        userInfo.id = result.id;
                        setId(result.id);
                        setUserInfo(result.userName, result.imageUrl, result.realName);
                        setWebSiteLanguage(result.webSiteLanguage);
                        saveLocalStorageInfo();
                        deferred.resolve(userInfo);
                    },
                    function(){
                        deleteLocalStorageInfo();

                        $state.go(loginState);
                        deferred.reject();
                    }
                );
            }else{
                setgettextLanguage(userInfo.webSiteLanguage);
                deferred.resolve(userInfo);
            }
            return deferred.promise;
        };

        var refreshUserInfo = function(){
            deleteLocalStorageInfo();
            resetInfo();
            getUserInfo();
        };

        var needNewToken = function(){
            getLocalStorageInfo();
            if (tokenInfo.token === ''){
                return true;
            }
            var expireDate = tokenInfo.expires;
            return expireDate < new Date().getTime();
        };

        var requestNewToken = function(){
            accountService.token(userInfo.userName, userInfo.password).then(
                function(result){
                    tokenInfo.token = result.data.access_token;
                    tokenInfo.expires = new Date().getTime() + (result.data.expires_in * 1000);
                    userInfo.userName = result.data.userName;
                    saveLocalStorageInfo();
                    return true;
                },
                function(){
                    deleteLocalStorageInfo();
                    $state.go(loginState);
                    return false;
                }
            );
        };

        var requestUserInfo = function(){
            return profileService.getProfile();
        };

        var logIn = function(user, password){
            var deferred = $q.defer();
            accountService.token(user, password).then(
                function(result){
                    tokenInfo.token = result.data.access_token;
                    tokenInfo.expires = new Date().getTime() + (result.data.expires_in * 1000);
                    userInfo.userName = result.data.userName;
                    saveLocalStorageInfo();
                    deferred.resolve();
                    $state.go(nextState);
                },
                function(result){
                    deleteLocalStorageInfo();
                    deferred.reject(result);
                    $state.go(loginState);
                }
            );

            return deferred.promise;
        };

        var logout = function(){
            deleteLocalStorageInfo();
            resetInfo();
            $state.go(loginState);
        };


        var session = {
            getToken: getToken,
            getTokenPromise: getTokenPromise,
            setToken: setToken,
            needNewToken: needNewToken,
            getNextState: getNextState,
            setNextState: setNextState,
            setUserInfo: setUserInfo,
            getUserInfo: getUserInfo,
            refreshUserInfo: refreshUserInfo,
            getId: getId,
            setId: setId,
            getUserName: getUserName,
            setPassword: setPassword,
            setRealName: setRealName,
            setImage: setImage,
            getTenant: getTenant,
            setTenant: setTenant,
            logIn: logIn,
            logout: logout,
            setWebSiteLanguage:setWebSiteLanguage
        };

        return session;
    }]);
/**
 * Created by tflorin on 4/29/2015.
 */
angular.module('txServices.common',[]);
/**
 * Created by tflorin on 4/29/2015.
 */

angular.module('txServices.common')
    .factory('baseRoute', ["$location", "baseRouteConfig", function($location,baseRouteConfig){
        'use strict';

        function apiRoute() {
            return baseRouteConfig;
        }

        function webRoute() {
            var webroute = $location.protocol() + '://' + $location.host() + ':'+ $location.port();
            return webroute;
        }

        var service = {
            apiRoute: apiRoute,
            webRoute: webRoute,
            hasBase:function(route){
                return route.search($location.host()) > -1;
            }
        };
        return service;
    }]);

/**
 * Created by tflorin on 4/29/2015.
 */
angular.module('txServices.common').factory('element',function(){
    'use strict';
    return {
        isElementInViewport: function (el, parentElement) {
            var rect = el[0].getBoundingClientRect();
            return {
                pastTop: rect.top <= parentElement[0].getBoundingClientRect().top,
                pastBottom: rect.bottom >= parentElement[0].getBoundingClientRect().bottom /*or $(window).height() */
            };
        }
    };
});
/**
 * Created by tflorin on 4/29/2015.
 */
/**
 * Created by tflorin on 3/26/2015.
 */
angular.module('txServices.common').factory('txList',function(){
    'use strict';
    var txList = function(){
        Array.call(this);
    };
    txList.prototype = Object.create(Array.prototype);
    txList.prototype.constructor = txList;

    txList.prototype.removeItem = function(item){
        this.splice(this.indexOf(item), 1);
    };

    txList.prototype.remove = function(index){
        this.splice(index,1);
    };

    txList.prototype.addRange = function(list){
        for(var i = 0; i < list.length; i++){
            this.push(list[i]);
        }
    };

    txList.prototype.findBy = function(property, value){
        for(var i = 0; i < this.length; i++){
            if(this[i][property] === value){
                return this[i];
            }
        }
    };

    txList.prototype.removeAll = function(list){

        if(list) {
            for (var i = 0; i < list.length; i++) {
                this.removeItem(list[i]);
            }
        }else{
            this.length = 0;
        }
    };

    txList.prototype.addArray = function(list){
        this.length = 0;
        this.addRange(list);
    };


    return txList;
});
/**
 * Created by tflorin on 6/23/2015.
 */
angular.module('txServices.common').factory('objectService',function(){
    'use strict';
    return {
        getPropValue:function(obj, propName){
            return _.reduce(propName.split('.'),function(obj,name){return obj[name];},obj);
        }
    };
});
/**
 * Created by tflorin on 4/30/2015.
 */
angular.module('txServices.common').factory('url',function(){
    'use strict';
    return {
        encodeFromObject:function(obj){
            if ( ! angular.isObject( obj ) ) {
                return( ( obj === null ) ? '' : obj.toString() );
            }

            var buffer = [];

            // Serialize each key in the object.
            for ( var name in obj ) {
                if ( ! obj.hasOwnProperty( name ) ) {
                    continue;
                }

                var value = obj[ name ];

                buffer.push(
                    encodeURIComponent( name ) + '=' + encodeURIComponent( ( value === null ) ? '' : value )
                );
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join( '&' ).replace( /%20/g, '+' );
            return( source );
        }
    };
});
/**
 * Created by tflorin on 6/15/2015.
 */
angular.module('txServices.common').factory('uuid',function() {
    'use strict';
    return {
    generate:function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); /*jshint ignore:line*/
                return v.toString(16);
            });
        }
    };
});