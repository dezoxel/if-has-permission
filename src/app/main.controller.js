(function() {
  'use strict';

  angular
    .module('ifHasPermission')
    .controller('MainController', function(userPermissions) {
      console.log('Initial perms:', userPermissions.get());

      userPermissions.set(['A', 'B', 'C']);
      console.log('Fully updated perms:', userPermissions.get());

      userPermissions.addOne('D');
      console.log('Added one perm:', userPermissions.get());

      userPermissions.removeByName('B');
      console.log('Removed one perm:', userPermissions.get());
    });

})();
