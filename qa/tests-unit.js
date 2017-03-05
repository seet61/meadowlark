/**
 * Created by seet on 05.03.17.
 */
var fortune = require('../lib/fortune');
var expect = require('chai').expect;

suite('Тесты предсказаний', function () {
    test('getFortune() должна возвращать предсказание', function () {
       expect(typeof fortune.getFortune() === 'string');
    });
});