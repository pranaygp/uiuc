import uiuc from './../'
import _ from 'lodash'

describe("term", () => {
  let term;

  beforeAll((done) => {
    uiuc.getSchedule()
      .then(schedule => schedule.year(schedule.years[0]))
      .then(year => year.term(year.terms[0]))
      .then(data => {
        term = data;
        done();
      })
  })

  it("contains the current year as a Number", () => {
    expect(term.year).toEqual(jasmine.any(Number))
  })

  it("contains an array of subjects", () => {
    expect(term.subjects).toEqual(jasmine.any(Array))
    expect(term.subjects.length).toBeGreaterThan(0);
  })

  describe(".subject(subject)", () => {

    it("returns a Promise", () => {
      expect(term.subject(term.subjects[0])).toEqual(jasmine.any(Promise))
    })

    it("returns a subject", (done) => {
      term.subject(term.subjects[0])
        .then((subject) => {
          expect(subject.constructor.name).toEqual("Subject")
          done();
        })
        .catch((err) => {fail(err); done();})

      term.subject(term.subjects[0], true)
        .then((subject) => {
          expect(subject.constructor.name).toEqual("Subject")
          done();
        })
        .catch((err) => {fail(err); done();})
    })

    it("throws an error on invalid subject", (done) => {
      term.subject({code: "LOLOLOLOLOLOL"})
        .then((subject) => {
          fail("Did not throw error")
          done();
        })
        .catch((err) => {
          expect(err).toEqual("Invalid Subject");
          done();
        })
    })

  })

})
