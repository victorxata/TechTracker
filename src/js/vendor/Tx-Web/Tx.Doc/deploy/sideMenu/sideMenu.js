angular.module('baseApp.shared.sideMenu', ['js/shared/directives/sideMenu/_sideMenu.html']);

angular.module("js/shared/directives/sideMenu/_sideMenu.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/sideMenu/_sideMenu.html",
    "<div class=\"sideMenu\">\n" +
    "    <h1>Tx<strong>Doc</strong></h1>\n" +
    "    <ul>\n" +
    "\n" +
    "    </ul>\n" +
    "</div>");
}]);

"use strict";angular.module("baseApp.shared").directive("sideMenu",["$state","$compile",function(a,b){return{restrict:"E",scope:{},replace:!0,link:function(c,d){var e=a.get(),f=d.find("ul");e=_.filter(e,function(a){return!a["abstract"]}),angular.forEach(e,function(a){var d=a.data&&a.data.title?a.data.title:a.name,e='<li ui-sref-active-eq="active"><a href="" ui-sref="'+a.name+'">'+d+"</a></li>",g=b(e);f.append(g(c))})},templateUrl:"js/shared/directives/sideMenu/_sideMenu.html"}}]);