angular.module('baseApp.shared.txDropDown', ['js/shared/directives/txDropDown/_txDropDown.html', 'js/shared/directives/txDropDown/_txDropDownItem.html']);

angular.module("js/shared/directives/txDropDown/_txDropDown.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/txDropDown/_txDropDown.html",
    "<ul ng-transclude class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu\"\n" +
    "    ng-class=\"{'topLevel' : txDropDownCtrl.topLevel,\n" +
    "               'embedMenuBorder' : txDropDownCtrl.embed,\n" +
    "               'dropdownLight' :txDropDownCtrl.light }\"></ul>");
}]);

angular.module("js/shared/directives/txDropDown/_txDropDownItem.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/txDropDown/_txDropDownItem.html",
    "<li ng-class=\"{'dropdown-submenu' : txDropDownItemCtrl.isParent, 'vert' : txDropDownItemCtrl.vert}\">\n" +
    "      <a  ng-transclude ng-click=\"txDropDownItemCtrl.itemClick()\" href=\"#\"></a>\n" +
    "</li>");
}]);

"use strict";angular.module("baseApp.shared").directive("txDropDown",function(){return{require:"^?txDropDownItem",restrict:"E",transclude:!0,scope:{itemSelected:"&",verticalMenu:"=",embed:"=",light:"="},replace:!0,templateUrl:"js/shared/directives/txDropDown/_txDropDown.html",controllerAs:"txDropDownCtrl",bindToController:!0,controller:function(){var a=this;a.topLevel=!1},link:function(a,b,c,d){angular.isDefined(a.txDropDownCtrl.embed)||(a.txDropDownCtrl.embed=!1),null!==d?(d.isParent=!0,angular.isDefined(a.txDropDownCtrl.verticalMenu)&&(d.vert=a.txDropDownCtrl.verticalMenu)):(a.txDropDownCtrl.topLevel=!0,b.attr("role","menu"))}}}).directive("txDropDownItem",function(){return{require:"^txDropDown",restrict:"E",scope:{name:"@"},transclude:!0,replace:!0,controllerAs:"txDropDownItemCtrl",bindToController:!0,templateUrl:"js/shared/directives/txDropDown/_txDropDownItem.html",controller:function(){var a=this;a.isParent=!1,a.vert=!1},link:function(a,b,c,d){a.txDropDownItemCtrl.itemClick=function(){angular.isDefined(a.txDropDownItemCtrl.name)&&d.itemSelected({$item:a.txDropDownItemCtrl.name})}}}});