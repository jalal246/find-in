# find-in

> Node text search in files

```bash
npm install find-in
```

## How it works?

It creates read [stream](https://nodejs.org/api/stream.html) to read from the target file in chunks, matches the chunks using [match](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match) method and returns an array of objects contains the final results.

## API

## find(options)

`options` object contains:

- `path: string` file path,
- `request: array` array of [regex](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions) that will be matched in file
- `encoding:? string` read stream encoding (default: `utf8`)
- `join: string` number of chunk combined (default: 2), increasing the number will widen the matching chunk boundaries

The results is promise contains `report: array` An array of objects. Each element contains three keys:

- `isFound: Boolean` search result
- `reg: string` regex sent in request
- `match: array` matching result. An array if there are results otherwise returns null. for more see [String.prototype.match()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

### Examples

```js
const find = require("find-in");

// let's create some request to search for it in our file.
const req = [/old/g, /new/g];

const report = await find({ path: "/path/to/fileName", request: req });

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
  path: "/path/to/fileName",
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

### Related projects

- [textics](https://github.com/jalal246/textics-stream) &
  [textics-stream](https://github.com/jalal246/textics) - counts lines, words, chars and spaces for a given string

- [packageSorter](https://github.com/jalal246/packageSorter) - Sorting packages
  for monorepos production.

- [builderz](https://github.com/jalal246/builderz) - Building your project with zero config.

- [corename](https://github.com/jalal246/corename) - Extracts package name.

- [get-info](https://github.com/jalal246/get-info) - Utility functions for
  projects production.

- [move-position](https://github.com/jalal246/move-position) - Moves element in
  given array form index-A to index-B

## License

This project is licensed under the [MIT License](https://github.com/jalal246/find-in/blob/master/LICENSE)
