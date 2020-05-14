const SC = require("../server/controllers/summaryStrava");

describe("Strava Controller Unit Tests", () => {
  describe("Testing loading the Mock Demo Data", () => {
    it("Loads the demo data as expected", (done) => {
      const mockRes = { locals: { activities: [] } };
      const epochSeconds = SC.getDemoData(null, mockRes, () => {
        const demoActivities = mockRes.locals.activities;
        // console.log(demoActivities[0]);
        expect(Array.isArray(demoActivities)).toBe(true);
        expect(demoActivities[0].id).toBe(2307995672);
        done();
      });
    });
  });
});
