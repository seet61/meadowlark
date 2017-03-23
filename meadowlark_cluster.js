/**
 * Created by seet on 23.03.17.
 * Запуск приложения как кластер
 */

var cluster = require('cluster');
function startWorker() {
    var worker = cluster.fork();
    console.log('Кластер: Исполнитель %d запущен', worker.id);
}

if(cluster.isMaster) {
    require('os').cpus().forEach(function () {
        startWorker();
    });
    //Записываем в журнал всех отключившихся исполнителей
    //Если исполнитель отключается, то мы ожидаем его корректного окончания, для запуска нового исполнителя
    cluster.on('disconnect', function (worker) {
        console.log('Кластер: Исполнитель %d отключился от кластера', worker.id);
    });
    //Создаем ему замену
    cluster.on('exit', function (worker, code, signal) {
        console.log('Кластер: Исполнитель %d завершил работу с кодом завершения %d (%s)', worker.id, code, signal);
        startWorker();
    });
} else {
    //Запуск приложения на исполнение
    require('./meadowlark.js')();
}
