/**
 * Created by dmitry.arefyev on 28.02.2017.
 */

var express = require('express');
var app = express();
//Механизм шаблонизации страниц
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Статические файлы
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.port || 3000);

//homepage
app.get('/', function (req, res) {
    res.render('home');
});

var fortunes = [
    "Победи свои страхи или они победят тебя",
    "Рекам нужны истоки",
    "Не бойся неведомого",
    "Тебя ждет приятный сюрприз",
    "Будь проще"
];

//about
app.get('/about', function (req, res) {
    var randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    console.log('Предсказание: ' + randomFortune);
    res.render('about', {fortune: randomFortune});
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
    console.log('Express запущен на http://localhost:' + app.get('port') + '; нажмите Ctrl-C для завершения')
});