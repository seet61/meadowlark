/**
 * Created by seet on 03.03.17.
 */

var fortunes = [
    "Победи свои страхи или они победят тебя",
    "Рекам нужны истоки",
    "Не бойся неведомого",
    "Тебя ждет приятный сюрприз",
    "Будь проще"
];

exports.getFortune = function () {
    var idx = Math.floor(Math.random()*fortunes.length);
    return fortunes[idx];
};