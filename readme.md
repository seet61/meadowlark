mongoDB uri mongodb://meadowlark:meadowlarkpassword@10.1.10.150:27017/meadowlarkdb
use meadowlarkdb
db.addUser( { user: "meadowlark", pwd: "meadowlarkpassword", roles: [ "readWrite", "dbAdmin" ]} )



Ошибка:
js-bson: Failed to load c++ bson extension, using pure JS version
----https://toster.ru/q/173381
Забыл написать ответ:
npm install node-gyp -g
rm -rf node_modules
npm cache clean
npm install
Данные команды все исправят