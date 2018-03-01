var app = angular.module("app",[]);
app.controller('ConvertCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.rates = [];
	$scope.toRates = [];
	
	$scope.toType = {};
	$scope.fromType = {};
	$scope.fromValue;
	
	$scope.getAllRates = function(){
		$http.get('https://api.fixer.io/latest').then(function(res){
			angular.forEach(res.data.rates,function(value,key){
				if(key == "USD" || key == "CAD"){
					var obj = {value:1, label:key};
					$scope.rates.push(obj);
					if(key == "CAD"){
						$scope.fromType = obj;
						$scope.getRate();
					}
				}
			});
			$scope.rates.push({value:1,label:'EUR'});
		});
	};
	
	$scope.getRate = function(){
		$scope.toRates = [];
		if(typeof $scope.fromType.label !== undefined){
			$http.get('https://api.fixer.io/latest?base=' + $scope.fromType.label).then(function(res){
				$scope.fromValue;
				$scope.toValue;
				angular.forEach(res.data.rates,function(value,key){
					if(key == 'USD' || key == 'CAD' || key == 'EUR'){
						$scope.toRates.push({value:value,label:key});
					}
				});
				$scope.toRates.push($scope.fromType);
				
				//by default set it to first in array
				$scope.toType = $scope.toRates[0];
				
				//run calculation
				$scope.ConvertCurrency();
			});
		}
	};
	
	$scope.ConvertCurrency = function(){
		if($scope.toRates.length > 0){
			$scope.toValue = $scope.fromValue * ($scope.toType.value * (1/$scope.fromType.value));
		}
	};
	
	//init
	$scope.getAllRates();
}]);