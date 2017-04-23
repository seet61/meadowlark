/**
 * Created by dmitry.arefyev on 28.02.2017.
 */

var express = require('express');
var app = express();
var fortune = require('./lib/fortune');

//Логирование
switch (app.get('env')) {
    case 'development':
        //сжатое многоцветное жерналирование для разработки
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        //модуль express-logger, с ротацией через 24 часа
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}

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

//db connect
var mongoose = require('mongoose');
var opts = {
    server: {
        secretOprions: {keepAlive: 1}
    }
};

switch(app.get('env')){
    case 'development':
        mongoose.connect(credentilas.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentilas.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Неизвестная среда выполнения: ' + app.get('env'));
}

//Загрузка файлов
var formidable = require('formidable');

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

//Credentials paremeters
var credentilas = require('./credentials');

//Use cookie
app.use(require('cookie-parser')(credentilas.cookieSecret));
//Use express-session
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentilas.cookieSecret,
}));

//Flash
app.use(function (req, res, next) {
    //Если есть экстренное сообщение поместим его в контекст, а после удалим.
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});


//Идентификация исполнителя запроса
app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) {
        console.log('Исполнитель %d получил запрос', cluster.worker.id);
    }
    next();
});

//Routes
//homepage
app.get('/', function (req, res) {
    res.render('home');
});

//Немного измененная официальная версия регулярки для валидности почты
var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'\*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');

//Запросы с форм
app.get('/newsletter', function (req, res) {
    //CSRF будет позже
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/newsletter', function (req, res) {
    var name = req.body.name || '', email = req.body.email || '';
    console.log('Newsletter sign: ' + name + ' ' + email);
    //Проверка вводимых данных
    if (!email.match(VALID_EMAIL_REGEX)) {
        console.log('Некорректный адрес электронной почты');
        if (req.xhr) {
            return res.json({ error: 'Некорректный адрес электронной почты' });
        }
        req.session.flash = {
            type: 'danger',
            intro: 'Ошибка проверки!',
            message: 'Введенный вами адрес элетронной почты некорретный',
        };
    } else {
        req.session.flash = {
            type: 'success',
            intro: 'Спасибо!',
            message: 'Подписка оформлена.',
        };
    }
    return res.redirect(303, '/newsletter');

    //NewsletterSignup - пример объекта
    /*new NewsletterSignup({ name: name, email:email }).save(function (err) {
        if (err) {
            if (req.xhr) {
                return res.json({ error: 'Ошибка базы данных!!!' });
            }
            req.session.flash = {
                type: 'danger',
                intro: 'Ошибка проверки!',
                message: 'Произошла ошибка база данныхю Пожалуйста, попробуйте позже.',
            }
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) {
            return res.json({ success: true});
        }
        req.session.flash = {
            type: 'success',
            intro: 'Спасибо!',
            message: 'Подписка оформлена.',
        }
        return res.redirect(303, '/newsletter/archive');
    });*/
});

app.post('/process', function (req, res) {
    console.log('Form (from query string): ' + req.query.form + ' ' + req.accepts('json.html'));
    console.log('CSRF token (from hidden field): ' + req.query._csrf);
    console.log('Name (from visible field): ' + req.body.name);
    console.log('Email (from visible field): ' + req.body.email);
    console.log(req.xhr + ' ' + req.accepts('json.html') + ' ' + req.accepts('json.html')==='json');
    if (req.xhr || req.accepts('json.html')==='json'){
        //если здесь возможна ошибка то отправляем {error: 'описание ошибки'}
        res.send({ success: true });
    } else {
        //если была бы ошибка перенаправили на страинцу ошибки
        res.redirect(303, '/thank-you');
    }
});

//Загрузка фоток
app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.cookie('vacation_photo', 'vacation_photo_cookie');
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});

var fs = require('fs');
//Проверяем существует ли каталог
var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdir(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdir(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath){
    //TODO ... добавим позже
}

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    console.log('cookie: ' + req.cookies.vacation_photo);
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if (err) {
            res.session.flash = {
                type: 'danger',
                intro: 'Упс!',
                message: 'Во время обработки отправленной формы произошла ошика. ' +
                    'Пожалуйста повторите еще раз.'
            };
            return res.redirect(303, '/contest/vacation-photo');
        }
        var photo = files.photo;
        var dir = vacationPhotoDir + '/' + Date.now();
        var path = dir + '/' + photo.name;
        fs.mkdirSync(dir);
        fs.renameSync(photo.path, dir + '/' + photo.name);
        saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path);
        req.session.flash = {
            type: 'success',
            intro: 'Удачи!',
            message: 'Вы стали участником конкурса.',
        };
        return res.redirect(303, '/contest/vacation-photo/entries');
    });
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

//headers
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

//fake fail
app.get('epic-fail', function (req, res) {
   process.nextTick(function () {
       throw new Error('Бабах!');
   })
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

function startServer() {
    app.listen(app.get('port'), function () {
        console.log('Express запущено в режиме ' + app.get('env'));
        console.log('Express запущен на http://localhost:' + app.get('port') + '; нажмите Ctrl-C для завершения');
    });
}
if(require.main === module) {
    //Приложение запускается непоcредственно
    startServer();
} else {
    //Приложение импортируется как модуль
    module.exports = startServer;
}