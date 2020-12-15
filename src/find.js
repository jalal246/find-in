const fs = require("fs");

const fsPromises = fs.promises;

function err(errMsg) {
  throw TypeError(`\x1b[33m${errMsg}\x1b[0m`);
}

function isReg(reg) {
  return typeof reg === "object";
}

function isStr(str) {
  return typeof str === "string";
}

async function find(opts) {
  if (!opts || !Array.isArray(opts.request)) {
    err(`Invalid input`);
  }

  const lengthRequest = opts.request.length;

  for (let i = 0; i < lengthRequest; i += 1) {
    // validate request
    if (!isReg(opts.request[i]) && !isStr(opts.request[i])) {
      err(`Invalid request`);
      break;
    }
  }

  if (!opts.path) {
    err(`Invalid path`);
  }

  /**
   * End of checking. Everything is good.
   */
  const fileHandle = await fsPromises.open(opts.path, "r");

  const isFlags = [];
  for (let i = 0; i < lengthRequest; i += 1) isFlags[i] = null; // flags

  let isFoundAll = false;

  const readStream = fs.createReadStream(opts.path, {
    encoding: opts.encoding || "utf8",
  });

  const chunkQueue = []; // chunk holder
  let combinedChunk; // combined chunk
  const maxJoins = opts.join || 2; // max rounds allowed to hold chunk

  return new Promise((resolve, reject) => {
    readStream.on("data", (chunk) => {
      if (chunkQueue.length < maxJoins) {
        chunkQueue.push(chunk);
      } else {
        // dump the first element in queue
        chunkQueue.shift();
        // add new chunk
        chunkQueue.push(chunk);
      }
      // flush combined chunk
      combinedChunk = null;
      // compose combined chunk
      for (let j = 0; j < chunkQueue.length; j += 1)
        combinedChunk += chunkQueue[j];
      // matching process
      for (let i = 0; i < lengthRequest; i += 1) {
        if (isFlags[i] === null) {
          isFlags[i] =
            chunk.match(opts.request[i]) ||
            combinedChunk.match(opts.request[i]);
        }
      }
      if (!isFlags.includes(null)) isFoundAll = true;
      if (isFoundAll) {
        combinedChunk = null;
        readStream.destroy();
        readStream.emit("end");
      }
    });

    readStream.on("error", (error) => reject(error));

    readStream.on("end", async () => {
      const report = [];
      await fileHandle.close();

      for (let i = 0; i < lengthRequest; i += 1) {
        report[i] = {
          isFound: isFlags[i] !== null,
          reg: opts.request[i],
          match: isFlags[i],
        };
      }

      resolve(report);
    });
  });
}

module.exports = find;
