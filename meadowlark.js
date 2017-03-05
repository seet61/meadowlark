/**
 * Created by dmitry.arefyev on 28.02.2017.
 */

var express = require('express');
var app = express();
var fortune = require('./lib/fortune');

//Механизм шаблонизации страниц
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Статические файлы
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.port || 3000);

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

//Routes
//homepage
app.get('/', function (req, res) {
    res.render('home');
});

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