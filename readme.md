mongoDB uri mongodb://meadowlark:meadowlarkpassword@10.1.10.150:27017/meadowlarkdb
use meadowlarkdb
db.addUser( { user: "meadowlark", pwd: "meadowlarkpassword", roles: [ "readWrite", "dbAdmin" ]} )