var db=require("./sql.js");
var ExifImage = require('exif').ExifImage;
var fs=require("fs");
var express=require("express");
var exp=express();
var database;
var app={};
var data=[];
var IDCount=1;
var formatTime=function(input){
	var year=input.slice(0,4);
	var month=input.slice(5,7);
	var day=input.slice(8,10);
	var rest=input.slice(11);
	return year+"-"+month+"-"+day+" "+rest;
};
app.install=function(databaseOpt){
	db.init(databaseOpt);
	db.createTable();	
	db.end();
};
app.init=function() {
	db.init({password:"2845284frank"});
	var data=[];
	db.query("SELECT * FROM photos",function(err,rows){
		data=rows;
	});
	exp.use('/photos', express.static('photos'));
	exp.use('/bower_components', express.static('bower_components'));
	exp.use('/app', express.static('app'));
	exp.get("/getphotos",function(req,res){
		var data=[];
		db.query("SELECT * FROM photos",function(err,rows){
			data=rows;
			res.json(data);
		});
	});
	exp.get("/",function(req,res){
		res.sendFile('index.html',{root: __dirname});
	});
	exp.listen(3030);
};
app.scan=function(){
	db.init({password:"2845284frank"});
	fs.readdir('./photos',function(err,files){
		if (err) {return err;};
		files.forEach(function(file){
			try {
	    		new ExifImage({ image : './photos/'+file }, function (error, exif) {
			        if (error) {
			            console.log('Error: '+error.message);
						return err;
					} 
					else {
						var single={
							id:IDCount++,
							time:formatTime(exif.image.ModifyDate)||null,
							maker:exif.image.Make||null,
							model:exif.image.Model||null,
							width:exif.exif.ExifImageWidth||null,
							height:exif.exif.ExifImageHeight||null,
							title:file.toString().replace(/\..+$/, ''),
							url:file.toString(),
							focus:exif.exif.FNumber||null,
							iso:exif.exif.ISO||null
						};
						var stamp=new Date().getTime();
						var queryString="INSERT INTO photos (taken_time,maker,model,title,width,height,focus,iso,url) "+
						"VALUES ('"+
						single.time+"','"+
						single.maker+"','"+
						single.model+"','"+
						single.title+"','"+
						single.width+"','"+
						single.height+"','"+
						single.focus+"','"+
						single.iso+"','"+
						single.url+"')";
						db.query(
						queryString,
						function(err,rows){
							if (err) console.log(err);
						});		
						data.push(single);
					}
			    });
			} catch (error) {
			    console.log('Error: ' + error.message);
				return err;
			}	
		});
	});
};
app.data=data;
module.exports=app;
