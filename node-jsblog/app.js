

var express = require('express');//引入express框架
var path = require('path');//引入path 模块处理路径
var favicon = require('serve-favicon');//引入serve-favicon的中间件，可以用于请求网页的logo
var logger = require('morgan');//引入morgan中间件记录日志
var cookieParser = require('cookie-parser');//引入cookieParser中间件用于获取web浏览器发送的cookie中的内容
var bodyParser = require('body-parser');//引入bodyParser用于解析客户端请求的body中的内容

var routes = require('./routes/index');//引入路由
/*var users = require('./routes/users');*/
//引入数据库配置文件  同级文件
var settings = require('./setting');
//// 引入flash插件
var flash = require('connect-flash');
//引入会话插件，支持会话
var session = require('express-session');
//将会话保存在mongodb当中去
var MongoStore = require('connect-mongo')(session);
// 创建一个express应用
var app = express();

// view engine setup   视图引擎设置
app.set('views', path.join(__dirname, 'views'));
//改一下，改成ejs模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// 引用你的图标/公共注释   web左上角图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// connect中间件，在开发环境下使用，在终端显示简单的不同颜色的日志
app.use(logger('dev'));
// 引用.json这个方法用来解析json格式的中间件,两个
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 引用中间件
app.use(cookieParser());
// connect 内建的中间件，设置根目录下的 public 文件夹为静态文件服务器，存放 image、css、js 文件于此。
app.use(express.static(path.join(__dirname, 'public')));
//使用flash插件
app.use(flash());
//使用session会话机制
app.use(session({
    //防止篡改cookie
    secret:settings.cookieSecret,
    //设置值
    key:settings.db,
    //cookie的生存周期  30天
    cookies:{maxAge:1000*60*60*24*30},
    //将session的信息存储到数据库当中去.
    store: new MongoStore({
        //连接数据库当中的simple数据库
        url:'mongodb://localhost/simple'
    }),
    // 一些关于session的设置
    resave:false,
    saveUninitialized:true
}))


/*app.use('/', routes);
app.use('/users', users);*/
//将app这个应用传入到routes函数里面进行处理.
routes(app);

// 以下三段代码为错误处理

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//让整个应用启动起来
app.listen(3005,function(){
    console.log('node is OK');
})
module.exports = app;
