const app = require("../server/server");
const supertest = require("supertest");
const request = supertest(app);

describe("Route integration", () => {
  describe("/", () => {
    describe("GET", () => {
      it("Get the root endpoint", async done => {
        const res = await request.get("/");
        expect(res.status).toBe(200);
        done();
      });
    });
  });
});
