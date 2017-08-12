/* eslint-env mocha */
import chai from 'chai';
import faker from 'faker';
import fs from 'fs';
import path from 'path';

import find from '../src';

const expect = chai.expect;

const fileExist = path.join(__dirname, 'tempFileExistForTest.txt');
const fwithoutInfo = path.join(__dirname, '.env.no.info.test');
const fwitInfoStack = path.join(__dirname, 'info.stk.docx');
const fwithInfoSpreaded = path.join(__dirname, 'info.sp.txt');

const LABLE1 = 'hi guys!';
const LABLE2 = 'what is up?';
const LABLE3 = 'is everything ok?';
const LABLE4 = 'good, glad to here that from you';
const LABLE5 = 'dont worry';
const LABLE6 = 'this test';
const LABLE7 = 'cannot be last forever';
const LABLE8 = 'right?';
const LABLE9 = 'what!!';

const pharse1 = new RegExp(LABLE1, 'g');
const pharse2 = new RegExp(`${LABLE2}`);
const pharse3 = LABLE3;
const pharse4 = LABLE4;
const pharse5 = new RegExp(`${LABLE5}`);
const pharse6 = LABLE6;
const pharse7 = LABLE7;
const pharse8 = new RegExp(`${LABLE8}`);
const pharse9 = /what!!/ig;

const request = [
  pharse1,
  pharse2,
  pharse3,
  pharse4,
  pharse5,
  pharse6,
  pharse7,
  pharse8,
  pharse9,
];

describe('read and replace stream function', () => {
  describe('invalid parameters', () => {
    it('creates file to continue validation test', () => {
      fs.closeSync(fs.openSync(fileExist, 'w'));
    });
    it('throws error empty args', () => {
      // console.log(find());
      expect(() => find()).to.throw(Error);
    });
    it('throws error for invalid callback function', () => {
      // console.log(find(fwithInfoSpreaded, [], 'test'));
      expect(() => find(fileExist, [], 'test')).to.throw(Error);
    });
    describe('return callback error msg callback error', () => {
      it('for invalid directory', (done) => {
        find({ path: 'fileExist' }, (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for invalid array of objects', (done) => {
        find({ path: fileExist }, (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for empty array of objects', (done) => {
        find({ path: fileExist, request: [] }, (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for invalid reg [regex or string]', (done) => {
        find({ path: fileExist, request: [8] }, (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      // it('for invalid replace pharse', (done) => {
      //   find(fileExist, [{ reg: /d/g, match: 9 }], (err) => {
      //     // console.log(err);
      //     expect(err).to.be.an('error');
      //     done();
      //   });
      // });
      it('delete test file that was created for validation test', () => {
        fs.unlinkSync(fileExist);
      });
    });
  });
  describe('info spreaded in file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws1 = fs.createWriteStream(fwithInfoSpreaded);
      for (let i = 0; i < 10000; i += 1) {
        if (i === 1000) {
          ws1.write(` ${LABLE1} `);
        } else if (i === 2000) {
          ws1.write(` ${LABLE2} `);
        } else if (i === 3000) {
          ws1.write(` ${LABLE3} `);
        } else if (i === 4000) {
          ws1.write(` ${LABLE4} `);
        } else if (i === 5000) {
          ws1.write(` ${LABLE5} `);
        } else if (i === 6000) {
          ws1.write(` ${LABLE6} `);
        } else if (i === 7000) {
          ws1.write(` ${LABLE7} `);
        } else if (i === 800) {
          ws1.write(` ${LABLE8} `);
        } else if (i === 800) {
          ws1.write(` ${LABLE9} `);
        } else {
          ws1.write(`${faker.lorem.paragraphs()}\n`);
        }
      }
      ws1.end();
    });
    it('replaces spreaded strings', (done) => {
      find({ path: fwithInfoSpreaded, request }, (err, report) => {
        // console.log(report);
        expect(report[0]).to.deep.equal({
          isFound: true, reg: new RegExp(LABLE1, 'g'), match: [LABLE1],
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwithInfoSpreaded);
      done();
    });
  });
  describe('testing in not matching info file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws2 = fs.createWriteStream(fwithoutInfo);
      for (let i = 0; i < 10000; i += 1) {
        ws2.write(`${faker.lorem.paragraphs()}\n`);
      }
      ws2.end();
    });
    it('returns isFound false beacuse of not matching', (done) => {
      find({ path: fwithoutInfo, request }, (err, report) => {
        expect(report[0]).to.deep.equal({
          isFound: false, reg: new RegExp(LABLE1, 'g'), match: null,
        });
        expect(report[7]).to.deep.equal({
          isFound: false, reg: new RegExp(`${LABLE8}`), match: null,
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwithoutInfo);
      done();
    });
  });
  describe('testing in stack info file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws3 = fs.createWriteStream(fwitInfoStack);
      ws3.write(` ${LABLE1} `);
      ws3.write(` ${LABLE2} `);
      ws3.write(` ${LABLE3} `);
      ws3.write(` ${LABLE4} `);
      ws3.write(` ${LABLE5} `);
      ws3.write(` ${LABLE6} `);
      ws3.write(` ${LABLE7} `);
      ws3.write(` ${LABLE8} `);
      ws3.write(` ${LABLE9} `);
      for (let i = 0; i < 10000; i += 1) {
        ws3.write(`${faker.lorem.paragraphs()}\n`);
      }
      ws3.end();
    });
    it('returns isFound false beacuse of not matching', (done) => {
      find({ path: fwitInfoStack, request, join: 2 }, (err, report) => {
        expect(report[0]).to.deep.equal({
          isFound: true, reg: new RegExp(LABLE1, 'g'), match: [LABLE1],
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwitInfoStack);
      done();
    });
  });
});
