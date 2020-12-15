const fs = require("fs");
const path = require("path");

const faker = require("faker");

const find = require("../src/find-copy");

const fileExist = path.join(__dirname, "tempFileExistForTest.txt");
const fileWithoutInfo = path.join(__dirname, ".env.no.info.test");
const fwitInfoStack = path.join(__dirname, "info.stk.docx");
const fileWithInfoSpread = path.join(__dirname, "info.sp.txt");

const LABEL1 = "hi guys!";
const LABEL2 = "what is up?";
const LABEL3 = "is everything ok?";
const LABEL4 = "good, glad to here that from you";
const LABEL5 = "dont worry";
const LABEL6 = "this test";
const LABEL7 = "cannot be last forever";
const LABEL8 = "right?";
const LABEL9 = "what!!";

const phrase1 = new RegExp(LABEL1, "g");
const phrase2 = new RegExp(`${LABEL2}`);
const phrase3 = LABEL3;
const phrase4 = LABEL4;
const phrase5 = new RegExp(`${LABEL5}`);
const phrase6 = LABEL6;
const phrase7 = LABEL7;
const phrase8 = new RegExp(`${LABEL8}`);
const phrase9 = /what!!/gi;

const request = [
  phrase1,
  phrase2,
  phrase3,
  phrase4,
  phrase5,
  phrase6,
  phrase7,
  phrase8,
  phrase9,
];

describe("Testing invalid input", () => {
  it("throws error for empty args", async () => {
    await expect(find()).rejects.toThrow("Invalid input");
  });

  it("throws error when no request is provided", async () => {
    await expect(find({})).rejects.toThrow("Invalid input");
  });

  it("throws error when request is not an array", async () => {
    await expect(find({ request: "" })).rejects.toThrow("Invalid input");
  });

  it("throws error when for invalid regex", async () => {
    await expect(find({ request: [9] })).rejects.toThrow("Invalid request");
  });

  it("throws error when no path in applied", async () => {
    await expect(find({ request: ["Hi"] })).rejects.toThrow("Invalid path");
  });
});

describe("Testing data spread in file", () => {
  beforeAll(() => {
    const ws1 = fs.createWriteStream(fileWithInfoSpread);

    for (let i = 0; i < 10000; i += 1) {
      if (i === 1000) {
        ws1.write(` ${LABEL1} `);
      } else if (i === 2000) {
        ws1.write(` ${LABEL2} `);
      } else if (i === 3000) {
        ws1.write(` ${LABEL3} `);
      } else if (i === 4000) {
        ws1.write(` ${LABEL4} `);
      } else if (i === 5000) {
        ws1.write(` ${LABEL5} `);
      } else if (i === 6000) {
        ws1.write(` ${LABEL6} `);
      } else if (i === 7000) {
        ws1.write(` ${LABEL7} `);
      } else if (i === 800) {
        ws1.write(` ${LABEL8} `);
      } else if (i === 800) {
        ws1.write(` ${LABEL9} `);
      } else {
        ws1.write(`${faker.lorem.paragraphs()}\n`);
      }
    }
    ws1.end();
  });

  afterAll(() => {
    fs.unlinkSync(fileWithInfoSpread);
  });

  it("replaces requested strings", async () => {
    const report = await find({ path: fileWithInfoSpread, request });

    expect(Array.isArray(report)).toBeTruthy();

    expect(report[0]).toStrictEqual({
      isFound: true,
      reg: new RegExp(LABEL1, "g"),
      match: [LABEL1],
    });

    expect(report).toMatchSnapshot();
  });
});

describe("Testing data doesn't exist in the file", () => {
  beforeAll(() => {
    const ws2 = fs.createWriteStream(fileWithoutInfo);
    for (let i = 0; i < 10000; i += 1) {
      ws2.write(`${faker.lorem.paragraphs()}\n`);
    }
    ws2.end();
  });

  afterAll(() => {
    fs.unlinkSync(fileWithoutInfo);
  });

  //   it("returns isFound false beacuse of not matching", (done) => {})
});

// describe("testing in not matching info file", () => {
//   it("create file with fake info", () => {
//     // init file with params spreaded.
//     const ws2 = fs.createWriteStream(ffileWithoutInfo);
//     for (let i = 0; i < 10000; i += 1) {
//       ws2.write(`${faker.lorem.paragraphs()}\n`);
//     }
//     ws2.end();
//   });
//   it("returns isFound false beacuse of not matching", (done) => {
//     find({ path: ffileWithoutInfo, request }, (err, report) => {
//       expect(report[0]).to.deep.equal({
//         isFound: false,
//         reg: new RegExp(LABLE1, "g"),
//         match: null,
//       });
//       expect(report[7]).to.deep.equal({
//         isFound: false,
//         reg: new RegExp(`${LABLE8}`),
//         match: null,
//       });
//       done();
//     });
//   });
//   it("delete test file", (done) => {
//     fs.unlinkSync(ffileWithoutInfo);
//     done();
//   });
// });
// describe("testing in stack info file", () => {
//   it("create file with fake info", () => {
//     // init file with params spreaded.
//     const ws3 = fs.createWriteStream(fwitInfoStack);
//     ws3.write(` ${LABLE1} `);
//     ws3.write(` ${LABLE2} `);
//     ws3.write(` ${LABLE3} `);
//     ws3.write(` ${LABLE4} `);
//     ws3.write(` ${LABLE5} `);
//     ws3.write(` ${LABLE6} `);
//     ws3.write(` ${LABLE7} `);
//     ws3.write(` ${LABLE8} `);
//     ws3.write(` ${LABLE9} `);
//     for (let i = 0; i < 10000; i += 1) {
//       ws3.write(`${faker.lorem.paragraphs()}\n`);
//     }
//     ws3.end();
//   });
//   it("returns isFound false beacuse of not matching", (done) => {
//     find({ path: fwitInfoStack, request, join: 2 }, (err, report) => {
//       expect(report[0]).to.deep.equal({
//         isFound: true,
//         reg: new RegExp(LABLE1, "g"),
//         match: [LABLE1],
//       });
//       done();
//     });
//   });
//   it("delete test file", (done) => {
//     fs.unlinkSync(fwitInfoStack);
//     done();
//   });
// });
