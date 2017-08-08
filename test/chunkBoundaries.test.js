/* eslint-env mocha */
import chai from 'chai';
import fs from 'fs';
import path from 'path';

import find from '../src';

const expect = chai.expect;

const boundaries = path.join(__dirname, 'boundaries.txt');

describe('testing to match regexes on chunk boundaries / issues:2', () => {
  it('create file with fake info', () => {
    const flen = 64 * 1024 * 3;
    const rlen = 10;
    const i = flen - rlen - 10;
    const buf = Buffer.alloc(flen, ' ', 'utf8');
    buf.fill('B', i - 1, i + rlen + 1, 'utf8');
    buf.fill('A', i, i + rlen, 'utf8');
    fs.writeFileSync(boundaries, buf);
  });
  it('returns isFound true', (done) => {
    find({ path: boundaries, request: [/BA*B/] }, (err, report) => {
      expect(report[0].isFound).to.be.equal(true);
      done();
    });
  });
  it('delete test file', (done) => {
    fs.unlinkSync(boundaries);
    done();
  });
});
