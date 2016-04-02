import uiuc from './../'

describe("getSchedule()", () => {

  it("is not null", () => {
    expect(uiuc.getSchedule()).not.toBeNull();
  })

  it("returns a Promise", () => {
    expect(uiuc.getSchedule()).toEqual(jasmine.any(Promise))
  })

  it("returns a Schedule", (done) => {
    uiuc.getSchedule().then((schedule) => {
      expect(schedule.constructor.name).toEqual("Schedule")
      done()
    })
  })

  it("can return a Year", (done) => {
    uiuc.getSchedule({year: 2016}).then((schedule) => {
      expect(schedule.constructor.name).toEqual("Year")
      done()
    })
  })

  it("can return a Term", (done) => {
    uiuc.getSchedule({year: 2016, term: "spring"}).then((schedule) => {
      expect(schedule.constructor.name).toEqual("Term")
      done()
    })
  })

  it("can return a Subject", (done) => {
    uiuc.getSchedule({year: 2016, term: "spring", subject: "ADV"}).then((schedule) => {
      expect(schedule.constructor.name).toEqual("Subject")
      done()
    })
  })

})
