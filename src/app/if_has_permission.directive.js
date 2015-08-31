(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .directive('ifHasPermission', function(ngIfDirective) {
      var ngIfDirective = ngIfDirective[0];

      return {
        transclude: ngIfDirective.transclude,
        priority: ngIfDirective.priority - 1,
        terminal: ngIfDirective.terminal,
        restrict: ngIfDirective.restrict,
        link: function($scope, $element, $attr) {

          var ngIf = evalNgIf();

          // TODO: Implement main logic of directive
          function hasPermission() {
            return $scope.$eval($attr.ifHasPermission);
          }

          function evalNgIf() {
            return $attr.ngIf ? $scope.$eval($attr.ngIf) : true;
          }

          function evalFunction() {
            return ngIf && hasPermission();
          }

          $attr.ngIf = evalFunction;

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);