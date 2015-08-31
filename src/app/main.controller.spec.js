(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('ifHasPermission'));

    it('has sinon support',  function() {
      var stub = sinon.stub().returns(25);

      expect(stub()).to.equal(25);
    });
  });
})();
