(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('ifHasPermissionController', function($scope) {
      var vm = this;

      function _toPermsList(permsExpr) {
        if (permsExpr instanceof Array) {
          return permsExpr;
        } else if (typeof permsExpr === 'string') {
          return [permsExpr];
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
        scope: {},
        link: function(scope, element, attr, ctrl) {

          scope.$watch(attr.ifHasPermission, function(requiredPermsExpr) {
            scope.currentAccess = ctrl.has(userPermissions.get(), requiredPermsExpr);
          });

          attr.ngIf = 'currentAccess';

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);