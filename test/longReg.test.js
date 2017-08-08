/* eslint-env mocha */
import chai from 'chai';
import fs from 'fs';
import path from 'path';

import find from '../src';

const expect = chai.expect;

const longReg = path.join(__dirname, 'longReg.txt');

describe('testing with long regex/ issues:1', () => {
  it('create file with fake info', () => {
    const flen = 64 * 1024 * 3;
    const rlen = 64 * 1024;
    const i = 10;
    const buf = Buffer.alloc(flen, ' ', 'utf8');
    buf.fill('B', i - 1, i + rlen + 1, 'utf8');
    buf.fill('A', i, i + rlen, 'utf8');
    fs.writeFileSync(longReg, buf);
  });
  it('returns isFound true', (done) => {
    find({ path: longReg, request: [/BA*B/] }, (err, report) => {
      expect(report[0].isFound).to.be.equal(true);
      done();
    });
  });
  it('delete test file', (done) => {
    fs.unlinkSync(longReg);
    done();
  });
});
