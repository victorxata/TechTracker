angular.module('baseApp.shared.imagepreview', ['js/shared/directives/imagepreview/_imagepreview.html']);

angular.module("js/shared/directives/imagepreview/_imagepreview.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/imagepreview/_imagepreview.html",
    "<div data-ng-class=\"{'image-edit':!imagePreviewOnly}\" id=\"selfImage\">\n" +
    "    <div data-ng-show=\"!imagePreviewOnly\" data-ng-class=\"{'image-edit-hover':true,'loading':loading}\">\n" +
    "        <span class=\"ionicons ion-camera\" data-ng-hide=\"loading\"></span>\n" +
    "      <tx-spinner is-loading=\"loading\">\n" +
    "          {{'Change' | translate}}\n" +
    "      </tx-spinner>\n" +
    "    </div>\n" +
    "    <div data-ng-transclude></div>\n" +
    "    <img class=\"img-avatar-large\"  data-ng-src=\"{{imageUrl || '/img/user-placeholder.png'}}\" alt=\"{{altText}}\" />\n" +
    "</div>");
}]);

angular.module("baseApp.shared").directive("imagePreview",function(){"use strict";return{restrict:"E",transclude:!0,templateUrl:"js/shared/directives/imagepreview/_imagepreview.html",scope:{imageUrl:"=",loading:"=",altText:"@?",imagePreviewOnly:"=?"}}});