(function(angular) {
  'use strict';

  angular
    .module('ifHasPermission')
    .constant('DefaultPermissions', ['view', 'add', 'edit', 'delete']);
})(angular);