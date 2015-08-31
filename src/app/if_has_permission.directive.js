(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .directive('ifHasPermission', function(ngIfDirective, userPermissions) {
      var ngIfDirective = ngIfDirective[0];

      function has(userPerms, requiredPerms) {
        if (typeof requiredPerms === 'string') {
          return hasOne(userPerms, requiredPerms);

        } else if (requiredPerms instanceof Array) {

          return requiredPerms.some(function(perm) {
            return hasOne(userPerms, perm);
          });
        }
      }

      function hasOne(userPerms, perm) {
        return userPerms.indexOf(perm) !== -1;
      }

      function evalRequiredPermissions(scope, attr) {
        return scope.$eval(attr.ifHasPermission);
      }

      return {
        transclude: ngIfDirective.transclude,
        priority: ngIfDirective.priority - 1,
        terminal: ngIfDirective.terminal,
        restrict: ngIfDirective.restrict,
        link: function($scope, $element, $attr) {

          var ngIf = $attr.ngIf ? $scope.$eval($attr.ngIf) : true;

          $attr.ngIf = function() {
            var userPerms = userPermissions.get();
            var requiredPerms = evalRequiredPermissions($scope, $attr);

            return ngIf && has(userPerms, requiredPerms);
          }

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);