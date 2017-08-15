/**
 * Created by Administrator on 2017/8/15.
 */

//    设置文件的路径
var appPath = {
    srcPath:"src/",
    buildPath:"build/",
    distPath:"dist/"
}

// 加载对应的插件
var gulp = require("gulp");
var less = require("gulp-less");
var cssmin = require("gulp-cssmin");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var connect = require("gulp-connect");
var imagemin = require("gulp-imagemin");
var open = require("open");

/**
 *  参数1 任务的名称
 *  参数2 任务所执行的代码
 *
 *  在命令行中通过gulp 加上这里对应的任务名称,就可以执行对应的操作
 *
 *  设置我们下好的框架的和库,需要存放的位置
 * */
gulp.task("lib",function(){
    gulp.src("bower_components/**/*.js")
    .pipe(gulp.dest(appPath.buildPath + "lib"))
    .pipe(gulp.dest(appPath.distPath + "lib"))
    .pipe(connect.reload())
})

// 把我们所写的html的文件,都放到build和dist中
gulp.task("html",function(){
    gulp.src(appPath.srcPath+"**/*.html")
    .pipe(gulp.dest(appPath.buildPath))
    .pipe(gulp.dest(appPath.distPath))
    .pipe(connect.reload())

})

// 把我们编写的less的通过less的插件编译成css文件,放到对应的位置
gulp.task("less",function(){
    gulp.src(appPath.srcPath + "style/index.less")
    .pipe(less())
    .pipe(gulp.dest(appPath.buildPath + "css/"))
    .pipe(cssmin())
    .pipe(gulp.dest(appPath.distPath + "css/"))
    .pipe(connect.reload())
})

// 合并JS
gulp.task("js",function(){
    gulp.src(appPath.srcPath + "js/**/*.js")
    .pipe(concat("index.js"))
    .pipe(gulp.dest(appPath.buildPath + "js/"))
    .pipe(uglify())
    .pipe(gulp.dest(appPath.distPath + "js"))
    .pipe(connect.reload())
})

// 图片的压缩
gulp.task("image",function(){
    gulp.src(appPath.srcPath + "images/**/*")
    .pipe(gulp.dest(appPath.buildPath + "images"))
    .pipe(imagemin())
    .on("error",function(err){
        this.end()
    })
    .pipe(gulp.dest(appPath.distPath + "images"))
    .pipe(connect.reload())
})

// 当创建的任务太多的时候,我们可以定义一个任务,然后把其他的任务以数组的形式放到一起,这样就可以在命令行中执行一个任务,让其数组中的任务都进行操作
gulp.task("build",["less","html","js","image","lib"]);

// 构造服务器,设置运行的目录
gulp.task("server",["build"],function(){
//     设置服务器
    connect.server({
        root:[appPath.buildPath], // 服务器运行的目录
        livereload:true, // 是否需要热更新
        port:7878  // 运行时候的端口号
    })

    /**监听文件的改变
     * 参数1 要监听的内容的位置
     * 参数2 参数1有改变的时候时候,执行这个任务
     * */

    gulp.watch("bower_components/**/*",["lib"]);
    gulp.watch(appPath.srcPath + "**/*.html",["html"]);
    gulp.watch(appPath.srcPath + "js/**/*.js",["js"]);
    gulp.watch(appPath.srcPath + "images/**/*", ["image"]);
    gulp.watch(appPath.srcPath + "style/**/*.less",["less"]);

//    通过浏览器从指定的地址上打开
    open("http://localhost:7878");


})
// 设置默认就会开启服务器
gulp.task("default",["server"]);