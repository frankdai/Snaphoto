var sp=angular.module("snaphoto",["ngAnimate"]);
sp.filter("timestampFormat",function(){
	return function (input) {
		if (input&&input.slice) {
			return input.slice(0,10)+" "+input.slice(11,19);
		} else {
			return null;
		}
	};
});
sp.controller("snaphotoCtrl",["$animate","$scope","$http","$filter","$timeout",
function($animate,$scope,$http,$filter,$timeout){
	var originalData;
	$http.get("/getphotos").success(function(data){
		$scope.data=$filter("orderBy")(data,"ID",true);	
		originalData=angular.copy(data);
	});
	$scope.arrange=function(recentFirst){
		$scope.data=$filter("orderBy")(originalData,"taken_time",recentFirst);	
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
	};
	$scope.toggleEditModel=function(id) {
		id.editModel=!id.editModel;	
	};
}]);