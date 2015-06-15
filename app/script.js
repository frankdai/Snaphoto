var sp=angular.module("snaphoto",[]);
sp.filter("timestampFormat",function(){
	return function (input) {
		return input.slice(0,10)+" "+input.slice(11,19);
	};
});
sp.controller("snaphotoCtrl",["$scope","$http","$filter","sortData",function($scope,$http,$filter,sortData){
	var originalData;
	var numberPerRows=3;
	$http.get("/getphotos").success(function(data){
		originalData=data;
		$scope.data=sortData(data,numberPerRows);
	});
	$scope.arrange=function(recentFirst){
		var data=$filter("orderBy")(originalData,"taken_time",recentFirst);
		$scope.data=sortData(data,numberPerRows);	
	};
	$scope.updateTitle=function(id,title) {
		id.title=title;
		$scope.toggleEditModel(id);
	};
	$scope.search=function(){
		var key=$scope.keyword;
		var data=$filter("filter")(originalData,key);
		$scope.data=sortData(data,numberPerRows);	
	};
}]);
sp.factory("sortData",function(){
	return function(data,numberPerRow){
		var results=[];
		var temp=[];
		for (var i=0;i<data.length;i++) {
			if (i%numberPerRow==0 && i!=0) {
				results.push(temp);
				temp=[];
				temp.push(data[i]);
			}
			else {
				temp.push(data[i]);
			}
		}
		if (temp.length) {
			results.push(temp);
		}
		return results;	
	};
});