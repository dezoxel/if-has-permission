(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('ifHasPermissionController', function($scope) {
      var vm = this;

      function _toPermsList(permsString) {
        var value = $scope.$eval(permsString);

        if (value instanceof Array) {
          return value;
        } else if (typeof value === 'string') {
          return [value];
        } else {
          return [];
        }
      }

      vm.has = function(userPerms, requiredPermsExpr) {
        var requiredPerms = _toPermsList(requiredPermsExpr);

        return this.isAllowedToAnyOf(requiredPerms, userPerms);
      };

      vm.isAllowedToAnyOf = function(requiredPerms, userPerms) {
        if (!(requiredPerms instanceof Array)) {
          return false;
        }

        return requiredPerms.some(function(perm) {
          return vm.isAllowedTo(perm, userPerms);
        }, this);
      };

      vm.isAllowedTo = function(permission, userPerms) {
        if (userPerms instanceof Array) {
          return userPerms.indexOf(permission) !== -1;
        }

        return false;
      };
    })
    .directive('ifHasPermission', function(ngIfDirective, userPermissions) {
      ngIfDirective = ngIfDirective[0];

      return {
        transclude: ngIfDirective.transclude,
        priority: ngIfDirective.priority - 1,
        terminal: ngIfDirective.terminal,
        restrict: ngIfDirective.restrict,
        controller: 'ifHasPermissionController as vm',
        link: function(scope, element, attr, ctrl) {

          var ngIf = attr.ngIf ? scope.$eval(attr.ngIf) : true;

          attr.ngIf = function() {
            var userPerms = userPermissions.get();
            var requiredPermsExpr = attr.ifHasPermission;

            return ngIf && ctrl.has(userPerms, requiredPermsExpr);
          };

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);