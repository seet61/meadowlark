/**
 * Created by dmitry.arefyev on 28.02.2017.
 */

var express = require('express');
var app = express();
var fortune = require('./lib/fortune');

//Механизм шаблонизации страниц
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Статические файлы
app.use(express.static(__dirname + '/public'));

//Порт приложения
app.set('port', process.env.port || 3000);

//Парсер URL
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

//Routes
//homepage
app.get('/', function (req, res) {
    res.render('home');
});

//Запросы с форм
app.get('/newsletter', function (req, res) {
    //CSRF будет позже
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function (req, res) {
    console.log('Form (from query string): ' + req.query.form + ' ' + req.accepts('json.html'));
    console.log('CSRF token (from hidden field): ' + req.query._csrf);
    console.log('Name (from visible field): ' + req.body.name);
    console.log('Email (from visible field): ' + req.body.email);
    if (req.xhr || req.accepts('json.html')==='json'){
        //если здесь возможна ошибка то отправляем {error: 'описание ошибки'}
        res.send({ success: true });
    } else {
        //если была бы ошибка перенаправили на страинцу ошибки
        res.redirect(303, '/thank-you');
    }
});

//Туры
app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});


app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

//about
app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.header(name) + '\n';
    }
    res.send(s);
});




//about
app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});


//404 page
app.use(function (req, res) {
   res.status(404);
   res.render('404');
});

//500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express запущен на http://localhost:' + app.get('port') + '; нажмите Ctrl-C для завершения');
});