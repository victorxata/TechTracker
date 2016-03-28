angular.module('baseApp.shared.txAccordion', ['js/shared/directives/txAccordion/_txAccordion.html', 'js/shared/directives/txAccordion/_txAccordionItem.html']);

angular.module("js/shared/directives/txAccordion/_txAccordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/txAccordion/_txAccordion.html",
    "<div class=\"txAccordion\" ng-transclude>\n" +
    "\n" +
    "</div>");
}]);

angular.module("js/shared/directives/txAccordion/_txAccordionItem.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/txAccordion/_txAccordionItem.html",
    "<div class=\"item\" ng-class=\"{'open':selected}\">\n" +
    "    <div class=\"txAccHeader\" ng-click=\"select()\">\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"content\" ng-transclude>\n" +
    "    </div>\n" +
    "</div>");
}]);

"use strict";angular.module("baseApp.shared").directive("txAccordion",function(){return{restrict:"E",transclude:!0,scope:{},controller:["$scope","$attrs",function(a,b){var c=this,d=a.items=[];this.template="<p>{{txTitle}}</p>",this.select=function(a){return a.selected?void(a.selected=!1):(angular.isDefined(b.autoCollapse)&&"true"!==b.autoCollapse||angular.forEach(d,function(a){a.selected=!1}),void(a.selected=!0))},this.addItem=function(a){0===d.length,d.push(a)},this.setHeaderTemplate=function(a){this.template=a},a.$on("$destroy",function(){c.template=null,d=null})}],replace:!0,templateUrl:"js/shared/directives/txAccordion/_txAccordion.html",controllerAs:"txAccodionCtrl"}}).directive("txAccordionItem",["$compile",function(a){return{require:"^txAccordion",restrict:"E",transclude:!0,scope:!0,link:function(b,c,d,e){(angular.isDefined(d.expand)||"true"===d.expand)&&(b.selected=!0),e.addItem(b);var f="";f=d.title?'<label class="AccHeaderTemplate">'+d.title+"</label>":a(e.template)(b),c.find("div").eq(0).append(f),b.select=function(){e.select(b)},b.$on("$destroy",function(){c.off(),c=null})},replace:!0,templateUrl:"js/shared/directives/txAccordion/_txAccordionItem.html"}}]).directive("txAccordionHeaderTemplate",function(){return{require:"^txAccordion",restrict:"E",scope:{},link:function(a,b,c,d){b.remove(),d.setHeaderTemplate(b.html()),a.$on("$destroy",function(){b.off(),b=null})}}});