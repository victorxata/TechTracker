angular.module("baseApp.shared").directive("passwordStrength",function(){"use strict";return{restrict:"A",require:"ngModel",link:function(a,b,c,d){var e=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;d.$validators.passwordStrength=function(a){return e.test(a)}}}});