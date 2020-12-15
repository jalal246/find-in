const fs = require("fs");
const path = require("path");

const find = require("../src/find");

const longReg = path.join(__dirname, "longReg.txt");

describe("Testing long regex/ issues:1", () => {
  beforeAll(() => {
    const fLen = 64 * 1024 * 3;
    const rLen = 64 * 1024;
    const i = 10;
    const buf = Buffer.alloc(fLen, " ", "utf8");
    buf.fill("B", i - 1, i + rLen + 1, "utf8");
    buf.fill("A", i, i + rLen, "utf8");
    fs.writeFileSync(longReg, buf);
  });

  afterAll(() => {
    fs.unlinkSync(longReg);
  });

  it("returns isFound true", async () => {
    const report = await find({ path: longReg, request: [/BA*B/] });

    expect(report[0].isFound).toBe(true);
    expect(report).toMatchSnapshot();
  });
});
