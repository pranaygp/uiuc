"use strict";

var _ = require("./../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("schedule", function () {
  var schedule = void 0;

  beforeAll(function (done) {
    _2.default.getSchedule().then(function (data) {
      schedule = data;
      done();
    });
  });

  it("contains an array of years", function () {
    expect(schedule.years).toEqual(jasmine.any(Array));
    expect(schedule.years.length).toBeGreaterThan(0);
  });

  describe(".year(year)", function () {

    it("returns a Promise", function () {
      expect(schedule.year(schedule.years[0])).toEqual(jasmine.any(Promise));
    });

    it("returns a year", function (done) {
      schedule.year(schedule.years[0]).then(function (year) {
        expect(year.constructor.name).toEqual("Year");
        done();
      }).catch(function (err) {
        fail(err);
        done();
      });
    });

    it("returns a year (Number)", function (done) {
      schedule.year(Number(schedule.years[0])).then(function (year) {
        expect(year.constructor.name).toEqual("Year");
        done();
      }).catch(function (err) {
        fail(err);
        done();
      });
    });

    it("returns an error on invalid year", function (done) {
      schedule.year('2020').then(function (year) {
        fail("No error!");
        done();
      }).catch(function (err) {
        expect(err).toEqual("Invalid Year");
        done();
      });
    });
  });
});