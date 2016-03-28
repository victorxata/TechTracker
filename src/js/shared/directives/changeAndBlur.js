/**
 * Created by victorzaragoza on 31/07/2015.
 */
(function(){
    'use strict';

    angular.module('txAdmin', [])
    .directive('ngChangeOnBlur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs) {
            console.log('inside');
            if (attrs.type === 'radio' || attrs.type === 'checkbox')
                return;

            var expressionToCall = attrs.ngChangeOnBlur;

            var oldValue = null;
            elm.bind('focus',function() {
                scope.$apply(function() {
                    oldValue = elm.val();
                    console.log(oldValue);
                });
            });
            elm.bind('blur', function() {
                scope.$apply(function() {
                    var newValue = elm.val();
                    console.log(newValue);
                    if (newValue != oldValue){
                        scope.$eval(expressionToCall);
                    }
                });
            });
        }
    };
    }
)});