angular.module('baseApp.shared.fileUploader', ['js/shared/directives/fileUploader/_fileUploader.html']);

angular.module("js/shared/directives/fileUploader/_fileUploader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/shared/directives/fileUploader/_fileUploader.html",
    "<input ng-disabled=\"disable\" type=\"file\" id=\"fileSelector\" onchange=\"angular.element(this).scope().setFile(this);\">");
}]);

angular.module("baseApp.shared").directive("fileUploader",function(){"use strict";return{restrict:"EA",templateUrl:"js/shared/directives/fileUploader/_fileUploader.html",scope:{onUpload:"&",disable:"="},controller:["$scope",function(a){a.working=!1,a.setFile=function(b){a.$apply(function(a){a.files=b.files,a.files.length>0&&a.sendFiles(a.files)})},a.sendFiles=function(b){for(var c=new FormData,d=0;d<b.length;d++)c.append("file"+d,b[d]);a.onUpload({$files:c})}}]}});