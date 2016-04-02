'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeRestClient = require('node-rest-client');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uiuc = function () {
  function uiuc() {
    _classCallCheck(this, uiuc);
  }

  _createClass(uiuc, null, [{
    key: 'getSchedule',
    value: function getSchedule(options) {

      if (options) {
        var year = options.year;
        var term = options.term;
        var subject = options.subject;

        if (year) {
          if (term) {
            if (subject) {
              return Subject.fetch(options);
            }
            return Term.fetch(options);
          }
          return Year.fetch(options);
        }
      } else {
        return Schedule.fetch();
      }
    }
  }]);

  return uiuc;
}();

exports.default = uiuc;

var Schedule = function () {
  function Schedule(years) {
    _classCallCheck(this, Schedule);

    this.years = years.map(function (year) {
      return Number(year);
    });
  }

  _createClass(Schedule, [{
    key: 'year',
    value: function year(_year) {
      _year = Number(_year);
      if (!(_lodash2.default.indexOf(this.years, _year) > -1)) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Year");
        });
      } else {
        return Year.fetch({ year: _year });
      }
    }
  }], [{
    key: 'fetch',
    value: function fetch() {
      return new Promise(function (resolve, reject) {
        var client = new _nodeRestClient.Client();
        client.get("http://courses.illinois.edu/cisapp/explorer/schedule.xml", function (data, response) {
          resolve(new Schedule(data['ns2:schedule'].calendarYears[0].calendarYear.map(function (calendarYear) {
            return calendarYear._;
          })));
        });
        client = null;
      });
    }
  }]);

  return Schedule;
}();

var Year = function () {
  function Year(year, terms) {
    _classCallCheck(this, Year);

    this.year = year;
    this.terms = terms.map(function (string) {
      return _lodash2.default.words(string)[0];
    }).map(function (string) {
      return _lodash2.default.toLower(string);
    });
  }

  _createClass(Year, [{
    key: 'term',
    value: function term(_term) {
      _term = _lodash2.default.toLower(_term);

      if (!(_lodash2.default.indexOf(this.terms, _term) > -1)) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Term");
        });
      } else {
        return Term.fetch({
          year: this.year,
          term: _term
        });
      }
    }
  }], [{
    key: 'fetch',
    value: function fetch(_ref) {
      var _ref$year = _ref.year;
      var year = _ref$year === undefined ? "DEFAULT" : _ref$year;


      try {
        year = Number(year);
      } catch (e) {
        if (year != "DEFAULT") return new Promise(function (resolve, reject) {
          reject("Invalid Year");
        });
      }

      return new Promise(function (resolve, reject) {
        var client = new _nodeRestClient.Client();
        client.get('http://courses.illinois.edu/cisapp/explorer/catalog/' + year + '.xml', function (data, response) {
          resolve(new Year(year, data['ns2:calendarYear'].terms[0].term.map(function (term) {
            return term._;
          })));
        });
        client = null;
      });
    }
  }]);

  return Year;
}();

var Term = function () {
  function Term(term, year, subjects) {
    _classCallCheck(this, Term);

    this.term = term;
    this.year = year;
    this.subjects = subjects.map(function (_ref2) {
      var title = _ref2.title;
      var code = _ref2.code;
      return { title: _lodash2.default.toUpper(title), code: _lodash2.default.toUpper(code) };
    });
  }

  _createClass(Term, [{
    key: 'subject',
    value: function subject(_subject, active) {
      _subject = _lodash2.default.mapValues(_subject, function (value) {
        return _lodash2.default.toUpper(value);
      });
      _subject = _lodash2.default.find(this.subjects, _lodash2.default.pick(_subject, _lodash2.default.keys(_subject)[0]));

      if (_subject == undefined) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Subject");
        });
      } else {
        return Subject.fetch({
          subject: _subject.code,
          term: this.term,
          year: this.year,
          active: active
        });
      }
    }
  }], [{
    key: 'fetch',
    value: function fetch(_ref3) {
      var _ref3$year = _ref3.year;
      var year = _ref3$year === undefined ? "DEFAULT" : _ref3$year;
      var _ref3$term = _ref3.term;
      var term = _ref3$term === undefined ? "DEFAULT" : _ref3$term;

      return new Promise(function (resolve, reject) {
        var client = new _nodeRestClient.Client();
        client.get('http://courses.illinois.edu/cisapp/explorer/catalog/' + year + '/' + term + '.xml', function (data, response) {
          resolve(new Term(term, year, data['ns2:term'].subjects[0].subject.map(function (subject) {
            return { title: subject._, code: subject.$.id };
          })));
        });
        client = null;
      });
    }
  }]);

  return Term;
}();

var Subject = function () {
  function Subject(subject, term, year, subjectData) {
    _classCallCheck(this, Subject);

    this.subject = subject;
    this.term = term;
    this.year = year;
    this.subjectData = subjectData;
  }

  _createClass(Subject, null, [{
    key: 'fetch',
    value: function fetch(_ref4) {
      var subject = _ref4.subject;
      var _ref4$term = _ref4.term;
      var term = _ref4$term === undefined ? "DEFAULT" : _ref4$term;
      var _ref4$year = _ref4.year;
      var year = _ref4$year === undefined ? "DEFAULT" : _ref4$year;
      var _ref4$active = _ref4.active;
      var active = _ref4$active === undefined ? false : _ref4$active;

      var module = "catalog";
      if (active == true) {
        module = "schedule";
      }
      return new Promise(function (resolve, reject) {
        if (subject == undefined) {
          reject("Invalid Subject");
        } else {
          var client = new _nodeRestClient.Client();
          client.get('http://courses.illinois.edu/cisapp/explorer/' + module + '/' + year + '/' + term + '/' + subject + '.xml?mode=cascade', function (data, response) {
            if (!data['ns2:subject']) {
              reject(data);
            } else {
              resolve(new Subject(subject, term, year, data['ns2:subject']));
            }
          });
          client = null;
        }
      });
    }
  }]);

  return Subject;
}();