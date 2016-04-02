import uiuc from './../'
import _ from 'lodash'

describe("year", () => {
  let year;

  beforeAll((done) => {
    uiuc.getSchedule()
      .then(schedule => schedule.year(schedule.years[0]))
      .then(data => {
        year = data
        done()
      })
  })

  it("contains the current year", () => {
    expect(year.year).toEqual(jasmine.any(Number))
    expect(year.year).not.toBeNull();
  })

  it("contains an array of terms", () => {
    expect(year.terms).toEqual(jasmine.any(Array))
    expect(year.terms.length).toBeGreaterThan(0);
  })

  describe(".term(term)", () => {

    it("returns a Promise", () => {
      expect(year.term(year.terms[0])).toEqual(jasmine.any(Promise))
    })

    it("returns a term", (done) => {
      year.term(year.terms[0])
        .then((term) => {
          expect(term.constructor.name).toEqual("Term")
          done();
        })
        .catch((err) => {fail(err); done();})
    })

    it("returns a term (lowercase)", (done) => {
      year.term(_.toLower(year.terms[0]))
        .then((term) => {
          expect(term.constructor.name).toEqual("Term")
          done();
        })
        .catch((err) => {fail(err); done();})
    })

    it("returns a term (uppercase)", (done) => {
      year.term(_.toUpper(year.terms[0]))
        .then((term) => {
          expect(term.constructor.name).toEqual("Term")
          done();
        })
        .catch((err) => {fail(err); done();})
    })

    it("throws an error on invalid term", (done) => {
      year.term("LOL")
        .then((term) => {
          fail("Did not throw error")
          done();
        })
        .catch((err) => {
          expect(err).toEqual("Invalid Term");
          done();
        })
    })

  })

})
