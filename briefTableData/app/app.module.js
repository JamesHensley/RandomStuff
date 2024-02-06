var app = angular.module("briefTableData", [
    // 'ngRoute'
]);

// app.config(['$routeProvider', function($routeProvider) {
//     $routeProvider.
//     when("/drivers", {templateUrl: "partials/drivers.html", controller: "driversController"}).
//     when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverController"}).
//     otherwise({redirectTo: '/drivers'});
// }]);

app.controller("appController", function($scope) {
    $scope.appReady = true;
});


