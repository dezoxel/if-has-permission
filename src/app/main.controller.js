(function() {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('MainController', function(userPermissions) {
      this.userPermissions = userPermissions;
    });
})();
