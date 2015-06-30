var sp=angular.module("snaphoto",["ngAnimate"]);
sp.filter("timestampFormat",function(){
	return function (input) {
		return input.slice(0,10)+" "+input.slice(11,19);
	};
});
sp.controller("snaphotoCtrl",["$animate","$scope","$http","$filter","sortData","$timeout",
function($animate,$scope,$http,$filter,sortData,$timeout){
	var originalData;
	var numberPerRows=3;
	$http.get("/getphotos").success(function(data){
		originalData=data;
		$scope.data=data;
		//$scope.data=sortData(data,numberPerRows);
	});
	$scope.arrange=function(recentFirst){
		$scope.data=$filter("orderBy")(originalData,"taken_time",recentFirst);
		//$scope.data=sortData(data,numberPerRows);	
	};
	$scope.updateTitle=function(id,title) {
		$scope.toggleEditModel(id);
		$http.put("/edit/title/"+id.ID,{changeTitle:id.title});
	};
	$scope.updateTitleKeyPress=function(e,id) {
		if (e.keyCode=="13") {
			$timeout(function () { e.target.blur(); }, 0, false);
		}
	};
	$scope.search=function(){
		var key=$scope.keyword;
		$scope.data=$filter("filter")(originalData,{title:key});
		//$scope.data=sortData(data,numberPerRows);	
	};
	$scope.toggleEditModel=function(id) {
		id.editModel=!id.editModel;	
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