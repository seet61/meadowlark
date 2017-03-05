/**
 * Created by seet on 05.03.17.
 */
var fortune = require('../lib/fortune');
var expect = require('chai').expect;
var assert = require('chai').assert;

suite('Тесты предсказаний', function () {
    test('getFortune() должна возвращать предсказание', function () {
       expect(typeof fortune.getFortune() === 'number');
    });

    test('getFortune() должна возвращать предсказание типа string', function () {
        console.log(typeof fortune.getFortune());
        assert(typeof fortune.getFortune() === 'string');
    });
});