export const copy = () => {
    console.log(app.path.build)
    return app.gulp.src(app.path.src.files)
        .pipe(app.gulp.dest(app.path.build.files))
}