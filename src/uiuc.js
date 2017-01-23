import {Client} from 'node-rest-client'
import _ from 'lodash'

class Schedule{
  constructor(years){
    this.years = years.map((year) => Number(year))
  }

  year(year){
    if(!year){
      year = "DEFAULT"
    }

    try{
      year = Number(year)
      if(! ( _.indexOf(this.years, year) > -1 )){
        return new Promise(function(resolve, reject) {
            reject("Invalid Year");
        });
      }
    } catch(e){
      if(year != "DEFAULT"){
        return new Promise(function(resolve, reject) {
            reject("Invalid Year");
        });
      }
    }
    return Year.fetch({year})

  }

  static fetch(){
    return new Promise(function(resolve, reject) {
      let client = new Client();
      client.get("http://courses.illinois.edu/cisapp/explorer/schedule.xml", (data, response) => {
        resolve(new Schedule(data['ns2:schedule'].calendarYears[0].calendarYear.map((calendarYear) => calendarYear._)))
      })
      client = null;
    });
  }
}

class Year{
  constructor(year, terms){
    this.year = year
    this.terms = terms
      .map(string => _.words(string)[0])
      .map(string => _.toLower(string))
  }

  term(term){

    try {
      term = _.toLower(term)
    } catch(e){
      return new Promise(function(resolve, reject) {
        reject("Invalid Term")
      });
    }

    if(term != "DEFAULT" && ! ( _.indexOf(this.terms, term) > -1 )){
      return new Promise(function(resolve, reject) {
          reject("Invalid Term");
      });
    } else {
      return Term.fetch({
        year: this.year,
        term: term
      });
    }


  }

  static fetch({year = "DEFAULT"}){

    try {
      year = Number(year);
    } catch (e) {
      if(year != "DEFAULT")
        return new Promise(function(resolve, reject) {
          reject("Invalid Year")
        });
    }

    return new Promise((resolve, reject) => {
        let client = new Client();
        client.get(`http://courses.illinois.edu/cisapp/explorer/catalog/${year}.xml`, (data, response) => {
          resolve(
            new Year(
              year,
              data['ns2:calendarYear']
                .terms[0]
                .term.map((term) => term._)
            )
          )
        })
        client = null;
    });
  }
}

class Term{
  constructor(term, year, subjects){
    this.term = term
    this.year = year
    this.subjects = subjects
      .map(({title, code}) => ({title: _.toUpper(title), code: _.toUpper(code)}))
  }

  subject(subject, active){
    subject = _.mapValues(subject, (value) => _.toUpper(value))
    subject = _.find(this.subjects, _.pick(subject, _.keys(subject)[0]))

    if(subject == undefined){
      return new Promise(function(resolve, reject) {
          reject("Invalid Subject")
      });
    } else {
      return Subject.fetch({
        subject: subject.code,
        term: this.term,
        year: this.year,
        active: active
      })
    }

  }

  static fetch({year = "DEFAULT", term = "DEFAULT"}){

    try{
      year = Number(year)
    } catch(e){
      if(year != "DEFAULT"){
        return new Promise(function(resolve, reject) {
          reject("Invalid Year");
        });
      }
    }

    return new Promise((resolve, reject) => {
        let client = new Client();
        client.get(`http://courses.illinois.edu/cisapp/explorer/catalog/${year}/${term}.xml`, (data, response) => {
          resolve(
            new Term(
              term,
              year,
              data['ns2:term']
                .subjects[0]
                .subject.map((subject) => ({title: subject._, code: subject.$.id}) )
            )
          )
        })
        client = null;
    });
  }
}

class Subject{
  constructor(subject, term, year, label, collegeCode, departmentCode, unitName, contactName, contactTitle, addressLine1, addressLine2, phoneNumber, webSiteURL, collegeDepartmentDescription, courses){
    this.subject = subject
    this.term = term
    this.year = year
    this.label = label
    this.collegeCode = collegeCode
    this.departmentCode = departmentCode
    this.unitName = unitName
    this.contactName = contactName
    this.contactTitle = contactTitle
    this.addressLine1 = addressLine1
    this.addressLine2 = addressLine2
    this.phoneNumber = phoneNumber
    this.webSiteURL = webSiteURL
    this.collegeDepartmentDescription = collegeDepartmentDescription
    this.courses = courses
  }

  course(course, active){
    
    course = _.find(this.courses, _.pick(course, _.keys(course)[0]))
    if(course == undefined){
      return new Promise(function(resolve, reject) {
          reject("Invalid Course")
      });
    } else {
      return Course.fetch({
        course: course.number,
        subject: this.subject,
        term: this.term,
        year: this.year,
        active: active
      })
    }

  }

  static fetch({subject, term = "DEFAULT", year="DEFAULT", active = false}){
    let module = "catalog"
    if(active == true){
      module = "schedule"
    }
    return new Promise((resolve, reject) => {
      if(subject == undefined){
        reject("Invalid Subject")
      } else {
        let client = new Client();
        client.get(`http://courses.illinois.edu/cisapp/explorer/${module}/${year}/${term}/${subject}.xml`, (data, response) => {
          if(!data['ns2:subject']){
            reject(data)
          } else {
            resolve(
              new Subject(
                subject,
                term !== 'DEFAULT' ? term : _.toLower(data['ns2:subject'].parents[0].term[0]._.split(' ')[0]),
                year !== 'DEFAULT' ? year : data['ns2:subject'].parents[0].calendarYear[0]._,
                data['ns2:subject'].label[0],
                data['ns2:subject'].collegeCode[0],
                data['ns2:subject'].departmentCode[0],
                data['ns2:subject'].unitName[0],
                data['ns2:subject'].contactName[0],
                data['ns2:subject'].contactTitle[0],
                data['ns2:subject'].addressLine1[0],
                data['ns2:subject'].addressLine2[0],
                data['ns2:subject'].phoneNumber[0],
                data['ns2:subject'].webSiteURL[0],
                data['ns2:subject'].collegeDepartmentDescription[0],
                data['ns2:subject'].courses[0].course.map(({_, $}) => ({course: _, number: $.id}))
              )
            )
          }
        })
        client = null;
      }
    });
  }

}

