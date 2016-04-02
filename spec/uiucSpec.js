"use strict";

// import uiuc from './../'
var uiuc = require("./../").default;

describe("getSchedule()", function () {

  it("is not null", function () {
    expect(uiuc.getSchedule()).not.toBeNull();
  });

  it("returns a Promise", function () {
    expect(uiuc.getSchedule()).toEqual(jasmine.any(Promise));
  });

  it("returns a Schedule", function (done) {
    uiuc.getSchedule().then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Schedule");
      done();
    });
  });

  it("can return a Year", function (done) {
    uiuc.getSchedule({ year: 2016 }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Year");
      done();
    });
  });

  it("can return a Term", function (done) {
    uiuc.getSchedule({ year: 2016, term: "spring" }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Term");
      done();
    });
  });

  it("can return a Subject", function (done) {
    uiuc.getSchedule({ year: 2016, term: "spring", subject: "ADV" }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Subject");
      done();
    });
  });
});