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
      if (!_year) {
        _year = "DEFAULT";
      }

      try {
        _year = Number(_year);
        if (!(_lodash2.default.indexOf(this.years, _year) > -1)) {
          return new Promise(function (resolve, reject) {
            reject("Invalid Year");
          });
        }
      } catch (e) {
        if (_year != "DEFAULT") {
          return new Promise(function (resolve, reject) {
            reject("Invalid Year");
          });
        }
      }
      return Year.fetch({ year: _year });
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

      try {
        _term = _lodash2.default.toLower(_term);
      } catch (e) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Term");
        });
      }

      if (_term != "DEFAULT" && !(_lodash2.default.indexOf(this.terms, _term) > -1)) {
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
      var _ref$year = _ref.year,
          year = _ref$year === undefined ? "DEFAULT" : _ref$year;


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
      var title = _ref2.title,
          code = _ref2.code;
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
      var _ref3$year = _ref3.year,
          year = _ref3$year === undefined ? "DEFAULT" : _ref3$year,
          _ref3$term = _ref3.term,
          term = _ref3$term === undefined ? "DEFAULT" : _ref3$term;


      try {
        year = Number(year);
      } catch (e) {
        if (year != "DEFAULT") {
          return new Promise(function (resolve, reject) {
            reject("Invalid Year");
          });
        }
      }

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
  function Subject(subject, term, year, label, collegeCode, departmentCode, unitName, contactName, contactTitle, addressLine1, addressLine2, phoneNumber, webSiteURL, collegeDepartmentDescription, courses) {
    _classCallCheck(this, Subject);

    this.subject = subject;
    this.term = term;
    this.year = year;
    this.label = label;
    this.collegeCode = collegeCode;
    this.departmentCode = departmentCode;
    this.unitName = unitName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.phoneNumber = phoneNumber;
    this.webSiteURL = webSiteURL;
    this.collegeDepartmentDescription = collegeDepartmentDescription;
    this.courses = courses;
  }

  _createClass(Subject, [{
    key: 'course',
    value: function course(_course, active) {

      _course = _lodash2.default.find(this.courses, _lodash2.default.pick(_course, _lodash2.default.keys(_course)[0]));
      if (_course == undefined) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Course");
        });
      } else {
        return Course.fetch({
          course: _course.number,
          subject: this.subject,
          term: this.term,
          year: this.year,
          active: active
        });
      }
    }
  }], [{
    key: 'fetch',
    value: function fetch(_ref4) {
      var subject = _ref4.subject,
          _ref4$term = _ref4.term,
          term = _ref4$term === undefined ? "DEFAULT" : _ref4$term,
          _ref4$year = _ref4.year,
          year = _ref4$year === undefined ? "DEFAULT" : _ref4$year,
          _ref4$active = _ref4.active,
          active = _ref4$active === undefined ? false : _ref4$active;

      var module = "catalog";
      if (active == true) {
        module = "schedule";
      }
      return new Promise(function (resolve, reject) {
        if (subject == undefined) {
          reject("Invalid Subject");
        } else {
          var client = new _nodeRestClient.Client();
          client.get('http://courses.illinois.edu/cisapp/explorer/' + module + '/' + year + '/' + term + '/' + subject + '.xml', function (data, response) {
            if (!data['ns2:subject']) {
              reject(data);
            } else {
              resolve(new Subject(subject, term !== 'DEFAULT' ? term : _lodash2.default.toLower(data['ns2:subject'].parents[0].term[0]._.split(' ')[0]), year !== 'DEFAULT' ? year : data['ns2:subject'].parents[0].calendarYear[0]._, data['ns2:subject'].label[0], data['ns2:subject'].collegeCode[0], data['ns2:subject'].departmentCode[0], data['ns2:subject'].unitName[0], data['ns2:subject'].contactName[0], data['ns2:subject'].contactTitle[0], data['ns2:subject'].addressLine1[0], data['ns2:subject'].addressLine2[0], data['ns2:subject'].phoneNumber[0], data['ns2:subject'].webSiteURL[0], data['ns2:subject'].collegeDepartmentDescription[0], data['ns2:subject'].courses[0].course.map(function (_ref5) {
                var _ = _ref5._,
                    $ = _ref5.$;
                return { course: _, number: $.id };
              })));
            }
          });
          client = null;
        }
      });
    }
  }]);

  return Subject;
}();

