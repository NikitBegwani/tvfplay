 angular.module("tvfPlayApp").directive("autocomplete", function() {
    var index = -1;
    return {
        restrict: "E",
        scope: {
            searchParam: "=ngModel",
            suggestions: "=data",
            onType: "=onType",
            onSelect: "=onSelect",
            autocompleteRequired: "="
        },
        controller: ["$scope", function($scope) {
            $scope.selectedIndex = -1, $scope.initLock = !0, $scope.setIndex = function(i) {
                $scope.selectedIndex = parseInt(i)
            }, this.setIndex = function(i) {
                $scope.setIndex(i), $scope.$apply()
            }, $scope.getIndex = function(i) {
                return $scope.selectedIndex
            };
            var watching = !0;
            $scope.completing = !1, $scope.$watch("searchParam", function(newValue, oldValue) {
                oldValue === newValue || !oldValue && $scope.initLock || (watching && "undefined" != typeof $scope.searchParam && null !== $scope.searchParam && ($scope.completing = !0, $scope.searchFilter = $scope.searchParam, $scope.selectedIndex = -1), $scope.onType && $scope.onType($scope.searchParam))
            }), this.preSelect = function(suggestion) {
                watching = !1, $scope.$apply(), watching = !0
            }, $scope.preSelect = this.preSelect, this.preSelectOff = function() {
                watching = !0
            }, $scope.preSelectOff = this.preSelectOff, $scope.select = function(suggestion) {
                suggestion && ($scope.searchParam = suggestion, $scope.searchFilter = suggestion, $scope.onSelect && $scope.onSelect(suggestion)), watching = !1, $scope.completing = !1, setTimeout(function() {
                    watching = !0
                }, 1e3), $scope.setIndex(-1)
            }
        }],
        link: function(scope, element, attrs) {
            setTimeout(function() {
                scope.initLock = !1, scope.$apply()
            }, 250);
            var attr = "";
            scope.attrs = {
                placeholder: "start typing...",
                "class": "",
                id: "",
                inputclass: "",
                inputid: "",
                inputname: ""
            };
            for (var a in attrs) attr = a.replace("attr", "").toLowerCase(), 0 === a.indexOf("attr") && (scope.attrs[attr] = attrs[a]);
            attrs.clickActivation && (element[0].onclick = function(e) {
                scope.searchParam || setTimeout(function() {
                    scope.completing = !0, scope.$apply()
                }, 200)
            });
            var key = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                enter: 13,
                esc: 27,
                tab: 9
            };
            document.addEventListener("keydown", function(e) {
                var keycode = e.keyCode || e.which;
                switch (keycode) {
                    case key.esc:
                        scope.select(), scope.setIndex(-1), scope.$apply(), e.preventDefault()
                }
            }, !0), document.addEventListener("blur", function(e) {
                setTimeout(function() {
                    scope.select(), scope.setIndex(-1), scope.$apply()
                }, 150)
            }, !0), element[0].addEventListener("keydown", function(e) {
                var keycode = e.keyCode || e.which,
                    l = angular.element(this).find("li").length;
                if (scope.completing && 0 != l) switch (keycode) {
                    case key.up:
                        if (index = scope.getIndex() - 1, -1 > index) index = l - 1;
                        else if (index >= l) {
                            index = -1, scope.setIndex(index), scope.preSelectOff();
                            break
                        }
                        scope.setIndex(index), -1 !== index && scope.preSelect(angular.element(angular.element(this).find("li")[index]).text()), scope.$apply();
                        break;
                    case key.down:
                        if (index = scope.getIndex() + 1, -1 > index) index = l - 1;
                        else if (index >= l) {
                            index = -1, scope.setIndex(index), scope.preSelectOff(), scope.$apply();
                            break
                        }
                        scope.setIndex(index), -1 !== index && scope.preSelect(angular.element(angular.element(this).find("li")[index]).text());
                        break;
                    case key.left:
                        break;
                    case key.right:
                    case key.enter:
                    case key.tab:
                        index = scope.getIndex(), -1 !== index ? (scope.select(angular.element(angular.element(this).find("li")[index]).text()), keycode == key.enter && e.preventDefault()) : keycode == key.enter && scope.select(), scope.setIndex(-1), scope.$apply();
                        break;
                    case key.esc:
                        scope.select(), scope.setIndex(-1), scope.$apply(), e.preventDefault();
                        break;
                    default:
                        return
                }
            })
        },
        template: '<div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">          <input            type="text"            autofocus            ng-model="searchParam"            name="{{ attrs.inputname }}"            placeholder="{{ attrs.placeholder }}"            class="{{ attrs.inputclass }}"            autocomplete="off"            id="{{ attrs.inputid }}"            ng-required="{{ autocompleteRequired }}"            required />          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">            <li              suggestion              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"              index="{{ $index }}"              val="{{ suggestion }}"              ng-class="{ active: ($index === selectedIndex) }"              ng-click="select(suggestion)"              ng-bind-html="suggestion | highlight:searchParam"></li>          </ul>        </div>'
    }
})
//"highlight" filter and "suggestion" directive