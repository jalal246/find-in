import fs from 'fs';

// function to generates error as you see.
const errUnit = errMsg => new Error(`\x1b[33m${errMsg}\x1b[0m`);

const cbMsg = 'Invalid callback function.';
const arrOfRegMsg = 'Invalid array type';
const arrOfRegEmptyMsg = 'Empty array of objects';
const regMsg = 'Invalid regex at: ';


// gets the regex length
const regLen = regex => regex.length;

// check if input is string
const isStr = str => typeof str === 'string';

// check if input is regex
const isReg = reg => typeof reg === 'object';

/**
  *
  * @param {string} dir  - directory.
  * @param {array} arrayOfReg
  * @callback {error~object}
  *
  */
const find = (dir, arrayOfReg, cb) => {
  // validate callback, else every error will be handled in callback error
  if (typeof cb !== 'function') throw errUnit(cbMsg);
  // validate file.
  return fs.open(dir, 'r', (openErr, fd) => {
    if (openErr) return cb(openErr);
    // validate arrayOfReg
    if (!(arrayOfReg instanceof Array)) return cb(errUnit(arrOfRegMsg));
    // validate arrayOfReg length
    const arrayLen = regLen(arrayOfReg);
    if (arrayLen === 0) return cb(errUnit(arrOfRegEmptyMsg));
    // validate the objects inside.
    for (let i = 0; i < arrayLen; i += 1) {
      // validate regMsg in findd
      if (!isReg(arrayOfReg[i]) && !isStr(arrayOfReg[i])) {
        return cb(errUnit(regMsg + arrayOfReg[i]));
      }
    }
    // Everything is good ****************************************************
    // create array of flags
    const isFlags = [];
    // init arry with default false.
    for (let i = 0; i < arrayLen; i += 1) isFlags[i] = null; // flags
    let isFoundAll = false;
    const readStream = fs.createReadStream(dir, {
      encoding: 'utf8',
    });
    readStream.on('error', readErr => cb(readErr));
    readStream.on('data', (chunk) => {
      for (let i = 0; i < arrayLen; i += 1) {
        if (isFlags[i] === null) isFlags[i] = chunk.match(arrayOfReg[i]);
      }
      if (!isFlags.includes(null)) isFoundAll = true;
      if (isFoundAll) {
        readStream.destroy();
        readStream.emit('end');
      }
    });
    return readStream.on('end', () => fs.close(fd, () => {
      const report = [];
      for (let i = 0; i < arrayLen; i += 1) {
        report[i] = {
          isFound: isFlags[i] !== null,
          reg: arrayOfReg[i],
          match: isFlags[i] && isFlags[i][0],
        };
      }
      return cb(null, report);
    }));
  });
};

export default find;
