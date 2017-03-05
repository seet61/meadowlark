/**
 * Created by seet on 05.03.17.
 * Тестирование межстраничных переходов
 */

var Browser = require('zombie'),
    assert = require('chai').assert;
var browser;

suite('Межстраничные тесты', function () {
    setup(function () {
        browser = new Browser();
    });

    test('запрос расценок для групп со страницы туров по реке Худ ' +
        'должно заполняться поле реферера', function () {
       var referrer = 'http://localhost:3000/tours/hood-river';
       browser.visit(referrer, function () {
          browser.clickLink('.requestsGroupRate', function () {
             assert(browser.field('referrer').value === referrer);
             done();
          });
       });
    });

    test('запрос расценок для групп со страницы туров пансионата "Орегон Коуст" ' +
        'должно заполняться поле реферера', function () {
        var referrer = 'http://localhost:3000/tours/oregon-coast';
        browser.visit(referrer, function () {
            browser.clickLink('.requestsGroupRate', function () {
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('посещение страницы "Запрос цены для групп" напрямую должен выводить к пустому полю реферера', function () {
        browser.visit('http://localhost:3000/tours/request-group-rate', function () {
           assert(browser.field('referrer').value === '');
           done();
        });
    });
});