class Course{
  constructor(course, subject, term, year, label, description, creditHours, courseSectionInformation, sections){
    this.course = course
    this.subject = subject
    this.term = term
    this.year = year
    this.label = label
    this.description = description
    this.creditHours = creditHours
    this.courseSectionInformation = courseSectionInformation
    this.sections = sections
  }

  section(section, active){
    section = _.find(this.sections, _.pick(section, _.keys(section)[0]))

    if(section == undefined){
      return new Promise(function(resolve, reject) {
          reject("Invalid Section")
      });
    } else {
      return Section.fetch({
        crn: section.crn,
        course: this.course,
        subject: this.subject,
        term: this.term,
        year: this.year,
        active: active
      })
    }

  }

  static fetch({course, subject, term = "DEFAULT", year="DEFAULT", active = false}){
    let module = "catalog"
    if(active == true){
      module = "schedule"
    }

    return new Promise((resolve, reject) => {
      if(subject == undefined){
        reject("Invalid Subject")
      } if(course == undefined){
        reject("Invalid Course")
      } else {
        let client = new Client();
        client.get(`http://courses.illinois.edu/cisapp/explorer/${module}/${year}/${term}/${subject}/${course}.xml`, (data, response) => {
          if(!data['ns2:course']){
            reject(data)
          } else {
            resolve(
              new Course(
                course,
                subject,
                term !== 'DEFAULT' ? term : _.toLower(data['ns2:course'].parents[0].term[0]._.split(' ')[0]),
                year !== 'DEFAULT' ? year : data['ns2:course'].parents[0].calendarYear[0]._,
                data['ns2:course'].label[0],
                data['ns2:course'].description[0],
                data['ns2:course'].creditHours[0],
                data['ns2:course'].courseSectionInformation[0],
                active ? data['ns2:course'].sections[0].section.map(({$, _}) => ({section: _.trim(), crn: $.id.trim()})) : []
              )
            )
          }
        })
        client = null;
      }
    });
  }

}

class Section{
  constructor(crn, course, subject, term, year, sectionNumber, creditHours , statusCode, partOfTerm, sectionStatusCode, enrollmentStatus, startDate, endDate, meetings){
    this.course = course
    this.subject = subject
    this.term = term
    this.year = year
    this.sectionNumber = sectionNumber
    this.creditHours  = creditHours 
    this.statusCode = statusCode
    this.partOfTerm = partOfTerm
    this.sectionStatusCode = sectionStatusCode
    this.enrollmentStatus = enrollmentStatus
    this.startDate = startDate
    this.endDate = endDate
    this.meetings = meetings
  }

  static fetch({crn, course, subject, term = "DEFAULT", year="DEFAULT"}){
    let module = "schedule"
    
    return new Promise((resolve, reject) => {
      if(subject == undefined){
        reject("Invalid Subject")
      } if(course == undefined){
        reject("Invalid Course")
      } if(crn == undefined){
        reject("Invalid CRN")
      } else {
        let client = new Client();
        client.get(`http://courses.illinois.edu/cisapp/explorer/${module}/${year}/${term}/${subject}/${course}/${crn}.xml`, (data, response) => {
          if(!data['ns2:section']){
            reject(data)
          } else {
            resolve(
              new Section(
                crn,
                course,
                subject,
                term !== 'DEFAULT' ? term : _.toLower(data['ns2:section'].parents[0].term[0]._.split(' ')[0]),
                year !== 'DEFAULT' ? year : data['ns2:section'].parents[0].calendarYear[0]._,
                data['ns2:section'].sectionNumber[0].trim(),
                data['ns2:section'].creditHours[0],
                data['ns2:section'].statusCode[0],
                data['ns2:section'].partOfTerm[0],
                data['ns2:section'].sectionStatusCode[0],
                data['ns2:section'].enrollmentStatus[0],
                data['ns2:section'].startDate[0],
                data['ns2:section'].endDate[0],
                data['ns2:section'].meetings[0].meeting.map(meeting => new Meeting(meeting))
              )
            )
          }
        })
        client = null;
      }
    });
  }

}

class Meeting{
  constructor({$, type, start, end, daysOfTheWeek, roomNumber, buildingName, instructors}){
    this.type = type[0]._
    this.start = start[0]
    this.end = end[0]
    this.daysOfTheWeek = daysOfTheWeek[0].trim()
    this.roomNumber = roomNumber[0]
    this.buildingName = buildingName[0]
    this.instructors = instructors[0].instructor.map(instructor => instructor._)
  }
}


export default {
  Schedule: Schedule,
  Term: Term,
  Subject: Subject,
  Course: Course,
  getSchedule(options){

    if(options){
      const {year, term, subject, course} = options
      if(year){
        if(term){
          if(subject){
            if(course) {
              return Course.fetch(options)
            }
            return Subject.fetch(options)
          }
          return Term.fetch(options)
        }
        return Year.fetch(options)
      }
    } else {
      return Schedule.fetch()
    }

  }
}