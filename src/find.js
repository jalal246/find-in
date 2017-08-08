import fs from 'fs';

// function to generates error as you see.
const errUnit = errMsg => new Error(`\x1b[33m${errMsg}\x1b[0m`);

// since all the validation happens after opening the file.
const closeReturnError = (fd, errMsg, cb) => fs.close(fd, () => cb(errUnit(errMsg)));


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
 * @param {Object} opt - options
 * @property {string} - path, directory
 * @property {array} - requestز array contains the regex
 * @property {string} - encoding, type of encoding used for reading
 * @property {number} - rounds, chunk boundaries
 *
 * @callback {error~object}
 * @property {boolean} - isFound
 * @property {string|object} - reg
 * @property {string} - match,
 *
 */
const find = (opt, cb) => {
  const opts = opt || {};
  // validate callback, else every error will be handled in callback error
  if (typeof cb !== 'function') throw errUnit(cbMsg);
  // validate file.
  return fs.open(opts.path, 'r', (openErr, fd) => {
    if (openErr) return cb(openErr);
    // validate arrayOfReg
    if (!(opts.request instanceof Array)) return closeReturnError(fd, arrOfRegMsg, cb);
    // validate arrayOfReg length
    const arrayLen = regLen(opts.request);
    if (arrayLen === 0) return closeReturnError(fd, arrOfRegEmptyMsg, cb);
    // validate the objects inside.
    for (let i = 0; i < arrayLen; i += 1) {
      // validate regMsg in find
      if (!isReg(opts.request[i]) && !isStr(opts.request[i])) {
        return closeReturnError(fd, regMsg + opts.request[i], cb);
      }
    }
    // Everything is good ****************************************************
    // create array of flags
    const isFlags = [];
    // init arry with default false.
    for (let i = 0; i < arrayLen; i += 1) isFlags[i] = null; // flags
    let isFoundAll = false;
    const readStream = fs.createReadStream(opts.path, {
      encoding: opts.encoding || 'utf8',
    });
    readStream.on('error', readErr => closeReturnError(fd, readErr, cb));
    const combinedChunkQueue = []; // chunck holder
    let combinedChunk; // combined chunk
    const maxRounds = opts.join || 3; // max rounds allowed to hold chunk
    let currentRound = 0;
    readStream.on('data', (chunk) => {
      // handling combined chunk index.
      if (currentRound === maxRounds) {
        // reset index
        currentRound = 0;
        // dump the first element in queue
        combinedChunkQueue.shift();
      } else {
        currentRound += 1;
        // add new chunck
        combinedChunkQueue.push(chunk);
      }
      // flush combined chunk
      combinedChunk = null;
      // compose combined chunk
      for (let j = 0; j < combinedChunkQueue.length; j += 1) combinedChunk += combinedChunkQueue[j];
      // matching process
      for (let i = 0; i < arrayLen; i += 1) {
        if (isFlags[i] === null) isFlags[i] = combinedChunk.match(opts.request[i]);
      }
      if (!isFlags.includes(null)) isFoundAll = true;
      if (isFoundAll) {
        combinedChunk = null;
        readStream.destroy();
        readStream.emit('end');
      }
    });
    return readStream.on('end', () => fs.close(fd, () => {
      const report = [];
      for (let i = 0; i < arrayLen; i += 1) {
        report[i] = {
          isFound: isFlags[i] !== null,
          reg: opts.request[i],
          match: isFlags[i] && isFlags[i][0],
        };
      }
      return cb(null, report);
    }));
  });
};

export default find;
