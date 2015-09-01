describe('ifHasPermission', function () {
  'use strict';

  beforeEach(module('ifHasPermission'));

  var scope;
  var ctrl;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('ifHasPermissionController', {
      $scope: scope,
      $attrs: {ifHasPermission: "'edit'"}
    });
  }));

  beforeEach(function() {
    this.userPermissions = ['add', 'edit', 'view'];
  });

  describe('#isAllowedTo', function(){

    context('given valid arguments', function() {

      context('when permission is contained in the list', function() {

        it('allows access', function(){
          expect(ctrl.isAllowedTo('edit', this.userPermissions)).to.equal(true);
        });
      });

      context('when permission is NOT contained in the list', function() {

        it('denies access', function(){
          expect(ctrl.isAllowedTo('admin', this.userPermissions)).to.equal(false);
        });
      });
    });

    context('given invalid arguments', function() {

      describe('required permission', function() {
        var specs = [
          {context: 'empty string', perm: ''},
          {context: 'undefined', perm: undefined},
          {context: 'null', perm: null},
          {context: 'any object', perm: {hello: 'world'}},
          {context: 'array', perm: [1,2,3]},
          {context: 'number', perm: 123}
        ];

        specs.forEach(function(spec) {
          context('when ' + spec.context + ' specified', function() {
            it('denies access', function() {
              expect(ctrl.isAllowedTo(spec.perm, ['view'])).to.equal(false);
            });
          });
        });
      });

      describe('user permissions', function() {
        var specs = [
          {context: 'empty string', perms: ''},
          {context: 'undefined', perms: undefined},
          {context: 'null', perms: null},
          {context: 'any object', perms: {hello: 'world'}},
          {context: 'some string', perms: 'aloha'},
          {context: 'number', perms: 123}
        ];

        specs.forEach(function(spec) {
          context('when ' + spec.context + ' specified', function() {
            it('denies access', function() {
              expect(ctrl.isAllowedTo('view', spec.perms)).to.equal(false);
            });
          });
        });
      });
    });
  });

  describe('#isAllowedToAnyOf', function() {
    context('given valid arguments', function() {

      context('when user has all permissions from the list', function() {
        it('allows access', function() {
          expect(ctrl.isAllowedToAnyOf(['add', 'view'], this.userPermissions)).to.equal(true);
        });
      });

      context('when user has a few permissions from the list', function() {
        it('allows access', function() {
          expect(ctrl.isAllowedToAnyOf(['add', 'view', 'delete', 'publish'], this.userPermissions)).to.equal(true);
        });
      });

      context('when user has only one permission from the list', function() {
        it('allows access', function() {
          expect(ctrl.isAllowedToAnyOf(['delete', 'view', 'publish'], this.userPermissions)).to.equal(true);
        });
      });

      context('when user doesnt have any of the required permissions', function() {
        it('denies access', function() {
          expect(ctrl.isAllowedToAnyOf(['delete', 'ban', 'publish'], this.userPermissions)).to.equal(false);
        });
      });

      context('when user permissions is empty', function() {
        it('denies access', function() {
          expect(ctrl.isAllowedToAnyOf(['delete', 'view', 'publish'], [])).to.equal(false);
        });
      });

      context('when required permissions is empty', function() {
        it('denies access', function() {
          expect(ctrl.isAllowedToAnyOf([], this.userPermissions)).to.equal(false);
        });
      });
    });

    context('given invalid arguments', function() {
      var specs = [
        {context: 'empty string', perms: ''},
        {context: 'undefined', perms: undefined},
        {context: 'null', perms: null},
        {context: 'any object', perms: {hello: 'world'}},
        {context: 'some string', perms: 'aloha'},
        {context: 'number', perms: 123}
      ];

      describe('required permissions', function() {
        specs.forEach(function(spec) {
          context('when ' + spec.context + ' specified', function() {
            it('denies access', function() {
              expect(ctrl.isAllowedToAnyOf(spec.perms, ['view'])).to.equal(false);
            });
          });
        });
      });

      describe('user permissions', function() {
        specs.forEach(function(spec) {
          context('when ' + spec.context + ' specified', function() {
            it('denies access', function() {
              expect(ctrl.isAllowedToAnyOf(['view'], spec.perms)).to.equal(false);
            });
          });
        });
      });
    });
  });

  describe('#has', function(){

    beforeEach(function() {
      sinon.stub(ctrl, 'isAllowedToAnyOf');
    });

    afterEach(function() {
      ctrl.isAllowedToAnyOf.restore();
    });

    context('given valid arguments', function() {

      it('uses isAllowedToAnyOf() as the algorithm', function() {
        ctrl.has(this.userPermissions, "'view'");

        expect(ctrl.isAllowedToAnyOf).to.have.been.called;
      });

      context('when permissions expr is string with single quotes', function() {
        it('interprets expr as a single permission', function(){
          ctrl.has(this.userPermissions, "'add'");

          expect(ctrl.isAllowedToAnyOf).to.have.been.calledWith(['add'], this.userPermissions);
        });
      });

      context('when permissions expr is an array inside string', function() {
        it('interprets expr as the list of permissions', function(){
          ctrl.has(this.userPermissions, "['view', 'delete']");

          expect(ctrl.isAllowedToAnyOf).to.have.been.calledWith(['view', 'delete'], this.userPermissions);
        });
      });
    });

    context('given invalid arguments', function() {

      var specs = [
        {context: 'string w/o single quotes', permsExpr: 'add'},
        {context: 'empty string', permsExpr: ''},
        {context: 'null', permsExpr: null},
        {context: 'undefined', permsExpr: undefined},
        {context: 'any object', permsExpr: {hello: 'world'}},
        {context: 'the raw array', permsExpr: [1,2,3]},
        {context: 'any number', permsExpr: 123}
      ];

      specs.forEach(function(spec) {
        context('when permissions expr is ' + spec.context, function() {
          it('acts as empty permissions list', function(){
            ctrl.has(this.userPermissions, spec.permsExpr);

            expect(ctrl.isAllowedToAnyOf).to.have.been.calledWith([], this.userPermissions);
          });
        });
      });
    });
  });
});