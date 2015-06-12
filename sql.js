var mysql=require('mysql');
var app=require('./index.js')
var DB={};
var db;
DB.init=function(opt){
	opt.database=opt.database||"snaphoto";
	opt.host=opt.host||"localhost";
	opt.port=opt.port||3306;
	opt.user=opt.user||"root";
	opt.password=opt.password||"";
	db=mysql.createConnection(opt);
	db.connect(function(err){
		if (err) {
			console.log('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + db.threadId);
	});
};

DB.createTable=function(){
	if (!db) {
		console.log("please establish a database connection first");
		return;
	}
	db.query(
		"CREATE TABLE photos ("+
		"ID int NOT NULL AUTO_INCREMENT,"+ 
		"taken_time TIMESTAMP,"+ 
		"maker varchar(255),"+ 
		"model varchar(255),"+ 
		"title varchar(255),"+ 
		"width varchar(255),"+ 
		"height varchar(255),"+ 
		"url text(1024),"+ 
		"focus float,"+ 
		"ISO int(5),"+ 
		"PRIMARY KEY (ID))",   
		function(err){
		if (err) console.log(err);
	});
}

DB.end=function(){
	db.end(function(err){
		if (err) {
			console.log(err);
		}
		console.log("connection with ID "+db.threadId+" is ended");
	});	
};

DB.query=function(query,callback){
	db.query(query,function(err,rows){
		callback(err,rows);
	});
};

module.exports=DB;
