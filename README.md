[![NPM](https://nodei.co/npm/find-in.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/find-in/)

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/Jimmy02020/find-in)
[![Codecov](https://img.shields.io/codecov/c/github/codecov/example-python.svg)](https://codecov.io/gh/Jimmy02020/find-in)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/Jimmy02020/find-in/blob/master/LICENSE)

Overview
--------
``find-in`` is file text-searching for [node](https://nodejs.org/en/).

How it works?
--------

Simply, ``find-in`` creates read [stream](https://nodejs.org/api/stream.html) to read from the target file in chunks, matches the chunks using [match](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match) method returns an array of objects contains the final results in callback function.

Getting Started
---------------

clone the repo:
```sh
git clone git@github.com:jimmy02020/find-in.git
cd find-in
```

Using npm:
```sh
$ npm install find-in
```

Syntax
-------

### find(options, callback)

`options`:

* `path` file path,
* `request` array of regex that will be matched in file
* `encoding`  read stream encoding (default: `utf8`)
* `join` number of chunk combined (default: 3), increasing the number will widen the matching chunk boundaries

The callback gets two arguments `(err, report)`.

`report`  array of objects. Each element contains three objects:

* `isFound` searching result
* `reg` regex sent
* `match` matching result

Using find-in
----------

```javascript
const find = require('find-in')

// let's create some request to search for it in our file.
const req = [
  /old/g,
  /new/g,
]

find({ path: '/path1/path2/fileName', request: req }, (err, report) => {
  //
  [
    {
      isFound: true,
      reg:/old/g,
      match: old // the result of matching
    },
    { isFound: false, // not found so it wasn't changed
      reg: /new/g,
      match: null
    },
   ]
  //
});
```
Or you can check specific result as following.

```javascript
find({ path: '/path1/path2/fileName', request: [ph0, ph1, p2, ph3] }, (err, report) => {
  if(report[2].isFound){
    console.log('p2 was found');
    // do something
  } else {
    console.log('not found');
    // do something else
  }
});
```

Tests
-----

```sh
$ npm test
```

License
-------

This project is licensed under the [MIT License](https://github.com/Jimmy02020/find-in/blob/master/LICENSE)
