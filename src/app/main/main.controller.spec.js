(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('ifHasPermission'));

    it('should define more than 5 awesome things', inject(function($controller) {
      var vm = $controller('MainController');

      expect(angular.isArray(vm.awesomeThings)).to.be.ok;
      expect(vm.awesomeThings.length > 5).to.be.ok;
    }));

    it('has sinon support',  function() {
      var stub = sinon.stub().returns(25);

      expect(stub()).to.equal(25);
    });
  });
})();
