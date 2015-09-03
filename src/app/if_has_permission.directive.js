(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('ifHasPermissionController', function($parse) {
      var vm = this;

      function _toPermsList(permsExpr) {
        var requiredPerms = $parse(permsExpr)();

        if (requiredPerms instanceof Array) {
          return requiredPerms;
        } else if (typeof requiredPerms === 'string') {
          return [requiredPerms];
        } else {
          return [];
        }
      }

      function _isBooleanPerm(expr) {
        if (typeof expr !== 'string') {
          return false;
        }

        return expr.indexOf('&') !== -1 || expr.indexOf('|') !== -1;
      }

      // 1. We make support both, bitwise and logical operators (|, ||, &, &&)
      // 2. Convert to logical operators (&& ||) because angular uses "|" as filter separator
      // 3. Remove single quotes, because it is not possible to parse it correctly
      function _normalize(expr) {
        return expr.replace(/\&+/g, '&&').replace(/\|+/g, '||').replace(/\'/g, '');
      }

      // needed for evaluating boolean expr
      // ['add', 'edit'] -> {add: true, edit: true}
      function _toPermsHash(array) {
        return array.reduce(function(hash, perm) {
          hash[perm] = true;

          return hash;
        }, {});
      }

      vm.hasBoolPermission = function(expr, perms) {
        if (typeof expr !== 'string'  || !(perms instanceof Array)) {
          return false;
        }

        var normalizedExpr = _normalize(expr);
        var permsHash = _toPermsHash(perms);

        try {
          return Boolean($parse(normalizedExpr)(permsHash));
        } catch (e) {
          return false;
        }
      };

      vm.has = function(userPerms, requiredPermsExpr) {
        if(_isBooleanPerm(requiredPermsExpr)) {
          return this.hasBoolPermission(requiredPermsExpr, userPerms);
        }

        var requiredPerms = _toPermsList(requiredPermsExpr);

        return this.hasAnyPermissionFrom(requiredPerms, userPerms);
      };

      vm.hasAnyPermissionFrom = function(requiredPerms, userPerms) {
        if (!(requiredPerms instanceof Array)) {
          return false;
        }

        return requiredPerms.some(function(perm) {
          return vm.hasPermission(perm, userPerms);
        }, this);
      };

      vm.hasPermission = function(permission, userPerms) {
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
          scope.currentAccess = ctrl.has(userPermissions.get(), attr.ifHasPermission);

          attr.ngIf = 'currentAccess';

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);