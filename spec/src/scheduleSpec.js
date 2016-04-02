import uiuc from './../'

describe("schedule", () => {
  let schedule;

  beforeAll((done) => {
    uiuc.getSchedule()
      .then((data) => {
        schedule = data;
        done();
      })
  })

  it("contains an array of years", () => {
    expect(schedule.years).toEqual(jasmine.any(Array))
    expect(schedule.years.length).toBeGreaterThan(0);
  })

  describe(".year(year)", () => {

    it("returns a Promise", () => {
      expect(schedule.year(schedule.years[0])).toEqual(jasmine.any(Promise))
    })

    it("returns a year", (done) => {
      schedule.year(schedule.years[0])
        .then((year) => {
          expect(year.constructor.name).toEqual("Year")
          done();
        })
        .catch((err) => {
          fail(err);
          done();
        })
    })

    it("returns a year (Number)", (done) => {
      schedule.year(Number(schedule.years[0]))
        .then((year) => {
          expect(year.constructor.name).toEqual("Year")
          done();
        })
        .catch((err) => {
          fail(err);
          done();
        })
    })

    it("returns an error on invalid year", (done) => {
      schedule.year('2020').then((year) => {
        fail("No error!");
        done();
      }).catch((err) => {
        expect(err).toEqual("Invalid Year")
        done();
      })
    })

  })

})
