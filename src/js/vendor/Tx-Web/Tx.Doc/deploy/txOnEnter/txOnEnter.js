angular.module("baseApp.shared").directive("txOnEnter",function(){"use strict";return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.txOnEnter)}),b.preventDefault())})}});