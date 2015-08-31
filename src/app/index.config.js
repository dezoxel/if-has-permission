(function() {
  'use strict';

  angular
    .module('ifHasPermission')
    .run(function(userPermissions, DefaultPermissions) {
      userPermissions.set(DefaultPermissions);
    });
})();
