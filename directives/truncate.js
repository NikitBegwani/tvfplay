angular.module("tvfPlayApp").directive("ngTextTruncate", ["$compile", "ValidationServices", "CharBasedTruncation", "WordBasedTruncation", function($compile, ValidationServices, CharBasedTruncation, WordBasedTruncation) {
    return {
        restrict: "A",
        scope: {
            text: "=ngTextTruncate",
            charsThreshould: "@ngTtCharsThreshold",
            wordsThreshould: "@ngTtWordsThreshold",
            customMoreLabel: "@ngTtMoreLabel",
            customLessLabel: "@ngTtLessLabel"
        },
        controller: function($scope, $element, $attrs) {
            $scope.toggleShow = function() {
                $scope.open = !$scope.open
            }, $scope.useToggling = void 0 === $attrs.ngTtNoToggling
        },
        link: function($scope, $element, $attrs) {
            $scope.open = !1, ValidationServices.failIfWrongThreshouldConfig($scope.charsThreshould, $scope.wordsThreshould);
            var CHARS_THRESHOLD = parseInt($scope.charsThreshould),
                WORDS_THRESHOLD = parseInt($scope.wordsThreshould);
            $scope.$watch("text", function() {
                $element.empty(), CHARS_THRESHOLD ? $scope.text && CharBasedTruncation.truncationApplies($scope, CHARS_THRESHOLD) ? CharBasedTruncation.applyTruncation(CHARS_THRESHOLD, $scope, $element) : $element.append($scope.text) : $scope.text && WordBasedTruncation.truncationApplies($scope, WORDS_THRESHOLD) ? WordBasedTruncation.applyTruncation(WORDS_THRESHOLD, $scope, $element) : $element.append($scope.text)
            })
        }
    }
}]).factory("ValidationServices", function() {
    return {
        failIfWrongThreshouldConfig: function(firstThreshould, secondThreshould) {
            if (!firstThreshould && !secondThreshould || firstThreshould && secondThreshould) throw "You must specify one, and only one, type of threshould (chars or words)"
        }
    }
}).factory("CharBasedTruncation", ["$compile", function($compile) {
    return {
        truncationApplies: function($scope, threshould) {
            return $scope.text.length > threshould
        },
        applyTruncation: function(threshould, $scope, $element) {
            if ($scope.useToggling) {
                var el = angular.element("<span>" + $scope.text.substr(0, threshould) + "<span ng-show='!open'>...</span><span class='btn-link ngTruncateToggleText' ng-click='toggleShow()'ng-show='!open'> " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") + "</span><span ng-show='open'>" + $scope.text.substring(threshould) + "<span class='btn-link ngTruncateToggleText'ng-click='toggleShow()'> " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") + "</span></span></span>");
                $compile(el)($scope), $element.append(el)
            } else $element.append($scope.text.substr(0, threshould) + "...")
        }
    }
}]).factory("WordBasedTruncation", ["$compile", function($compile) {
    return {
        truncationApplies: function($scope, threshould) {
            return $scope.text.split(" ").length > threshould
        },
        applyTruncation: function(threshould, $scope, $element) {
            var splitText = $scope.text.split(" ");
            if ($scope.useToggling) {
                var el = angular.element("<span>" + splitText.slice(0, threshould).join(" ") + " <span ng-show='!open'>...</span><span class='btn-link ngTruncateToggleText' ng-click='toggleShow()'ng-show='!open'> " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") + "</span><span ng-show='open'>" + splitText.slice(threshould, splitText.length).join(" ") + "<span class='btn-link ngTruncateToggleText'ng-click='toggleShow()'> " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") + "</span></span></span>");
                $compile(el)($scope), $element.append(el)
            } else $element.append(splitText.slice(0, threshould).join(" ") + "...")
        }
    }
}]);