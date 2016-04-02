import {Client} from 'node-rest-client'
import _ from 'lodash'

export default class uiuc {
  static getSchedule(options){

    if(options){
      const {year, term, subject} = options
      if(year){
        if(term){
          if(subject){
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
  constructor(subject, term, year, subjectData){
    this.subject = subject
    this.term = term
    this.year = year
    this.subjectData = subjectData
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
        client.get(`http://courses.illinois.edu/cisapp/explorer/${module}/${year}/${term}/${subject}.xml?mode=cascade`, (data, response) => {
          if(!data['ns2:subject']){
            reject(data)
          } else {
            resolve(
              new Subject(
                subject,
                term,
                year,
                data['ns2:subject']
              )
            )
          }
        })
        client = null;
      }
    });
  }

}
