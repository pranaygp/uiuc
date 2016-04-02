'use strict';

var _2 = require('./../');

var _3 = _interopRequireDefault(_2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("year", function () {
  var year = void 0;

  beforeAll(function (done) {
    _3.default.getSchedule().then(function (schedule) {
      return schedule.year(schedule.years[0]);
    }).then(function (data) {
      year = data;
      done();
    });
  });

  it("contains the current year", function () {
    expect(year.year).toEqual(jasmine.any(Number));
    expect(year.year).not.toBeNull();
  });

  it("contains an array of terms", function () {
    expect(year.terms).toEqual(jasmine.any(Array));
    expect(year.terms.length).toBeGreaterThan(0);
  });

  describe(".term(term)", function () {

    it("returns a Promise", function () {
      expect(year.term(year.terms[0])).toEqual(jasmine.any(Promise));
    });

    it("returns a term", function (done) {
      year.term(year.terms[0]).then(function (term) {
        expect(term.constructor.name).toEqual("Term");
        done();
      }).catch(function (err) {
        fail(err);done();
      });
    });

    it("returns a term (lowercase)", function (done) {
      year.term(_lodash2.default.toLower(year.terms[0])).then(function (term) {
        expect(term.constructor.name).toEqual("Term");
        done();
      }).catch(function (err) {
        fail(err);done();
      });
    });

    it("returns a term (uppercase)", function (done) {
      year.term(_lodash2.default.toUpper(year.terms[0])).then(function (term) {
        expect(term.constructor.name).toEqual("Term");
        done();
      }).catch(function (err) {
        fail(err);done();
      });
    });

    it("throws an error on invalid term", function (done) {
      year.term("LOL").then(function (term) {
        fail("Did not throw error");
        done();
      }).catch(function (err) {
        expect(err).toEqual("Invalid Term");
        done();
      });
    });
  });
});