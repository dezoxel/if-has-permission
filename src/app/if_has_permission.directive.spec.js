describe('ifHasPermission', function () {
  'use strict';

  beforeEach(module('ifHasPermission'));

  var $scope;
  var ctrl;

  describe('controller', function() {

    beforeEach(inject(function ($rootScope, $controller) {
      $scope = $rootScope.$new();
      ctrl = $controller('ifHasPermissionController', {
        $scope: $scope,
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
            {context: 'nothing', perm: null},
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
            {context: 'nothing', perms: null},
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

    describe('#evalBoolPermission', function() {
      context('given valid arguments', function() {
        function evalBoolPermissionSpecs(specs) {
          specs.forEach(function(spec) {
            context('user ' + spec.context + ' permissions', function() {
              it('evals to ' + spec.result, function() {
                expect(ctrl.evalBoolPermission(spec.expr, this.userPermissions)).to.equal(spec.result);
              });
            });
          });
        }

        describe('two operands, OR', function() {
          evalBoolPermissionSpecs([
            {context: 'has two',        expr: "'add' | 'edit'", result: true},
            {context: 'has one of two', expr: "'add' | 'publish'", result: true},
            {context: 'has no such',    expr: "'ban' | 'publish'", result: false}
          ]);
        });

        describe('two operands, AND', function() {
          evalBoolPermissionSpecs([
            {context: 'has two',        expr: "'add' & 'edit'", result: true},
            {context: 'has one of two', expr: "'add' & 'publish'", result: false},
            {context: 'has no such',    expr: "'ban' & 'publish'", result: false}
          ]);
        });

        describe('three operands, OR', function() {
          evalBoolPermissionSpecs([
            {context: 'has three',        expr: "'add' | 'edit' | 'view'", result: true},
            {context: 'has two of three', expr: "'add' | 'view' | 'publish'", result: true},
            {context: 'has one of three', expr: "'add' | 'publish' | 'admin'", result: true},
            {context: 'has no such',      expr: "'ban' | 'publish' | 'admin'", result: false}
          ]);
        });

        describe('three operands, AND', function() {
          evalBoolPermissionSpecs([
            {context: 'has three',        expr: "'add' & 'edit' & 'view'", result: true},
            {context: 'has two of three', expr: "'add' & 'view' & 'publish'", result: false},
            {context: 'has one of three', expr: "'add' & 'publish' & 'admin'", result: false},
            {context: 'has no such',      expr: "'ban' & 'publish' & 'admin'", result: false}
          ]);
        });

        describe('three operands, OR - AND', function() {
          evalBoolPermissionSpecs([
            {context: 'has three',            expr: "'add' | 'edit' & 'view'", result: true},
            {context: 'has first two',        expr: "'add' | 'view' & 'publish'", result: true},
            {context: 'has first and third',  expr: "'add' | 'publish' & 'view'", result: true},
            {context: 'has second and third', expr: "'ban' | 'add' & 'view'", result: true},
            {context: 'has no such',          expr: "'ban' | 'publish' & 'admin'", result: false}
          ]);
        });

        describe('three operands, AND - OR', function() {
          evalBoolPermissionSpecs([
            {context: 'has three',            expr: "'add' & 'edit' | 'view'", result: true},
            {context: 'has first two',        expr: "'add' & 'view' | 'publish'", result: true},
            {context: 'has first and third',  expr: "'add' & 'publish' | 'view'", result: true},
            {context: 'has second and third', expr: "'ban' & 'add' | 'view'", result: true},
            {context: 'has no such',          expr: "'ban' & 'publish' | 'admin'", result: false}
          ]);
        });

        it('works w/o single quotes', function() {
          expect(ctrl.evalBoolPermission('add & edit | view', this.userPermissions)).to.equal(true);
        });

        it('works w/ logical &&', function() {
          expect(ctrl.evalBoolPermission('add && edit | view', this.userPermissions)).to.equal(true);
        });

        it('works w/ logical ||', function() {
          expect(ctrl.evalBoolPermission('add & edit || view', this.userPermissions)).to.equal(true);
        });

        it('works w/o logical operators', function() {
          expect(ctrl.evalBoolPermission('add', this.userPermissions)).to.equal(true);
        });
      });

      context('given invalid arguments', function() {
        describe('permissions expr', function() {

          var specs = [
            {context: 'empty string', arg: ''},
            {context: 'nothing', arg: null},
            {context: 'array', arg: [1,2,3]},
            {context: 'object', arg: {hello: 'world'}},
            {context: 'number', arg: 123},
            {context: 'any string', arg: 'hello world'}
          ];

          specs.forEach(function(spec) {
            context('when ' + spec.context + ' specified', function() {
              it('evals to false', function() {
                expect(ctrl.evalBoolPermission(spec.arg, this.userPermissions)).to.equal(false);
              });
            });
          });
        });

        describe('user permissions', function() {
          var specs = [
            {context: 'empty string', perms: ''},
            {context: 'nothing', perms: null},
            {context: 'any object', perms: {hello: 'world'}},
            {context: 'some string', perms: 'aloha'},
            {context: 'number', perms: 123}
          ];

          specs.forEach(function(spec) {
            context('when ' + spec.context + ' specified', function() {
              it('evals to false', function() {
                expect(ctrl.evalBoolPermission("'add' | 'view'", spec.perms)).to.equal(false);
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

        context('when permissions expr is a string and not a boolean', function() {
          it('uses isAllowedToAnyOf() as the algorithm', function() {
            ctrl.has(this.userPermissions, "'view'");

            expect(ctrl.isAllowedToAnyOf).to.have.been.called;
          });
        });

        context('when permissions expr is an array', function() {
          it('uses isAllowedToAnyOf() as the algorithm', function() {
            ctrl.has(this.userPermissions, "['view', 'ban']");

            expect(ctrl.isAllowedToAnyOf).to.have.been.called;
          });
        });

        context('when permissions expr is string w/ single quotes', function() {
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

        context('when permissions expr contains & or |', function() {
          beforeEach(function() {
            sinon.stub(ctrl, 'evalBoolPermission');
          });

          afterEach(function() {
            ctrl.evalBoolPermission.restore();
          });

          it('interprets expr as the boolean permissions expr', function(){
            ctrl.has(this.userPermissions, "'add' & 'edit' | 'admin'");

            expect(ctrl.evalBoolPermission).to.have.been.called;
          });
        });
      });

      context('given invalid arguments', function() {

        var specs = [
          {context: 'string w/o single quotes', permsExpr: 'add'},
          {context: 'empty string', permsExpr: ''},
          {context: 'nothing', permsExpr: null},
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

  describe('directive', function() {

    function create(htmlStr) {
      var elem, compiledElem;
      elem = angular.element(htmlStr);
      compiledElem = $compile(elem)($scope);
      $rootScope.$digest();

      return compiledElem;
    }

    var $compile, $rootScope, directiveElement;
    beforeEach(inject(function(_$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
    }));

    describe('linking function', function() {
      context('when permission check is true', function() {
        beforeEach(function() {
          directiveElement = create('<div if-has-permission="\'view\'"></div>');
        });

        it('keeps the dom element', function() {
          expect(directiveElement[0].nextSibling).to.exist;
        });
      });

      context('when permission check is false', function() {
        beforeEach(function() {
          directiveElement = create('<div if-has-permission="\'someBadPermission\'"></div>');
        });

        it('removes the dom element', function() {
          expect(directiveElement[0].nextSibling).to.be.null;
        });
      });
    });
  });
});