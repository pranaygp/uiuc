const gulp = require("gulp")
const babel = require("gulp-babel")

gulp.task("build-test", () => {
  return gulp.src("spec/src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("spec"))
})

gulp.task("default", () => {
  return gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"))
})
