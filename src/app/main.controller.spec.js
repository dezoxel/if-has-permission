(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('ifHasPermission'));

    beforeEach(inject(function($controller) {
      this.userPermissions = {this: 'is', user: 'permissions'};

      this.ctrl = $controller('MainController', {userPermissions: this.userPermissions});
    }));

    it('stores userPermissions as the property',  function() {
      expect(this.ctrl.userPermissions).to.deep.equal(this.userPermissions);
    });
  });
})();