var Course = function () {
  function Course(course, subject, term, year, label, description, creditHours, courseSectionInformation, sections) {
    _classCallCheck(this, Course);

    this.course = course;
    this.subject = subject;
    this.term = term;
    this.year = year;
    this.label = label;
    this.description = description;
    this.creditHours = creditHours;
    this.courseSectionInformation = courseSectionInformation;
    this.sections = sections;
  }

  _createClass(Course, [{
    key: 'section',
    value: function section(_section, active) {
      _section = _lodash2.default.find(this.sections, _lodash2.default.pick(_section, _lodash2.default.keys(_section)[0]));

      if (_section == undefined) {
        return new Promise(function (resolve, reject) {
          reject("Invalid Section");
        });
      } else {
        return Section.fetch({
          crn: _section.crn,
          course: this.course,
          subject: this.subject,
          term: this.term,
          year: this.year,
          active: active
        });
      }
    }
  }], [{
    key: 'fetch',
    value: function fetch(_ref6) {
      var course = _ref6.course,
          subject = _ref6.subject,
          _ref6$term = _ref6.term,
          term = _ref6$term === undefined ? "DEFAULT" : _ref6$term,
          _ref6$year = _ref6.year,
          year = _ref6$year === undefined ? "DEFAULT" : _ref6$year,
          _ref6$active = _ref6.active,
          active = _ref6$active === undefined ? false : _ref6$active;

      var module = "catalog";
      if (active == true) {
        module = "schedule";
      }

      return new Promise(function (resolve, reject) {
        if (subject == undefined) {
          reject("Invalid Subject");
        }if (course == undefined) {
          reject("Invalid Course");
        } else {
          var client = new _nodeRestClient.Client();
          client.get('http://courses.illinois.edu/cisapp/explorer/' + module + '/' + year + '/' + term + '/' + subject + '/' + course + '.xml', function (data, response) {
            if (!data['ns2:course']) {
              reject(data);
            } else {
              resolve(new Course(course, subject, term !== 'DEFAULT' ? term : _lodash2.default.toLower(data['ns2:course'].parents[0].term[0]._.split(' ')[0]), year !== 'DEFAULT' ? year : data['ns2:course'].parents[0].calendarYear[0]._, data['ns2:course'].label[0], data['ns2:course'].description[0], data['ns2:course'].creditHours[0], data['ns2:course'].courseSectionInformation[0], active ? data['ns2:course'].sections[0].section.map(function (_ref7) {
                var $ = _ref7.$,
                    _ = _ref7._;
                return { section: _.trim(), crn: $.id.trim() };
              }) : []));
            }
          });
          client = null;
        }
      });
    }
  }]);

  return Course;
}();

var Section = function () {
  function Section(crn, course, subject, term, year, sectionNumber, creditHours, statusCode, partOfTerm, sectionStatusCode, enrollmentStatus, startDate, endDate, meetings) {
    _classCallCheck(this, Section);

    this.course = course;
    this.subject = subject;
    this.term = term;
    this.year = year;
    this.sectionNumber = sectionNumber;
    this.creditHours = creditHours;
    this.statusCode = statusCode;
    this.partOfTerm = partOfTerm;
    this.sectionStatusCode = sectionStatusCode;
    this.enrollmentStatus = enrollmentStatus;
    this.startDate = startDate;
    this.endDate = endDate;
    this.meetings = meetings;
  }

  _createClass(Section, null, [{
    key: 'fetch',
    value: function fetch(_ref8) {
      var crn = _ref8.crn,
          course = _ref8.course,
          subject = _ref8.subject,
          _ref8$term = _ref8.term,
          term = _ref8$term === undefined ? "DEFAULT" : _ref8$term,
          _ref8$year = _ref8.year,
          year = _ref8$year === undefined ? "DEFAULT" : _ref8$year;

      var module = "schedule";

      return new Promise(function (resolve, reject) {
        if (subject == undefined) {
          reject("Invalid Subject");
        }if (course == undefined) {
          reject("Invalid Course");
        }if (crn == undefined) {
          reject("Invalid CRN");
        } else {
          var client = new _nodeRestClient.Client();
          client.get('http://courses.illinois.edu/cisapp/explorer/' + module + '/' + year + '/' + term + '/' + subject + '/' + course + '/' + crn + '.xml', function (data, response) {
            if (!data['ns2:section']) {
              reject(data);
            } else {
              resolve(new Section(crn, course, subject, term !== 'DEFAULT' ? term : _lodash2.default.toLower(data['ns2:section'].parents[0].term[0]._.split(' ')[0]), year !== 'DEFAULT' ? year : data['ns2:section'].parents[0].calendarYear[0]._, data['ns2:section'].sectionNumber[0].trim(), data['ns2:section'].creditHours[0], data['ns2:section'].statusCode[0], data['ns2:section'].partOfTerm[0], data['ns2:section'].sectionStatusCode[0], data['ns2:section'].enrollmentStatus[0], data['ns2:section'].startDate[0], data['ns2:section'].endDate[0], data['ns2:section'].meetings[0].meeting.map(function (meeting) {
                return new Meeting(meeting);
              })));
            }
          });
          client = null;
        }
      });
    }
  }]);

  return Section;
}();

var Meeting = function Meeting(_ref9) {
  var $ = _ref9.$,
      type = _ref9.type,
      start = _ref9.start,
      end = _ref9.end,
      daysOfTheWeek = _ref9.daysOfTheWeek,
      roomNumber = _ref9.roomNumber,
      buildingName = _ref9.buildingName,
      instructors = _ref9.instructors;

  _classCallCheck(this, Meeting);

  this.type = type[0]._;
  this.start = start[0];
  this.end = end[0];
  this.daysOfTheWeek = daysOfTheWeek[0].trim();
  this.roomNumber = roomNumber[0];
  this.buildingName = buildingName[0];
  this.instructors = instructors[0].instructor.map(function (instructor) {
    return instructor._;
  });
};

exports.default = {
  Schedule: Schedule,
  Term: Term,
  Subject: Subject,
  Course: Course,
  getSchedule: function getSchedule(options) {

    if (options) {
      var year = options.year,
          term = options.term,
          subject = options.subject,
          course = options.course;

      if (year) {
        if (term) {
          if (subject) {
            if (course) {
              return Course.fetch(options);
            }
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
};