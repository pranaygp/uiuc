'use strict';

var _2 = require('./../');

var _3 = _interopRequireDefault(_2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("term", function () {
  var term = void 0;

  beforeAll(function (done) {
    _3.default.getSchedule().then(function (schedule) {
      return schedule.year(schedule.years[0]);
    }).then(function (year) {
      return year.term(year.terms[3]);
    }).then(function (data) {
      term = data;
      done();
    });
  });

  it("contains the current year as a Number", function () {
    expect(term.year).toEqual(jasmine.any(Number));
  });

  it("contains an array of subjects", function () {
    expect(term.subjects).toEqual(jasmine.any(Array));
    expect(term.subjects.length).toBeGreaterThan(0);
  });

  describe(".subject(subject)", function () {

    it("returns a Promise", function () {
      expect(term.subject(term.subjects[0])).toEqual(jasmine.any(Promise));
    });

    it("returns a subject", function (done) {
      term.subject(term.subjects[0]).then(function (subject) {
        expect(subject.constructor.name).toEqual("Subject");
        done();
      }).catch(function (err) {
        fail(err);done();
      });

      term.subject(term.subjects[0], true).then(function (subject) {
        expect(subject.constructor.name).toEqual("Subject");
        done();
      }).catch(function (err) {
        fail(err);done();
      });
      // console.log(term.section(46258))
    });

    it("throws an error on invalid subject", function (done) {
      term.subject({ code: "LOLOLOLOLOLOL" }).then(function (subject) {
        fail("Did not throw error");
        done();
      }).catch(function (err) {
        expect(err).toEqual("Invalid Subject");
        done();
      });
    });
  });
});