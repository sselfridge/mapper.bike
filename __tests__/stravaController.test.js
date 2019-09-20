const SC = require("../server/controllers/stravaController");

describe("Strava Controller Unit Tests", () => {
  describe("Testing loading the Mock Demo Data", () => {
    it("Loads the demo data as expected", done => {
      const mockRes = { locals: { activities: [] } };
      const epochSeconds = SC.getDemoData(null, mockRes, () => {
        const demoActivites = mockRes.locals.activities;
        // console.log(demoActivites[0]);
        expect(Array.isArray( demoActivites)).toBe(true);
        expect(demoActivites[0].id).toBe(2307995672);
        done();
      });
    });
  });
});
