"use strict";

var _ = require("./../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const uiuc = require("./../").default

describe("getSchedule()", function () {

  it("is not null", function () {
    expect(_2.default.getSchedule()).not.toBeNull();
  });

  it("returns a Promise", function () {
    expect(_2.default.getSchedule()).toEqual(jasmine.any(Promise));
  });

  it("returns a Schedule", function (done) {
    _2.default.getSchedule().then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Schedule");
      done();
    });
  });

  it("can return a Year", function (done) {
    _2.default.getSchedule({ year: 2016 }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Year");
      done();
    });
  });

  it("can return a Term", function (done) {
    _2.default.getSchedule({ year: 2016, term: "spring" }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Term");
      done();
    });
  });

  it("can return a Subject", function (done) {
    _2.default.getSchedule({ year: 2016, term: "spring", subject: "ADV" }).then(function (schedule) {
      expect(schedule.constructor.name).toEqual("Subject");
      done();
    });
  });
});