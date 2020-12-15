const fs = require("fs");
const path = require("path");

const find = require("../src/find");

const boundaries = path.join(__dirname, "boundaries.txt");

describe("Testing to match regex on chunk boundaries / issues:2", () => {
  beforeAll(() => {
    const fLen = 64 * 1024 * 3;
    const rLen = 10;
    const i = fLen - rLen - 10;
    const buf = Buffer.alloc(fLen, " ", "utf8");
    buf.fill("B", i - 1, i + rLen + 1, "utf8");
    buf.fill("A", i, i + rLen, "utf8");
    fs.writeFileSync(boundaries, buf);
  });

  afterAll(() => {
    fs.unlinkSync(boundaries);
  });

  it("returns isFound true", async () => {
    const report = await find({ path: boundaries, request: [/BA*B/] });

    expect(report[0].isFound).toBe(true);
    expect(report).toMatchSnapshot();
  });
});
