angular.module('baseApp.shared.usercomment', ['js/shared/directives/usercomment/_commentreply.html']);

angular.module("js/shared/directives/usercomment/_commentreply.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/usercomment/_commentreply.html",
    "<div class=\"comment-reply row\">\n" +
    "    <a ng-click=\"show=true\">Reply</a>\n" +
    "    <div ng-show=\"show\" class=\"row\">\n" +
    "        <img ng-src=\"{{imageUrl}}\" />\n" +
    "        <textarea ng-model=\"response\"></textarea>\n" +
    "        <div class=\"row\">\n" +
    "            <button ng-click=\"replyClick()\">Reply</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("baseApp.shared").directive("userComment",function(){"use strict";return{restrict:"E",transclude:!0,scope:{id:"=",image:"@?",defaultImage:"@?"},bindToController:!0,controllerAs:"userCommentCtrl",controller:function(){var a=this;a.getImage=function(){return a.defaultImage||a.image}},template:'<div class="comment-item" ng-transclude></div>'}}).directive("commentBody",function(){"use strict";return{restrict:"E",require:"^userComment",transclude:!0,scope:{userImage:"@"},template:'<div class="comment-body row"><img ng-src="{{userImage}}"/><div class="text"></div></div>',link:function(a,b,c,d,e){a.userImage||(a.userImage=d.defaultImage),e(function(a){var c=angular.element(b.find("div")[0].querySelector(".text"));c.append(a)})}}}).directive("commentHeader",function(){"use strict";return{restrict:"E",scope:{},require:"^userComment",transclude:!0,template:'<div class="comment-header row" ng-transclude></div>'}}).directive("commentReply",function(){"use strict";return{restrict:"E",scope:{click:"&"},require:"^userComment",templateUrl:"js/shared/directives/usercomment/_commentreply.html",link:function(a,b,c,d){a.show=!1,a.imageUrl=d.getImage(),a.replyClick=function(){a.click({$response:{response:a.response,commentId:d.id}}),a.show=!1,a.response=""}}}});