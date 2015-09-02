# if-has-permission
[![Build Status][travis-image]][travis-url] [![Code Climate][codeclimate-image]][codeclimate-url] [![Test Coverage][coverage-image]][coverage-url] [![Dependecies][david-dm-image]][david-dm-url]

AngularJS directive to enable/disable dom elements based on the user permissions.

## Install & Run
```bash
$ cd /tmp
$ git clone https://github.com/dezoxel/if-has-permission.git
$ cd if-has-permission
$ npm install
$ bower install
$ gulp serve
```

After running latest command your default browser will be automatically opened with Demo application.
If browser was not opened, please open the [http://localhost:3000](http://localhost:3000) on your favorite browser.

## Setup

```javascript
// run.js
.run(function(userPermissions) {
  // get the permissions list of current user here (ex. from server)
  var list = ['add', 'edit'];
  userPermissions.set(list);
});
```

## Examples

Enable element if user has specified permission:
```html
<div if-has-permission="'add'">Add link here</div>
<div if-has-permission="'delete'">Delete link here</div>
```

Enable element if user has ANY of the specified permissions:
```html
<div if-has-permission="['add', 'edit']">Member section</div>
<div if-has-permission="['admin', 'moderator']">Manager section</div>
```

Enable element if user has specified permissions using boolean expression:
```html
<div if-has-permission="'add' & 'edit' | 'admin'">Writer section</div>
<div if-has-permission="'view' | 'read' | 'publish' | 'admin'">Secret</div>
```

It is also possible write expr w/o single qoutes:
```html
<div if-has-permission="add & edit | admin">Secret</div>
<div if-has-permission="view | read | publish | admin">Secret</div>
```

Logical (not bitwise) operators also supported:
```html
<div if-has-permission="add && edit || admin">Secret</div>
<div if-has-permission="view || read || publish || admin">Secret</div>
```

[travis-image]: https://travis-ci.org/dezoxel/if-has-permission.png?branch=master
[travis-url]: https://travis-ci.org/dezoxel/if-has-permission
[codeclimate-image]: https://codeclimate.com/github/dezoxel/if-has-permission/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/dezoxel/if-has-permission
[coverage-image]: https://codeclimate.com/github/dezoxel/if-has-permission/badges/coverage.svg
[coverage-url]: https://codeclimate.com/github/dezoxel/if-has-permission/coverage
[david-dm-image]: https://david-dm.org/dezoxel/if-has-permission/dev-status.svg
[david-dm-url]: https://david-dm.org/dezoxel/if-has-permission#info=devDependencies
