(function() {
  'use strict';

  angular
    .module('ifHasPermission')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
