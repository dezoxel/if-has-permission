describe('userPermissions', function () {
  'use strict';

  beforeEach(module('ifHasPermission'));

  beforeEach(inject(function(userPermissions) {
    this.userPermissions = userPermissions;
  }));

  it('has default permissions list', function() {
    expect(this.userPermissions.get().length).not.to.equal(0);
  });

  describe('work with not default perms list', function() {
    beforeEach(function() {
      this.perms = ['add', 'edit', 'delete'];
      this.userPermissions.set(this.perms);
    });

    it('#set and #get', function() {
      expect(this.userPermissions.get()).to.deep.equal(this.perms);
    });

    it('#addOne', function() {
      this.userPermissions.addOne('publish');

      var lastIndex = this.userPermissions.get().length - 1;
      var lastPermission = this.userPermissions.get()[lastIndex];

      expect(lastPermission).to.deep.equal('publish');
    });

    describe('#removeByName', function() {
      context('permission is contained in the list', function() {
        it('removes permission from the list', function() {
          this.userPermissions.removeByName('edit');

          expect(this.userPermissions.get()).to.deep.equal(['add', 'delete']);
        });
      });

      context('permission is NOT contained in the list', function() {
        it('not removes permission from the list', function() {
          this.userPermissions.removeByName('hello');

          expect(this.userPermissions.get()).to.deep.equal(['add', 'edit', 'delete']);
        });
      });
    });
  });
});