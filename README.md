# find-in

> Node text search in files

```bash
npm install find-in
```

## How it works?

It creates read [stream](https://nodejs.org/api/stream.html) to read from the target file in chunks, matches the chunks using [match](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match) method and returns an array of objects contains the final results.

## API

## find(options)

`options`

- `path` file path,
- `request` array of [regex](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions) that will be matched in file
- `encoding` read stream encoding (default: `utf8`)
- `join` number of chunk combined (default: 2), increasing the number will widen the matching chunk boundaries

The callback gets two arguments `(err, report)`.

`report` An array of objects. Each element contains three objects:

- `isFound` searching result
- `reg` regex sent
- `match` matching result. An array if there are results otherwise returns null. for more see [String.prototype.match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

### Examples

```js
const find = require("find-in");

// let's create some request to search for it in our file.
const req = [/old/g, /new/g];

const report = await find({ path: "/path1/path2/fileName", request: req });

// > report:
//
// [
//   {
//     isFound: true,
//     reg: /old/g,
//     match: ["old"], // the result of matching
//   },
//   {
//     isFound: false, // not found so it wasn't changed
//     reg: /new/g,
//     match: null,
//   },
// ];
```

Or you can check a specific result as following.

```js
const report = await find({
  path: "/path1/path2/fileName",
  request: [phrase0, phrase1, phrase2, phrase3],
});

if (report[2].isFound) {
  console.log("found phrase2!");
  // do something
} else {
  console.log("phrase2 is not found!");
  // do something else
}
```

## Tests

```sh
yarn test
```

## License

This project is licensed under the [MIT License](https://github.com/Jimmy02020/find-in/blob/master/LICENSE)
