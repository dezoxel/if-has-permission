(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .service('userPermissions', function() {

      var userPermissions = this;

      userPermissions._list = [];

      userPermissions.set = function(permsList) {
        this._list = permsList;

        return this;
      };

      userPermissions.get = function() {
        return this._list;
      };

      userPermissions.addOne = function(perm) {
        this._list.push(perm);

        return this;
      };

      userPermissions.removeByName = function(perm) {
        var index = this._list.indexOf(perm);

        if (index > -1) {
          this._list.splice(index, 1);
        }

        return this;
      };

    });
})(angular);