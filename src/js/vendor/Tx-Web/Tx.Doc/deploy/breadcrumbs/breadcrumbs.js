angular.module('baseApp.shared.breadcrumbs', ['js/shared/directives/breadcrumbs/_breadcrumbs.html']);

angular.module("js/shared/directives/breadcrumbs/_breadcrumbs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/breadcrumbs/_breadcrumbs.html",
    "<ul id=\"tx-breadcrumb\" class=\"breadcrumb\">\n" +
    "    <li ng-repeat=\"state in $state.$current.path\">\n" +
    "        <a ng-if=\"!$last\" href=\"#{{state.url.format($stateParams)}}\">{{getTranslatedText(state.data.title)}}</a>\n" +
    "        <p ng-if=\"$last\">{{getLastTitle(state.data.title)}}</p>\n" +
    "        <span ng-if=\"!$last\" class=\"divider\">/</span>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("baseApp.shared").directive("txBreadcrumb",["gettextCatalog","txBreadCrumbService",function(a,b){"use strict";return{restrict:"E",scope:!0,templateUrl:"js/shared/directives/breadcrumbs/_breadcrumbs.html",replace:!0,link:function(c){c.getTranslatedText=function(b){return a.getString(b)},c.getLastTitle=function(c){var d=b.getLastCrumb();return""!==d?d:a.getString(c)}}}}]).factory("txBreadCrumbService",function(){"use strict";var a="";return{getLastCrumb:function(){return a},replaceLastCrumb:function(b){a=b},clearLastCrumb:function(){a=""}}});