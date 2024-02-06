import templateFactory from "../services/templateFactory.js";

const testDirective = () => {
    return {
        restrict: "EA",
        scope: "=",
        templateUrl: "components/testDirective.html",
        link: function (scope, element, attribute) {
            scope.testText = 'Jimmy';

            const t = templateFactory();
            console.log(t.testIt());
        }
    }
}

angular.module('briefTableData')
.directive("testDirective", testDirective);