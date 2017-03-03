/**
 * Created by seet on 03.03.17.
 */
suite('Тест страницы "О..."', function () {
   test('страница должна содержать ссылку на страницу контактов', function () {
       assert($('a[href="/contact"]').length);
   })
});
