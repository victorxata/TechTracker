angular.module('baseApp.shared.tabs', ['js/shared/directives/tabs/_txTab.html', 'js/shared/directives/tabs/_txTabSpinner.html', 'js/shared/directives/tabs/_txTabs.html']);

angular.module("js/shared/directives/tabs/_txTab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/tabs/_txTab.html",
    "<li class=\"txTab\" ng-class=\"{'active':active}\" ui-sref-active-eq=\"active\">\n" +
    "    <a ng-if=\"state\" ui-sref=\"{{::state}}\" href=\"\" ng-click=\"updateActive()\">{{title}}</a>\n" +
    "    <a ng-if=\"!state\" href=\"\" ng-click=\"updateActive()\">{{title}}</a>\n" +
    "</li>");
}]);

angular.module("js/shared/directives/tabs/_txTabSpinner.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/tabs/_txTabSpinner.html",
    "<li class=\"txTab\" ng-class=\"{'active':active}\" ui-sref-active-eq=\"active\">\n" +
    "    <a ng-if=\"state\" ui-sref=\"{{::state}}\" href=\"\">\n" +
    "        <tx-spinner is-loading=\"isLoading\">{{::title}}</tx-spinner>\n" +
    "    </a>\n" +
    "    <a ng-if=\"!state\" href=\"\">\n" +
    "        <tx-spinner is-loading=\"isLoading\">{{::title}}</tx-spinner>\n" +
    "    </a>\n" +
    "</li>");
}]);

angular.module("js/shared/directives/tabs/_txTabs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/tabs/_txTabs.html",
    "<div>\n" +
    "    <ul class=\"component-txtabs\" ng-transclude></ul>\n" +
    "    <div ng-if=\"txTabsCtrl.tabs.length > 0\" ng-repeat=\"tab in txTabsCtrl.tabs\" tx-tab-content-transclude=\"tab\" ng-show=\"tab.active\" class=\"tab-content\"></div>\n" +
    "</div>");
}]);

"use strict";angular.module("baseApp.shared").directive("txTabs",function(){return{restrict:"E",scope:{},transclude:!0,controllerAs:"txTabsCtrl",bindToController:!0,require:["?^flyoutContainer","txTabs"],templateUrl:"js/shared/directives/tabs/_txTabs.html",link:function(a,b,c,d){if(null!==d[0]){d[1].isChildOfFlyout=!0,d[1].flyOutType=d[0].type;var e=d[0];a.$watch(function(){return e.collapsed},function(a){a&&d[1].closeAll()})}},controller:["flyOutService",function(a){var b=this;b.isChildOfFlyout=!1,b.tabs=[],b.addTab=function(a){b.tabs.push(a)},b.updateActive=function(c){b.previousActiveTab&&(b.previousActiveTab.active=!1),c.active=!0,b.previousActiveTab=c,b.isChildOfFlyout&&a.isOpen(b.flyOutType)&&a.openPanel(b.flyOutType)},b.closeAll=function(){b.tabs.forEach(function(a){a.active=!1})}}]}}).directive("txTabContentTransclude",function(){return{restrict:"A",require:"^txTabs",link:function(a,b,c){var d=a.$eval(c.txTabContentTransclude);d.$transcludeFn(d,function(a){b.append(a)})}}}).directive("txTab",["$state",function(a){return{restrict:"E",require:"^txTabs",transclude:!0,priority:2,scope:{title:"@",state:"@",isLoading:"="},templateUrl:function(a,b){return angular.isUndefined(b.isLoading)?"js/shared/directives/tabs/_txTab.html":"js/shared/directives/tabs/_txTabSpinner.html"},link:function(b,c,d,e,f){f().length>0&&(b.$transcludeFn=f,b.active=b.state?a.name===b.state:!1,e.addTab(b)),b.updateActive=function(){e.updateActive(b)}}}}]);