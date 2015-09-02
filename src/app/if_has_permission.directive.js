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

      function _isBooleanExpr(str) {
        if (typeof str !== 'string') {
          return false;
        }

        return str.indexOf('&') !== -1 || str.indexOf('|') !== -1;
      }

      function _optimizeExpr(str) {
        return str.replace(/\&/g, '&&').replace(/\|/g, '||').replace(/\'/g, '');
      }

      function _toPermsHash(array) {
        return array.reduce(function(hash, perm) {
          hash[perm] = true;

          return hash;
        }, {});
      }

      vm.evalBoolPermission = function(expr, perms) {
        var cleanExpr = _optimizeExpr(expr);
        var permsHash = _toPermsHash(perms);

        return $parse(cleanExpr)(permsHash);
      };

      vm.has = function(userPerms, requiredPermsExpr) {
        if(_isBooleanExpr(requiredPermsExpr)) {
          return this.evalBoolPermission(requiredPermsExpr, userPerms);
        }

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
          scope.currentAccess = ctrl.has(userPermissions.get(), attr.ifHasPermission);

          attr.ngIf = 'currentAccess';

          ngIfDirective.link.apply(null, arguments);
        }
      };
    });

})(angular);