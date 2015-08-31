(function() {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('MainController', function(userPermissions) {
      console.log('User perms:', userPermissions.get());
    });

})();
