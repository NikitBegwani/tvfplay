angular.module("ui.bootstrap", 
	["ui.bootstrap.tpls", "ui.bootstrap.transition",  //
	"ui.bootstrap.collapse", "ui.bootstrap.accordion", 
	"ui.bootstrap.alert", "ui.bootstrap.bindHtml", 
	"ui.bootstrap.buttons", "ui.bootstrap.carousel", 
	"ui.bootstrap.dateparser", "ui.bootstrap.position", 
	"ui.bootstrap.datepicker", "ui.bootstrap.dropdown", //
	"ui.bootstrap.modal", "ui.bootstrap.pagination", //
	"ui.bootstrap.tooltip", "ui.bootstrap.popover", //
	"ui.bootstrap.progressbar", "ui.bootstrap.rating", //
	"ui.bootstrap.tabs", "ui.bootstrap.timepicker", //
	"ui.bootstrap.typeahead"]); //

angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html", "template/accordion/accordion.html", 
	"template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html",
	 "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html",
	  "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", 
	"template/pagination/pagination.html", "template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html", 
	"template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", 
	"template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", 
	"template/timepicker/timepicker.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]);

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/accordion/accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>')
    }]), angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>')
    }]), angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
    }]), angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')
    }]), angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/carousel/slide.html", "<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")
    }]), angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')
    }]), angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n');
    }]), angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/datepicker/popup.html", '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')
    }]), angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/modal/backdrop.html", '<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
    }]), angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/modal/window.html", '<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>')
    }]), angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')
    }]), angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')
    }]), angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')
    }]), angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/tooltip/tooltip-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
    }]), angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/popover/popover.html", '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
    }]), angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')
    }]), angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/progressbar/progress.html", '<div class="progress" ng-transclude></div>')
    }]), angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')
    }]), angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')
    }]), angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')
    }]), angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
    }]), angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/timepicker/timepicker.html", '<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')
    }]), angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
    }]), angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
    }]);

angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"])
    .factory("typeaheadParser", ["$parse", function($parse) {
        var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function(input) {
                var match = input.match(TYPEAHEAD_REGEXP);
                if (!match) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + input + '".');
                return {
                    itemName: match[3],
                    source: $parse(match[4]),
                    viewMapper: $parse(match[2] || match[1]),
                    modelMapper: $parse(match[1])
                }
            }
        }
    }]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {
        var HOT_KEYS = [9, 13, 27, 38, 40];
        return {
            require: "ngModel",
            link: function(originalScope, element, attrs, modelCtrl) {
                var hasFocus, minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1,
                    waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0,
                    isEditable = originalScope.$eval(attrs.typeaheadEditable) !== !1,
                    isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop,
                    onSelectCallback = $parse(attrs.typeaheadOnSelect),
                    inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : void 0,
                    appendToBody = attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : !1,
                    $setModelValue = $parse(attrs.ngModel).assign,
                    parserResult = typeaheadParser.parse(attrs.typeahead),
                    scope = originalScope.$new();
                originalScope.$on("$destroy", function() {
                    scope.$destroy()
                });
                var popupId = "typeahead-" + scope.$id + "-" + Math.floor(1e4 * Math.random());
                element.attr({
                    "aria-autocomplete": "list",
                    "aria-expanded": !1,
                    "aria-owns": popupId
                });
                var popUpEl = angular.element("<div typeahead-popup></div>");
                popUpEl.attr({
                    id: popupId,
                    matches: "matches",
                    active: "activeIdx",
                    select: "select(activeIdx)",
                    query: "query",
                    position: "position"
                }), angular.isDefined(attrs.typeaheadTemplateUrl) && popUpEl.attr("template-url", attrs.typeaheadTemplateUrl);
                var resetMatches = function() {
                        scope.matches = [], scope.activeIdx = -1, element.attr("aria-expanded", !1)
                    },
                    getMatchId = function(index) {
                        return popupId + "-option-" + index
                    };
                scope.$watch("activeIdx", function(index) {
                    0 > index ? element.removeAttr("aria-activedescendant") : element.attr("aria-activedescendant", getMatchId(index))
                });
                var getMatchesAsync = function(inputValue) {
                    var locals = {
                        $viewValue: inputValue
                    };
                    isLoadingSetter(originalScope, !0), $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
                        var onCurrentRequest = inputValue === modelCtrl.$viewValue;
                        if (onCurrentRequest && hasFocus)
                            if (matches.length > 0) {
                                scope.activeIdx = 0, scope.matches.length = 0;
                                for (var i = 0; i < matches.length; i++) locals[parserResult.itemName] = matches[i], scope.matches.push({
                                    id: getMatchId(i),
                                    label: parserResult.viewMapper(scope, locals),
                                    model: matches[i]
                                });
                                scope.query = inputValue, scope.position = appendToBody ? $position.offset(element) : $position.position(element), scope.position.top = scope.position.top + element.prop("offsetHeight"), element.attr("aria-expanded", !0)
                            } else resetMatches();
                        onCurrentRequest && isLoadingSetter(originalScope, !1)
                    }, function() {
                        resetMatches(), isLoadingSetter(originalScope, !1)
                    })
                };
                resetMatches(), scope.query = void 0;
                var timeoutPromise, scheduleSearchWithTimeout = function(inputValue) {
                        timeoutPromise = $timeout(function() {
                            getMatchesAsync(inputValue)
                        }, waitTime)
                    },
                    cancelPreviousTimeout = function() {
                        timeoutPromise && $timeout.cancel(timeoutPromise)
                    };
                modelCtrl.$parsers.unshift(function(inputValue) {
                    return hasFocus = !0, inputValue && inputValue.length >= minSearch ? waitTime > 0 ? (cancelPreviousTimeout(), scheduleSearchWithTimeout(inputValue)) : getMatchesAsync(inputValue) : (isLoadingSetter(originalScope, !1), cancelPreviousTimeout(), resetMatches()), isEditable ? inputValue : inputValue ? void modelCtrl.$setValidity("editable", !1) : (modelCtrl.$setValidity("editable", !0), inputValue)
                }), modelCtrl.$formatters.push(function(modelValue) {
                    var candidateViewValue, emptyViewValue, locals = {};
                    return inputFormatter ? (locals.$model = modelValue, inputFormatter(originalScope, locals)) : (locals[parserResult.itemName] = modelValue, candidateViewValue = parserResult.viewMapper(originalScope, locals), locals[parserResult.itemName] = void 0, emptyViewValue = parserResult.viewMapper(originalScope, locals), candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue)
                }), scope.select = function(activeIdx) {
                    var model, item, locals = {};
                    locals[parserResult.itemName] = item = scope.matches[activeIdx].model, model = parserResult.modelMapper(originalScope, locals), $setModelValue(originalScope, model), modelCtrl.$setValidity("editable", !0), onSelectCallback(originalScope, {
                        $item: item,
                        $model: model,
                        $label: parserResult.viewMapper(originalScope, locals)
                    }), resetMatches(), $timeout(function() {
                        element[0].focus()
                    }, 0, !1)
                }, element.bind("keydown", function(evt) {
                    0 !== scope.matches.length && -1 !== HOT_KEYS.indexOf(evt.which) && (evt.preventDefault(), 40 === evt.which ? (scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length, scope.$digest()) : 38 === evt.which ? (scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1, scope.$digest()) : 13 === evt.which || 9 === evt.which ? scope.$apply(function() {
                        scope.select(scope.activeIdx)
                    }) : 27 === evt.which && (evt.stopPropagation(), resetMatches(), scope.$digest()))
                }), element.bind("blur", function(evt) {
                    hasFocus = !1
                });
                var dismissClickHandler = function(evt) {
                    element[0] !== evt.target && (resetMatches(), scope.$digest())
                };
                $document.bind("click", dismissClickHandler), originalScope.$on("$destroy", function() {
                    $document.unbind("click", dismissClickHandler)
                });
                var $popup = $compile(popUpEl)(scope);
                appendToBody ? $document.find("body").append($popup) : element.after($popup)
            }
        }
    }]).directive("typeaheadPopup", function() {
        return {
            restrict: "EA",
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "=",
                select: "&"
            },
            replace: !0,
            templateUrl: "template/typeahead/typeahead-popup.html",
            link: function(scope, element, attrs) {
                scope.templateUrl = attrs.templateUrl, scope.isOpen = function() {
                    return scope.matches.length > 0
                }, scope.isActive = function(matchIdx) {
                    return scope.active == matchIdx
                }, scope.selectActive = function(matchIdx) {
                    scope.active = matchIdx
                }, scope.selectMatch = function(activeIdx) {
                    scope.select({
                        activeIdx: activeIdx
                    })
                }
            }
        }
    }).directive("typeaheadMatch", ["$http", "$templateCache", "$compile", "$parse", function($http, $templateCache, $compile, $parse) {
        return {
            restrict: "EA",
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(scope, element, attrs) {
                var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || "template/typeahead/typeahead-match.html";
                $http.get(tplUrl, {
                    cache: $templateCache
                }).success(function(tplContent) {
                    element.replaceWith($compile(tplContent.trim())(scope))
                })
            }
        }
    }]).filter("typeaheadHighlight", function() {
        function escapeRegexp(queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }
        return function(matchItem, query) {
            return query ? ("" + matchItem).replace(new RegExp(escapeRegexp(query), "gi"), "<strong>$&</strong>") : matchItem
        }
    });

angular.module("ui.bootstrap.timepicker", [])
.constant("timepickerConfig", {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: !0,
        meridians: null,
        readonlyInput: !1,
        mousewheel: !0
}).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
        function getHoursFromTemplate() {
            var hours = parseInt($scope.hours, 10),
                valid = $scope.showMeridian ? hours > 0 && 13 > hours : hours >= 0 && 24 > hours;
            return valid ? ($scope.showMeridian && (12 === hours && (hours = 0), $scope.meridian === meridians[1] && (hours += 12)), hours) : void 0
        }

        function getMinutesFromTemplate() {
            var minutes = parseInt($scope.minutes, 10);
            return minutes >= 0 && 60 > minutes ? minutes : void 0
        }

        function pad(value) {
            return angular.isDefined(value) && value.toString().length < 2 ? "0" + value : value
        }

        function refresh(keyboardChange) {
            makeValid(), ngModelCtrl.$setViewValue(new Date(selected)), updateTemplate(keyboardChange)
        }

        function makeValid() {
            ngModelCtrl.$setValidity("time", !0), $scope.invalidHours = !1, $scope.invalidMinutes = !1
        }

        function updateTemplate(keyboardChange) {
            var hours = selected.getHours(),
                minutes = selected.getMinutes();
            $scope.showMeridian && (hours = 0 === hours || 12 === hours ? 12 : hours % 12), $scope.hours = "h" === keyboardChange ? hours : pad(hours), $scope.minutes = "m" === keyboardChange ? minutes : pad(minutes), $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1]
        }

        function addMinutes(minutes) {
            var dt = new Date(selected.getTime() + 6e4 * minutes);
            selected.setHours(dt.getHours(), dt.getMinutes()), refresh()
        }
        var selected = new Date,
            ngModelCtrl = {
                $setViewValue: angular.noop
            },
            meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;
        this.init = function(ngModelCtrl_, inputs) {
            ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = this.render;
            var hoursInputEl = inputs.eq(0),
                minutesInputEl = inputs.eq(1),
                mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
            mousewheel && this.setupMousewheelEvents(hoursInputEl, minutesInputEl), $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput, this.setupInputEvents(hoursInputEl, minutesInputEl)
        };
        var hourStep = timepickerConfig.hourStep;
        $attrs.hourStep && $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
            hourStep = parseInt(value, 10)
        });
        var minuteStep = timepickerConfig.minuteStep;
        $attrs.minuteStep && $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
            minuteStep = parseInt(value, 10)
        }), $scope.showMeridian = timepickerConfig.showMeridian, $attrs.showMeridian && $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
            if ($scope.showMeridian = !!value, ngModelCtrl.$error.time) {
                var hours = getHoursFromTemplate(),
                    minutes = getMinutesFromTemplate();
                angular.isDefined(hours) && angular.isDefined(minutes) && (selected.setHours(hours), refresh())
            } else updateTemplate()
        }), this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl) {
            var isScrollingUp = function(e) {
                e.originalEvent && (e = e.originalEvent);
                var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                return e.detail || delta > 0
            };
            hoursInputEl.bind("mousewheel wheel", function(e) {
                $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours()), e.preventDefault()
            }), minutesInputEl.bind("mousewheel wheel", function(e) {
                $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes()), e.preventDefault()
            })
        }, this.setupInputEvents = function(hoursInputEl, minutesInputEl) {
            if ($scope.readonlyInput) return $scope.updateHours = angular.noop, void($scope.updateMinutes = angular.noop);
            var invalidate = function(invalidHours, invalidMinutes) {
                ngModelCtrl.$setViewValue(null), ngModelCtrl.$setValidity("time", !1), angular.isDefined(invalidHours) && ($scope.invalidHours = invalidHours), angular.isDefined(invalidMinutes) && ($scope.invalidMinutes = invalidMinutes)
            };
            $scope.updateHours = function() {
                var hours = getHoursFromTemplate();
                angular.isDefined(hours) ? (selected.setHours(hours), refresh("h")) : invalidate(!0)
            }, hoursInputEl.bind("blur", function(e) {
                !$scope.invalidHours && $scope.hours < 10 && $scope.$apply(function() {
                    $scope.hours = pad($scope.hours)
                })
            }), $scope.updateMinutes = function() {
                var minutes = getMinutesFromTemplate();
                angular.isDefined(minutes) ? (selected.setMinutes(minutes), refresh("m")) : invalidate(void 0, !0)
            }, minutesInputEl.bind("blur", function(e) {
                !$scope.invalidMinutes && $scope.minutes < 10 && $scope.$apply(function() {
                    $scope.minutes = pad($scope.minutes)
                })
            })
        }, this.render = function() {
            var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
            isNaN(date) ? (ngModelCtrl.$setValidity("time", !1), $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (date && (selected = date), makeValid(), updateTemplate())
        }, $scope.incrementHours = function() {
            addMinutes(60 * hourStep)
        }, $scope.decrementHours = function() {
            addMinutes(60 * -hourStep)
        }, $scope.incrementMinutes = function() {
            addMinutes(minuteStep)
        }, $scope.decrementMinutes = function() {
            addMinutes(-minuteStep)
        }, $scope.toggleMeridian = function() {
            addMinutes(720 * (selected.getHours() < 12 ? 1 : -1))
        }
}]).directive("timepicker", function() {
        return {
            restrict: "EA",
            require: ["timepicker", "?^ngModel"],
            controller: "TimepickerController",
            replace: !0,
            scope: {},
            templateUrl: "template/timepicker/timepicker.html",
            link: function(scope, element, attrs, ctrls) {
                var timepickerCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl && timepickerCtrl.init(ngModelCtrl, element.find("input"))
            }
        }
}); 

angular.module("ui.bootstrap.tabs", [])
.controller("TabsetController", ["$scope", function($scope) {
        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];
        ctrl.select = function(selectedTab) {
            angular.forEach(tabs, function(tab) {
                tab.active && tab !== selectedTab && (tab.active = !1, tab.onDeselect())
            }), selectedTab.active = !0, selectedTab.onSelect()
        }, ctrl.addTab = function(tab) {
            tabs.push(tab), 1 === tabs.length ? tab.active = !0 : tab.active && ctrl.select(tab)
        }, ctrl.removeTab = function(tab) {
            var index = tabs.indexOf(tab);
            if (tab.active && tabs.length > 1) {
                var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                ctrl.select(tabs[newActiveIndex])
            }
            tabs.splice(index, 1)
        }
    }]).directive("tabset", function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@"
            },
            controller: "TabsetController",
            templateUrl: "template/tabs/tabset.html",
            link: function(scope, element, attrs) {
                scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : !1, scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : !1
            }
        }
    }).directive("tab", ["$parse", function($parse) {
        return {
            require: "^tabset",
            restrict: "EA",
            replace: !0,
            templateUrl: "template/tabs/tab.html",
            transclude: !0,
            scope: {
                active: "=?",
                heading: "@",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            controller: function() {},
            compile: function(elm, attrs, transclude) {
                return function(scope, elm, attrs, tabsetCtrl) {
                    scope.$watch("active", function(active) {
                        active && tabsetCtrl.select(scope)
                    }), scope.disabled = !1, attrs.disabled && scope.$parent.$watch($parse(attrs.disabled), function(value) {
                        scope.disabled = !!value
                    }), scope.select = function() {
                        scope.disabled || (scope.active = !0)
                    }, tabsetCtrl.addTab(scope), scope.$on("$destroy", function() {
                        tabsetCtrl.removeTab(scope)
                    }), scope.$transcludeFn = transclude
                }
            }
        }
    }]).directive("tabHeadingTransclude", [function() {
        return {
            restrict: "A",
            require: "^tab",
            link: function(scope, elm, attrs, tabCtrl) {
                scope.$watch("headingElement", function(heading) {
                    heading && (elm.html(""), elm.append(heading))
                })
            }
        }
    }]).directive("tabContentTransclude", function() {
        function isTabHeading(node) {
            return node.tagName && (node.hasAttribute("tab-heading") || node.hasAttribute("data-tab-heading") || "tab-heading" === node.tagName.toLowerCase() || "data-tab-heading" === node.tagName.toLowerCase())
        }
        return {
            restrict: "A",
            require: "^tabset",
            link: function(scope, elm, attrs) {
                var tab = scope.$eval(attrs.tabContentTransclude);
                tab.$transcludeFn(tab.$parent, function(contents) {
                    angular.forEach(contents, function(node) {
                        isTabHeading(node) ? tab.headingElement = node : elm.append(node)
                    })
                })
            }
        }
    });

angular.module("ui.bootstrap.progressbar", [])
.constant("progressConfig", {
        animate: !0,
        max: 100
    }).controller("ProgressController", ["$scope", "$attrs", "progressConfig", function($scope, $attrs, progressConfig) {
        var self = this,
            animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
        this.bars = [], $scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max, this.addBar = function(bar, element) {
            animate || element.css({
                transition: "none"
            }), this.bars.push(bar), bar.$watch("value", function(value) {
                bar.percent = +(100 * value / $scope.max).toFixed(2)
            }), bar.$on("$destroy", function() {
                element = null, self.removeBar(bar)
            })
        }, this.removeBar = function(bar) {
            this.bars.splice(this.bars.indexOf(bar), 1)
        }
    }]).directive("progress", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            require: "progress",
            scope: {},
            templateUrl: "template/progressbar/progress.html"
        }
    }).directive("bar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            require: "^progress",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/bar.html",
            link: function(scope, element, attrs, progressCtrl) {
                progressCtrl.addBar(scope, element)
            }
        }
    }).directive("progressbar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/progressbar.html",
            link: function(scope, element, attrs, progressCtrl) {
                progressCtrl.addBar(scope, angular.element(element.children()[0]))
            }
        }
    }); 

    angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
        max: 5,
        stateOn: null,
        stateOff: null
    }).controller("RatingController", ["$scope", "$attrs", "ratingConfig", function($scope, $attrs, ratingConfig) {
        var ngModelCtrl = {
            $setViewValue: angular.noop
        };
        this.init = function(ngModelCtrl_) {
            ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = this.render, this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn, this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
            var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) : new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
            $scope.range = this.buildTemplateObjects(ratingStates)
        }, this.buildTemplateObjects = function(states) {
            for (var i = 0, n = states.length; n > i; i++) states[i] = angular.extend({
                index: i
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff
            }, states[i]);
            return states
        }, $scope.rate = function(value) {
            !$scope.readonly && value >= 0 && value <= $scope.range.length && (ngModelCtrl.$setViewValue(value), ngModelCtrl.$render())
        }, $scope.enter = function(value) {
            $scope.readonly || ($scope.value = value), $scope.onHover({
                value: value
            })
        }, $scope.reset = function() {
            $scope.value = ngModelCtrl.$viewValue, $scope.onLeave()
        }, $scope.onKeydown = function(evt) {
            /(37|38|39|40)/.test(evt.which) && (evt.preventDefault(), evt.stopPropagation(), $scope.rate($scope.value + (38 === evt.which || 39 === evt.which ? 1 : -1)))
        }, this.render = function() {
            $scope.value = ngModelCtrl.$viewValue
        }
    }]).directive("rating", function() {
        return {
            restrict: "EA",
            require: ["rating", "ngModel"],
            scope: {
                readonly: "=?",
                onHover: "&",
                onLeave: "&"
            },
            controller: "RatingController",
            templateUrl: "template/rating/rating.html",
            replace: !0,
            link: function(scope, element, attrs, ctrls) {
                var ratingCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl && ratingCtrl.init(ngModelCtrl)
            }
        }
    });

angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"])
.provider("$tooltip", function() {
        function snake_case(name) {
            var regexp = /[A-Z]/g,
                separator = "-";
            return name.replace(regexp, function(letter, pos) {
                return (pos ? separator : "") + letter.toLowerCase()
            })
        }
        var defaultOptions = {
                placement: "top",
                animation: !0,
                popupDelay: 0
            },
            triggerMap = {
                mouseenter: "mouseleave",
                click: "click",
                focus: "blur"
            },
            globalOptions = {};
        this.options = function(value) {
            angular.extend(globalOptions, value)
        }, this.setTriggers = function(triggers) {
            angular.extend(triggerMap, triggers)
        }, this.$get = ["$window", "$compile", "$timeout", "$parse", "$document", "$position", "$interpolate", function($window, $compile, $timeout, $parse, $document, $position, $interpolate) {
            return function(type, prefix, defaultTriggerShow) {
                function getTriggers(trigger) {
                    var show = trigger || options.trigger || defaultTriggerShow,
                        hide = triggerMap[show] || show;
                    return {
                        show: show,
                        hide: hide
                    }
                }
                var options = angular.extend({}, defaultOptions, globalOptions),
                    directiveName = snake_case(type),
                    startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    template = "<div " + directiveName + '-popup title="' + startSym + "tt_title" + endSym + '" content="' + startSym + "tt_content" + endSym + '" placement="' + startSym + "tt_placement" + endSym + '" animation="tt_animation" is-open="tt_isOpen"></div>';
                return {
                    restrict: "EA",
                    scope: !0,
                    compile: function(tElem, tAttrs) {
                        var tooltipLinker = $compile(template);
                        return function(scope, element, attrs) {
                            function toggleTooltipBind() {
                                scope.tt_isOpen ? hideTooltipBind() : showTooltipBind()
                            }

                            function showTooltipBind() {
                                hasEnableExp && !scope.$eval(attrs[prefix + "Enable"]) || (scope.tt_popupDelay ? popupTimeout || (popupTimeout = $timeout(show, scope.tt_popupDelay, !1), popupTimeout.then(function(reposition) {
                                    reposition()
                                })) : show()())
                            }

                            function hideTooltipBind() {
                                scope.$apply(function() {
                                    hide()
                                })
                            }

                            function show() {
                                return popupTimeout = null, transitionTimeout && ($timeout.cancel(transitionTimeout), transitionTimeout = null), scope.tt_content ? (createTooltip(), tooltip.css({
                                    top: 0,
                                    left: 0,
                                    display: "block"
                                }), appendToBody ? $document.find("body").append(tooltip) : element.after(tooltip), positionTooltip(), scope.tt_isOpen = !0, scope.$digest(), positionTooltip) : angular.noop
                            }

                            function hide() {
                                scope.tt_isOpen = !1, $timeout.cancel(popupTimeout), popupTimeout = null, scope.tt_animation ? transitionTimeout || (transitionTimeout = $timeout(removeTooltip, 500)) : removeTooltip()
                            }

                            function createTooltip() {
                                tooltip && removeTooltip(), tooltip = tooltipLinker(scope, function() {}), scope.$digest()
                            }

                            function removeTooltip() {
                                transitionTimeout = null, tooltip && (tooltip.remove(), tooltip = null)
                            }
                            var tooltip, transitionTimeout, popupTimeout, appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : !1,
                                triggers = getTriggers(void 0),
                                hasEnableExp = angular.isDefined(attrs[prefix + "Enable"]),
                                positionTooltip = function() {
                                    var ttPosition = $position.positionElements(element, tooltip, scope.tt_placement, appendToBody);
                                    ttPosition.top += "px", ttPosition.left += "px", tooltip.css(ttPosition)
                                };
                            scope.tt_isOpen = !1, attrs.$observe(type, function(val) {
                                scope.tt_content = val, !val && scope.tt_isOpen && hide()
                            }), attrs.$observe(prefix + "Title", function(val) {
                                scope.tt_title = val
                            }), attrs.$observe(prefix + "Placement", function(val) {
                                scope.tt_placement = angular.isDefined(val) ? val : options.placement
                            }), attrs.$observe(prefix + "PopupDelay", function(val) {
                                var delay = parseInt(val, 10);
                                scope.tt_popupDelay = isNaN(delay) ? options.popupDelay : delay
                            });
                            var unregisterTriggers = function() {
                                element.unbind(triggers.show, showTooltipBind), element.unbind(triggers.hide, hideTooltipBind)
                            };
                            attrs.$observe(prefix + "Trigger", function(val) {
                                unregisterTriggers(), triggers = getTriggers(val), triggers.show === triggers.hide ? element.bind(triggers.show, toggleTooltipBind) : (element.bind(triggers.show, showTooltipBind), element.bind(triggers.hide, hideTooltipBind))
                            });
                            var animation = scope.$eval(attrs[prefix + "Animation"]);
                            scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation, attrs.$observe(prefix + "AppendToBody", function(val) {
                                appendToBody = angular.isDefined(val) ? $parse(val)(scope) : appendToBody
                            }), appendToBody && scope.$on("$locationChangeSuccess", function() {
                                scope.tt_isOpen && hide()
                            }), scope.$on("$destroy", function() {
                                $timeout.cancel(transitionTimeout), $timeout.cancel(popupTimeout), unregisterTriggers(), removeTooltip()
                            })
                        }
                    }
                }
            }
        }]
    }).directive("tooltipPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-popup.html"
        }
    }).directive("tooltip", ["$tooltip", function($tooltip) {
        return $tooltip("tooltip", "tooltip", "mouseenter")
    }]).directive("tooltipHtmlUnsafePopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
        }
    }).directive("tooltipHtmlUnsafe", ["$tooltip", function($tooltip) {
        return $tooltip("tooltipHtmlUnsafe", "tooltip", "mouseenter")
    }]); 

    angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"])
    .directive("popoverPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                title: "@",
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/popover/popover.html"
        }
    }).directive("popover", ["$tooltip", function($tooltip) {
        return $tooltip("popover", "popover", "click")
    }]);

angular.module("ui.bootstrap.modal", ["ui.bootstrap.transition"])
.factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var stack = [];
                return {
                    add: function(key, value) {
                        stack.push({
                            key: key,
                            value: value
                        })
                    },
                    get: function(key) {
                        for (var i = 0; i < stack.length; i++)
                            if (key == stack[i].key) return stack[i]
                    },
                    keys: function() {
                        for (var keys = [], i = 0; i < stack.length; i++) keys.push(stack[i].key);
                        return keys
                    },
                    top: function() {
                        return stack[stack.length - 1]
                    },
                    remove: function(key) {
                        for (var idx = -1, i = 0; i < stack.length; i++)
                            if (key == stack[i].key) {
                                idx = i;
                                break
                            }
                        return stack.splice(idx, 1)[0]
                    },
                    removeTop: function() {
                        return stack.splice(stack.length - 1, 1)[0]
                    },
                    length: function() {
                        return stack.length
                    }
                }
            }
        }
    }).directive("modalBackdrop", ["$timeout", function($timeout) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/modal/backdrop.html",
            link: function(scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || "", scope.animate = !1, $timeout(function() {
                    scope.animate = !0
                })
            }
        }
    }]).directive("modalWindow", ["$modalStack", "$timeout", function($modalStack, $timeout) {
        return {
            restrict: "EA",
            scope: {
                index: "@",
                animate: "="
            },
            replace: !0,
            transclude: !0,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || "template/modal/window.html"
            },
            link: function(scope, element, attrs) {
                element.addClass(attrs.windowClass || ""), scope.size = attrs.size, $timeout(function() {
                    scope.animate = !0, element[0].querySelectorAll("[autofocus]").length || element[0].focus()
                }), scope.close = function(evt) {
                    var modal = $modalStack.getTop();
                    modal && modal.value.backdrop && "static" != modal.value.backdrop && evt.target === evt.currentTarget && (evt.preventDefault(), evt.stopPropagation(), $modalStack.dismiss(modal.key, "backdrop click"))
                }
            }
        }
    }]).directive("modalTransclude", function() {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function(clone) {
                    $element.empty(), $element.append(clone)
                })
            }
        }
    }).factory("$modalStack", ["$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
        function backdropIndex() {
            for (var topBackdropIndex = -1, opened = openedWindows.keys(), i = 0; i < opened.length; i++) openedWindows.get(opened[i]).value.backdrop && (topBackdropIndex = i);
            return topBackdropIndex
        }

        function removeModalWindow(modalInstance) {
            var body = $document.find("body").eq(0),
                modalWindow = openedWindows.get(modalInstance).value;
            openedWindows.remove(modalInstance), removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
                modalWindow.modalScope.$destroy(), body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0), checkRemoveBackdrop()
            })
        }

        function checkRemoveBackdrop() {
            if (backdropDomEl && -1 == backdropIndex()) {
                var backdropScopeRef = backdropScope;
                removeAfterAnimate(backdropDomEl, backdropScope, 150, function() {
                    backdropScopeRef.$destroy(), backdropScopeRef = null
                }), backdropDomEl = void 0, backdropScope = void 0
            }
        }

        function removeAfterAnimate(domEl, scope, emulateTime, done) {
            function afterAnimating() {
                afterAnimating.done || (afterAnimating.done = !0, domEl.remove(), done && done())
            }
            scope.animate = !1;
            var transitionEndEventName = $transition.transitionEndEventName;
            if (transitionEndEventName) {
                var timeout = $timeout(afterAnimating, emulateTime);
                domEl.bind(transitionEndEventName, function() {
                    $timeout.cancel(timeout), afterAnimating(), scope.$apply()
                })
            } else $timeout(afterAnimating)
        }
        var backdropDomEl, backdropScope, OPENED_MODAL_CLASS = "modal-open",
            openedWindows = $$stackedMap.createNew(),
            $modalStack = {};
        return $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
            backdropScope && (backdropScope.index = newBackdropIndex)
        }), $document.bind("keydown", function(evt) {
            var modal;
            27 === evt.which && (modal = openedWindows.top(), modal && modal.value.keyboard && (evt.preventDefault(), $rootScope.$apply(function() {
                $modalStack.dismiss(modal.key, "escape key press")
            })))
        }), $modalStack.open = function(modalInstance, modal) {
            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                modalScope: modal.scope,
                backdrop: modal.backdrop,
                keyboard: modal.keyboard
            });
            var body = $document.find("body").eq(0),
                currBackdropIndex = backdropIndex();
            if (currBackdropIndex >= 0 && !backdropDomEl) {
                backdropScope = $rootScope.$new(!0), backdropScope.index = currBackdropIndex;
                var angularBackgroundDomEl = angular.element("<div modal-backdrop></div>");
                angularBackgroundDomEl.attr("backdrop-class", modal.backdropClass), backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope), body.append(backdropDomEl)
            }
            var angularDomEl = angular.element("<div modal-window></div>");
            angularDomEl.attr({
                "template-url": modal.windowTemplateUrl,
                "window-class": modal.windowClass,
                size: modal.size,
                index: openedWindows.length() - 1,
                animate: "animate"
            }).html(modal.content);
            var modalDomEl = $compile(angularDomEl)(modal.scope);
            openedWindows.top().value.modalDomEl = modalDomEl, body.append(modalDomEl), body.addClass(OPENED_MODAL_CLASS)
        }, $modalStack.close = function(modalInstance, result) {
            var modalWindow = openedWindows.get(modalInstance);
            modalWindow && (modalWindow.value.deferred.resolve(result), removeModalWindow(modalInstance))
        }, $modalStack.dismiss = function(modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance);
            modalWindow && (modalWindow.value.deferred.reject(reason), removeModalWindow(modalInstance))
        }, $modalStack.dismissAll = function(reason) {
            for (var topModal = this.getTop(); topModal;) this.dismiss(topModal.key, reason), topModal = this.getTop()
        }, $modalStack.getTop = function() {
            return openedWindows.top()
        }, $modalStack
    }]).provider("$modal", function() {
        var $modalProvider = {
            options: {
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) : $http.get(angular.isFunction(options.templateUrl) ? options.templateUrl() : options.templateUrl, {
                        cache: $templateCache
                    }).then(function(result) {
                        return result.data
                    })
                }

                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    return angular.forEach(resolves, function(value) {
                        (angular.isFunction(value) || angular.isArray(value)) && promisesArr.push($q.when($injector.invoke(value)))
                    }), promisesArr
                }
                var $modal = {};
                return $modal.open = function(modalOptions) {
                    var modalResultDeferred = $q.defer(),
                        modalOpenedDeferred = $q.defer(),
                        modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            close: function(result) {
                                $modalStack.close(modalInstance, result)
                            },
                            dismiss: function(reason) {
                                $modalStack.dismiss(modalInstance, reason)
                            }
                        };
                    if (modalOptions = angular.extend({}, $modalProvider.options, modalOptions), modalOptions.resolve = modalOptions.resolve || {}, !modalOptions.template && !modalOptions.templateUrl) throw new Error("One of template or templateUrl options is required.");
                    var templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
                    return templateAndResolvePromise.then(function(tplAndVars) {
                        var modalScope = (modalOptions.scope || $rootScope).$new();
                        modalScope.$close = modalInstance.close, modalScope.$dismiss = modalInstance.dismiss;
                        var ctrlInstance, ctrlLocals = {},
                            resolveIter = 1;
                        modalOptions.controller && (ctrlLocals.$scope = modalScope, ctrlLocals.$modalInstance = modalInstance, angular.forEach(modalOptions.resolve, function(value, key) {
                            ctrlLocals[key] = tplAndVars[resolveIter++]
                        }), ctrlInstance = $controller(modalOptions.controller, ctrlLocals), modalOptions.controllerAs && (modalScope[modalOptions.controllerAs] = ctrlInstance)), $modalStack.open(modalInstance, {
                            scope: modalScope,
                            deferred: modalResultDeferred,
                            content: tplAndVars[0],
                            backdrop: modalOptions.backdrop,
                            keyboard: modalOptions.keyboard,
                            backdropClass: modalOptions.backdropClass,
                            windowClass: modalOptions.windowClass,
                            windowTemplateUrl: modalOptions.windowTemplateUrl,
                            size: modalOptions.size
                        })
                    }, function(reason) {
                        modalResultDeferred.reject(reason)
                    }), templateAndResolvePromise.then(function() {
                        modalOpenedDeferred.resolve(!0)
                    }, function() {
                        modalOpenedDeferred.reject(!1)
                    }), modalInstance
                }, $modal
            }]
        };
        return $modalProvider
    }); 

angular.module("ui.bootstrap.pagination", [])
.controller("PaginationController", ["$scope", "$attrs", "$parse", function($scope, $attrs, $parse) {
        var self = this,
            ngModelCtrl = {
                $setViewValue: angular.noop
            },
            setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
        this.init = function(ngModelCtrl_, config) {
            ngModelCtrl = ngModelCtrl_, this.config = config, ngModelCtrl.$render = function() {
                self.render()
            }, $attrs.itemsPerPage ? $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
                self.itemsPerPage = parseInt(value, 10), $scope.totalPages = self.calculateTotalPages()
            }) : this.itemsPerPage = config.itemsPerPage
        }, this.calculateTotalPages = function() {
            var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
            return Math.max(totalPages || 0, 1)
        }, this.render = function() {
            $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1
        }, $scope.selectPage = function(page) {
            $scope.page !== page && page > 0 && page <= $scope.totalPages && (ngModelCtrl.$setViewValue(page), ngModelCtrl.$render())
        }, $scope.getText = function(key) {
            return $scope[key + "Text"] || self.config[key + "Text"]
        }, $scope.noPrevious = function() {
            return 1 === $scope.page
        }, $scope.noNext = function() {
            return $scope.page === $scope.totalPages
        }, $scope.$watch("totalItems", function() {
            $scope.totalPages = self.calculateTotalPages()
        }), $scope.$watch("totalPages", function(value) {
            setNumPages($scope.$parent, value), $scope.page > value ? $scope.selectPage(value) : ngModelCtrl.$render()
        })
    }]).constant("paginationConfig", {
        itemsPerPage: 10,
        boundaryLinks: !1,
        directionLinks: !0,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last",
        rotate: !0
    }).directive("pagination", ["$parse", "paginationConfig", function($parse, paginationConfig) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                firstText: "@",
                previousText: "@",
                nextText: "@",
                lastText: "@"
            },
            require: ["pagination", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pagination.html",
            replace: !0,
            link: function(scope, element, attrs, ctrls) {
                function makePage(number, text, isActive) {
                    return {
                        number: number,
                        text: text,
                        active: isActive
                    }
                }

                function getPages(currentPage, totalPages) {
                    var pages = [],
                        startPage = 1,
                        endPage = totalPages,
                        isMaxSized = angular.isDefined(maxSize) && totalPages > maxSize;
                    isMaxSized && (rotate ? (startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1), endPage = startPage + maxSize - 1, endPage > totalPages && (endPage = totalPages, startPage = endPage - maxSize + 1)) : (startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1, endPage = Math.min(startPage + maxSize - 1, totalPages)));
                    for (var number = startPage; endPage >= number; number++) {
                        var page = makePage(number, number, number === currentPage);
                        pages.push(page)
                    }
                    if (isMaxSized && !rotate) {
                        if (startPage > 1) {
                            var previousPageSet = makePage(startPage - 1, "...", !1);
                            pages.unshift(previousPageSet)
                        }
                        if (totalPages > endPage) {
                            var nextPageSet = makePage(endPage + 1, "...", !1);
                            pages.push(nextPageSet)
                        }
                    }
                    return pages
                }
                var paginationCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                if (ngModelCtrl) {
                    var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
                        rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
                    scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks, scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks, paginationCtrl.init(ngModelCtrl, paginationConfig), attrs.maxSize && scope.$parent.$watch($parse(attrs.maxSize), function(value) {
                        maxSize = parseInt(value, 10), paginationCtrl.render()
                    });
                    var originalRender = paginationCtrl.render;
                    paginationCtrl.render = function() {
                        originalRender(), scope.page > 0 && scope.page <= scope.totalPages && (scope.pages = getPages(scope.page, scope.totalPages))
                    }
                }
            }
        }
    }]).constant("pagerConfig", {
        itemsPerPage: 10,
        previousText: "« Previous",
        nextText: "Next »",
        align: !0
    }).directive("pager", ["pagerConfig", function(pagerConfig) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                previousText: "@",
                nextText: "@"
            },
            require: ["pager", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pager.html",
            replace: !0,
            link: function(scope, element, attrs, ctrls) {
                var paginationCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl && (scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align, paginationCtrl.init(ngModelCtrl, pagerConfig))
            }
        }
    }]);

angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"])
.constant("datepickerConfig", {
        formatDay: "dd",
        formatMonth: "MMMM",
        formatYear: "yyyy",
        formatDayHeader: "EEE",
        formatDayTitle: "MMMM yyyy",
        formatMonthTitle: "yyyy",
        datepickerMode: "day",
        minMode: "day",
        maxMode: "year",
        showWeeks: !0,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    }).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
        var self = this,
            ngModelCtrl = {
                $setViewValue: angular.noop
            };
        this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange"], function(key, index) {
            self[key] = angular.isDefined($attrs[key]) ? 8 > index ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key]) : datepickerConfig[key]
        }), angular.forEach(["minDate", "maxDate"], function(key) {
            $attrs[key] ? $scope.$parent.$watch($parse($attrs[key]), function(value) {
                self[key] = value ? new Date(value) : null, self.refreshView()
            }) : self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null
        }), $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode, $scope.uniqueId = "datepicker-" + $scope.$id + "-" + Math.floor(1e4 * Math.random()), this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date, $scope.isActive = function(dateObject) {
            return 0 === self.compare(dateObject.date, self.activeDate) ? ($scope.activeDateId = dateObject.uid, !0) : !1
        }, this.init = function(ngModelCtrl_) {
            ngModelCtrl = ngModelCtrl_, ngModelCtrl.$render = function() {
                self.render()
            }
        }, this.render = function() {
            if (ngModelCtrl.$modelValue) {
                var date = new Date(ngModelCtrl.$modelValue),
                    isValid = !isNaN(date);
                isValid ? this.activeDate = date : $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), ngModelCtrl.$setValidity("date", isValid)
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                this._refreshView();
                var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
                ngModelCtrl.$setValidity("date-disabled", !date || this.element && !this.isDisabled(date))
            }
        }, this.createDateObject = function(date, format) {
            var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
            return {
                date: date,
                label: dateFilter(date, format),
                selected: model && 0 === this.compare(date, model),
                disabled: this.isDisabled(date),
                current: 0 === this.compare(date, new Date)
            }
        }, this.isDisabled = function(date) {
            return this.minDate && this.compare(date, this.minDate) < 0 || this.maxDate && this.compare(date, this.maxDate) > 0 || $attrs.dateDisabled && $scope.dateDisabled({
                date: date,
                mode: $scope.datepickerMode
            })
        }, this.split = function(arr, size) {
            for (var arrays = []; arr.length > 0;) arrays.push(arr.splice(0, size));
            return arrays
        }, $scope.select = function(date) {
            if ($scope.datepickerMode === self.minMode) {
                var dt = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()), ngModelCtrl.$setViewValue(dt), ngModelCtrl.$render()
            } else self.activeDate = date, $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1]
        }, $scope.move = function(direction) {
            var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
                month = self.activeDate.getMonth() + direction * (self.step.months || 0);
            self.activeDate.setFullYear(year, month, 1), self.refreshView()
        }, $scope.toggleMode = function(direction) {
            direction = direction || 1, $scope.datepickerMode === self.maxMode && 1 === direction || $scope.datepickerMode === self.minMode && -1 === direction || ($scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction])
        }, $scope.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var focusElement = function() {
            $timeout(function() {
                self.element[0].focus()
            }, 0, !1)
        };
        $scope.$on("datepicker.focus", focusElement), $scope.keydown = function(evt) {
            var key = $scope.keys[evt.which];
            if (key && !evt.shiftKey && !evt.altKey)
                if (evt.preventDefault(), evt.stopPropagation(), "enter" === key || "space" === key) {
                    if (self.isDisabled(self.activeDate)) return;
                    $scope.select(self.activeDate), focusElement()
                } else !evt.ctrlKey || "up" !== key && "down" !== key ? (self.handleKeyDown(key, evt), self.refreshView()) : ($scope.toggleMode("up" === key ? 1 : -1), focusElement())
        }
    }]).directive("datepicker", function() {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/datepicker.html",
            scope: {
                datepickerMode: "=?",
                dateDisabled: "&"
            },
            require: ["datepicker", "?^ngModel"],
            controller: "DatepickerController",
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl && datepickerCtrl.init(ngModelCtrl)
            }
        }
    }).directive("daypicker", ["dateFilter", function(dateFilter) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/day.html",
            require: "^datepicker",
            link: function(scope, element, attrs, ctrl) {
                function getDaysInMonth(year, month) {
                    return 1 !== month || year % 4 !== 0 || year % 100 === 0 && year % 400 !== 0 ? DAYS_IN_MONTH[month] : 29
                }

                function getDates(startDate, n) {
                    var dates = new Array(n),
                        current = new Date(startDate),
                        i = 0;
                    for (current.setHours(12); n > i;) dates[i++] = new Date(current), current.setDate(current.getDate() + 1);
                    return dates
                }

                function getISO8601WeekNumber(date) {
                    var checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                    var time = checkDate.getTime();
                    return checkDate.setMonth(0), checkDate.setDate(1), Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1
                }
                scope.showWeeks = ctrl.showWeeks, ctrl.step = {
                    months: 1
                }, ctrl.element = element;
                var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                ctrl._refreshView = function() {
                    var year = ctrl.activeDate.getFullYear(),
                        month = ctrl.activeDate.getMonth(),
                        firstDayOfMonth = new Date(year, month, 1),
                        difference = ctrl.startingDay - firstDayOfMonth.getDay(),
                        numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference,
                        firstDate = new Date(firstDayOfMonth);
                    numDisplayedFromPreviousMonth > 0 && firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
                    for (var days = getDates(firstDate, 42), i = 0; 42 > i; i++) days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
                        secondary: days[i].getMonth() !== month,
                        uid: scope.uniqueId + "-" + i
                    });
                    scope.labels = new Array(7);
                    for (var j = 0; 7 > j; j++) scope.labels[j] = {
                        abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
                        full: dateFilter(days[j].date, "EEEE")
                    };
                    if (scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle), scope.rows = ctrl.split(days, 7), scope.showWeeks) {
                        scope.weekNumbers = [];
                        for (var weekNumber = getISO8601WeekNumber(scope.rows[0][0].date), numWeeks = scope.rows.length; scope.weekNumbers.push(weekNumber++) < numWeeks;);
                    }
                }, ctrl.compare = function(date1, date2) {
                    return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
                }, ctrl.handleKeyDown = function(key, evt) {
                    var date = ctrl.activeDate.getDate();
                    if ("left" === key) date -= 1;
                    else if ("up" === key) date -= 7;
                    else if ("right" === key) date += 1;
                    else if ("down" === key) date += 7;
                    else if ("pageup" === key || "pagedown" === key) {
                        var month = ctrl.activeDate.getMonth() + ("pageup" === key ? -1 : 1);
                        ctrl.activeDate.setMonth(month, 1), date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date)
                    } else "home" === key ? date = 1 : "end" === key && (date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()));
                    ctrl.activeDate.setDate(date)
                }, ctrl.refreshView()
            }
        }
    }]).directive("monthpicker", ["dateFilter", function(dateFilter) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/month.html",
            require: "^datepicker",
            link: function(scope, element, attrs, ctrl) {
                ctrl.step = {
                    years: 1
                }, ctrl.element = element, ctrl._refreshView = function() {
                    for (var months = new Array(12), year = ctrl.activeDate.getFullYear(), i = 0; 12 > i; i++) months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
                        uid: scope.uniqueId + "-" + i
                    });
                    scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle), scope.rows = ctrl.split(months, 3)
                }, ctrl.compare = function(date1, date2) {
                    return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth())
                }, ctrl.handleKeyDown = function(key, evt) {
                    var date = ctrl.activeDate.getMonth();
                    if ("left" === key) date -= 1;
                    else if ("up" === key) date -= 3;
                    else if ("right" === key) date += 1;
                    else if ("down" === key) date += 3;
                    else if ("pageup" === key || "pagedown" === key) {
                        var year = ctrl.activeDate.getFullYear() + ("pageup" === key ? -1 : 1);
                        ctrl.activeDate.setFullYear(year)
                    } else "home" === key ? date = 0 : "end" === key && (date = 11);
                    ctrl.activeDate.setMonth(date)
                }, ctrl.refreshView()
            }
        }
    }]).directive("yearpicker", ["dateFilter", function(dateFilter) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/year.html",
            require: "^datepicker",
            link: function(scope, element, attrs, ctrl) {
                function getStartingYear(year) {
                    return parseInt((year - 1) / range, 10) * range + 1
                }
                var range = ctrl.yearRange;
                ctrl.step = {
                    years: range
                }, ctrl.element = element, ctrl._refreshView = function() {
                    for (var years = new Array(range), i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); range > i; i++) years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
                        uid: scope.uniqueId + "-" + i
                    });
                    scope.title = [years[0].label, years[range - 1].label].join(" - "), scope.rows = ctrl.split(years, 5)
                }, ctrl.compare = function(date1, date2) {
                    return date1.getFullYear() - date2.getFullYear()
                }, ctrl.handleKeyDown = function(key, evt) {
                    var date = ctrl.activeDate.getFullYear();
                    "left" === key ? date -= 1 : "up" === key ? date -= 5 : "right" === key ? date += 1 : "down" === key ? date += 5 : "pageup" === key || "pagedown" === key ? date += ("pageup" === key ? -1 : 1) * ctrl.step.years : "home" === key ? date = getStartingYear(ctrl.activeDate.getFullYear()) : "end" === key && (date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1), ctrl.activeDate.setFullYear(date)
                }, ctrl.refreshView()
            }
        }
    }]).constant("datepickerPopupConfig", {
        datepickerPopup: "yyyy-MM-dd",
        currentText: "Today",
        clearText: "Clear",
        closeText: "Done",
        closeOnDateSelection: !0,
        appendToBody: !1,
        showButtonBar: !0
    }).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@",
                dateDisabled: "&"
            },
            link: function(scope, element, attrs, ngModel) {
                function cameltoDash(string) {
                    return string.replace(/([A-Z])/g, function($1) {
                        return "-" + $1.toLowerCase()
                    })
                }

                function parseDate(viewValue) {
                    if (viewValue) {
                        if (angular.isDate(viewValue) && !isNaN(viewValue)) return ngModel.$setValidity("date", !0), viewValue;
                        if (angular.isString(viewValue)) {
                            var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
                            return isNaN(date) ? void ngModel.$setValidity("date", !1) : (ngModel.$setValidity("date", !0), date)
                        }
                        return void ngModel.$setValidity("date", !1)
                    }
                    return ngModel.$setValidity("date", !0), null
                }
                var dateFormat, closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
                    appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
                scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar, scope.getText = function(key) {
                    return scope[key + "Text"] || datepickerPopupConfig[key + "Text"]
                }, attrs.$observe("datepickerPopup", function(value) {
                    dateFormat = value || datepickerPopupConfig.datepickerPopup, ngModel.$render()
                });
                var popupEl = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
                popupEl.attr({
                    "ng-model": "date",
                    "ng-change": "dateSelection()"
                });
                var datepickerEl = angular.element(popupEl.children()[0]);
                attrs.datepickerOptions && angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function(value, option) {
                    datepickerEl.attr(cameltoDash(option), value)
                }), scope.watchData = {}, angular.forEach(["minDate", "maxDate", "datepickerMode"], function(key) {
                    if (attrs[key]) {
                        var getAttribute = $parse(attrs[key]);
                        if (scope.$parent.$watch(getAttribute, function(value) {
                                scope.watchData[key] = value
                            }), datepickerEl.attr(cameltoDash(key), "watchData." + key), "datepickerMode" === key) {
                            var setAttribute = getAttribute.assign;
                            scope.$watch("watchData." + key, function(value, oldvalue) {
                                value !== oldvalue && setAttribute(scope.$parent, value)
                            })
                        }
                    }
                }), attrs.dateDisabled && datepickerEl.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), ngModel.$parsers.unshift(parseDate), scope.dateSelection = function(dt) {
                    angular.isDefined(dt) && (scope.date = dt), ngModel.$setViewValue(scope.date), ngModel.$render(), closeOnDateSelection && (scope.isOpen = !1, element[0].focus())
                }, element.bind("input change keyup", function() {
                    scope.$apply(function() {
                        scope.date = ngModel.$modelValue
                    })
                }), ngModel.$render = function() {
                    var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : "";
                    element.val(date), scope.date = parseDate(ngModel.$modelValue)
                };
                var documentClickBind = function(event) {
                        scope.isOpen && event.target !== element[0] && scope.$apply(function() {
                            scope.isOpen = !1
                        })
                    },
                    keydown = function(evt, noApply) {
                        scope.keydown(evt)
                    };
                element.bind("keydown", keydown), scope.keydown = function(evt) {
                    27 === evt.which ? (evt.preventDefault(), evt.stopPropagation(), scope.close()) : 40 !== evt.which || scope.isOpen || (scope.isOpen = !0)
                }, scope.$watch("isOpen", function(value) {
                    value ? (scope.$broadcast("datepicker.focus"), scope.position = appendToBody ? $position.offset(element) : $position.position(element), scope.position.top = scope.position.top + element.prop("offsetHeight"), $document.bind("click", documentClickBind)) : $document.unbind("click", documentClickBind)
                }), scope.select = function(date) {
                    if ("today" === date) {
                        var today = new Date;
                        angular.isDate(ngModel.$modelValue) ? (date = new Date(ngModel.$modelValue), date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate())) : date = new Date(today.setHours(0, 0, 0, 0))
                    }
                    scope.dateSelection(date)
                }, scope.close = function() {
                    scope.isOpen = !1, element[0].focus()
                };
                var $popup = $compile(popupEl)(scope);
                popupEl.remove(), appendToBody ? $document.find("body").append($popup) : element.after($popup), scope.$on("$destroy", function() {
                    $popup.remove(), element.unbind("keydown", keydown), $document.unbind("click", documentClickBind)
                })
            }
        }
    }]).directive("datepickerPopupWrap", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            templateUrl: "template/datepicker/popup.html",
            link: function(scope, element, attrs) {
                element.bind("click", function(event) {
                    event.preventDefault(), event.stopPropagation()
                })
            }
        }
    }); 
    angular.module("ui.bootstrap.dropdown", []).constant("dropdownConfig", {
        openClass: "open"
    }).service("dropdownService", ["$document", function($document) {
        var openScope = null;
        this.open = function(dropdownScope) {
            openScope || ($document.bind("click", closeDropdown), $document.bind("keydown", escapeKeyBind)), openScope && openScope !== dropdownScope && (openScope.isOpen = !1), openScope = dropdownScope
        }, this.close = function(dropdownScope) {
            openScope === dropdownScope && (openScope = null, $document.unbind("click", closeDropdown), $document.unbind("keydown", escapeKeyBind))
        };
        var closeDropdown = function(evt) {
                var toggleElement = openScope.getToggleElement();
                evt && toggleElement && toggleElement[0].contains(evt.target) || openScope.$apply(function() {
                    openScope.isOpen = !1
                })
            },
            escapeKeyBind = function(evt) {
                27 === evt.which && (openScope.focusToggleElement(), closeDropdown())
            }
    }]).controller("DropdownController", ["$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
        var getIsOpen, self = this,
            scope = $scope.$new(),
            openClass = dropdownConfig.openClass,
            setIsOpen = angular.noop,
            toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;
        this.init = function(element) {
            self.$element = element, $attrs.isOpen && (getIsOpen = $parse($attrs.isOpen), setIsOpen = getIsOpen.assign, $scope.$watch(getIsOpen, function(value) {
                scope.isOpen = !!value
            }))
        }, this.toggle = function(open) {
            return scope.isOpen = arguments.length ? !!open : !scope.isOpen
        }, this.isOpen = function() {
            return scope.isOpen
        }, scope.getToggleElement = function() {
            return self.toggleElement
        }, scope.focusToggleElement = function() {
            self.toggleElement && self.toggleElement[0].focus()
        }, scope.$watch("isOpen", function(isOpen, wasOpen) {
            $animate[isOpen ? "addClass" : "removeClass"](self.$element, openClass), isOpen ? (scope.focusToggleElement(), dropdownService.open(scope)) : dropdownService.close(scope), setIsOpen($scope, isOpen), angular.isDefined(isOpen) && isOpen !== wasOpen && toggleInvoker($scope, {
                open: !!isOpen
            })
        }), $scope.$on("$locationChangeSuccess", function() {
            scope.isOpen = !1
        }), $scope.$on("$destroy", function() {
            scope.$destroy()
        })
    }]).directive("dropdown", function() {
        return {
            restrict: "CA",
            controller: "DropdownController",
            link: function(scope, element, attrs, dropdownCtrl) {
                dropdownCtrl.init(element)
            }
        }
    }).directive("dropdownToggle", function() {
        return {
            restrict: "CA",
            require: "?^dropdown",
            link: function(scope, element, attrs, dropdownCtrl) {
                if (dropdownCtrl) {
                    dropdownCtrl.toggleElement = element;
                    var toggleDropdown = function(event) {
                        event.preventDefault(), element.hasClass("disabled") || attrs.disabled || scope.$apply(function() {
                            dropdownCtrl.toggle()
                        })
                    };
                    element.bind("click", toggleDropdown), element.attr({
                        "aria-haspopup": !0,
                        "aria-expanded": !1
                    }), scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
                        element.attr("aria-expanded", !!isOpen)
                    }), scope.$on("$destroy", function() {
                        element.unbind("click", toggleDropdown)
                    })
                }
            }
        }
    });

angular.module("ui.bootstrap.transition", []).factory("$transition", ["$q", "$timeout", "$rootScope", function($q, $timeout, $rootScope) {
        function findEndEventName(endEventNames) {
            for (var name in endEventNames)
                if (void 0 !== transElement.style[name]) return endEventNames[name]
        }
        var $transition = function(element, trigger, options) {
                options = options || {};
                var deferred = $q.defer(),
                    endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"],
                    transitionEndHandler = function(event) {
                        $rootScope.$apply(function() {
                            element.unbind(endEventName, transitionEndHandler), deferred.resolve(element)
                        })
                    };
                return endEventName && element.bind(endEventName, transitionEndHandler), $timeout(function() {
                    angular.isString(trigger) ? element.addClass(trigger) : angular.isFunction(trigger) ? trigger(element) : angular.isObject(trigger) && element.css(trigger), endEventName || deferred.resolve(element)
                }), deferred.promise.cancel = function() {
                    endEventName && element.unbind(endEventName, transitionEndHandler), deferred.reject("Transition cancelled")
                }, deferred.promise
            },
            transElement = document.createElement("trans"),
            transitionEndEventNames = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            },
            animationEndEventNames = {
                WebkitTransition: "webkitAnimationEnd",
                MozTransition: "animationend",
                OTransition: "oAnimationEnd",
                transition: "animationend"
            };
        return $transition.transitionEndEventName = findEndEventName(transitionEndEventNames), $transition.animationEndEventName = findEndEventName(animationEndEventNames), $transition
    }]), angular.module("ui.bootstrap.collapse", ["ui.bootstrap.transition"]).directive("collapse", ["$transition", function($transition) {
        return {
            link: function(scope, element, attrs) {
                function doTransition(change) {
                    function newTransitionDone() {
                        currentTransition === newTransition && (currentTransition = void 0)
                    }
                    var newTransition = $transition(element, change);
                    return currentTransition && currentTransition.cancel(), currentTransition = newTransition, newTransition.then(newTransitionDone, newTransitionDone), newTransition
                }

                function expand() {
                    initialAnimSkip ? (initialAnimSkip = !1, expandDone()) : (element.removeClass("collapse").addClass("collapsing"), doTransition({
                        height: element[0].scrollHeight + "px"
                    }).then(expandDone))
                }

                function expandDone() {
                    element.removeClass("collapsing"), element.addClass("collapse in"), element.css({
                        height: "auto"
                    })
                }

                function collapse() {
                    if (initialAnimSkip) initialAnimSkip = !1, collapseDone(), element.css({
                        height: 0
                    });
                    else {
                        element.css({
                            height: element[0].scrollHeight + "px"
                        });
                        element[0].offsetWidth;
                        element.removeClass("collapse in").addClass("collapsing"), doTransition({
                            height: 0
                        }).then(collapseDone)
                    }
                }

                function collapseDone() {
                    element.removeClass("collapsing"), element.addClass("collapse")
                }
                var currentTransition, initialAnimSkip = !0;
                scope.$watch(attrs.collapse, function(shouldCollapse) {
                    shouldCollapse ? collapse() : expand()
                })
            }
        }
    }]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("accordionConfig", {
        closeOthers: !0
    }).controller("AccordionController", ["$scope", "$attrs", "accordionConfig", function($scope, $attrs, accordionConfig) {
        this.groups = [], this.closeOthers = function(openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
            closeOthers && angular.forEach(this.groups, function(group) {
                group !== openGroup && (group.isOpen = !1)
            })
        }, this.addGroup = function(groupScope) {
            var that = this;
            this.groups.push(groupScope), groupScope.$on("$destroy", function(event) {
                that.removeGroup(groupScope)
            })
        }, this.removeGroup = function(group) {
            var index = this.groups.indexOf(group); - 1 !== index && this.groups.splice(index, 1)
        }
    }]).directive("accordion", function() {
        return {
            restrict: "EA",
            controller: "AccordionController",
            transclude: !0,
            replace: !1,
            templateUrl: "template/accordion/accordion.html"
        }
    }).directive("accordionGroup", function() {
        return {
            require: "^accordion",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/accordion/accordion-group.html",
            scope: {
                heading: "@",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(element) {
                    this.heading = element
                }
            },
            link: function(scope, element, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope), scope.$watch("isOpen", function(value) {
                    value && accordionCtrl.closeOthers(scope)
                }), scope.toggleOpen = function() {
                    scope.isDisabled || (scope.isOpen = !scope.isOpen)
                }
            }
        }
    }).directive("accordionHeading", function() {
        return {
            restrict: "EA",
            transclude: !0,
            template: "",
            replace: !0,
            require: "^accordionGroup",
            link: function(scope, element, attr, accordionGroupCtrl, transclude) {
                accordionGroupCtrl.setHeading(transclude(scope, function() {}))
            }
        }
    }).directive("accordionTransclude", function() {
        return {
            require: "^accordionGroup",
            link: function(scope, element, attr, controller) {
                scope.$watch(function() {
                    return controller[attr.accordionTransclude]
                }, function(heading) {
                    heading && (element.html(""), element.append(heading))
                })
            }
        }
    }), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs", function($scope, $attrs) {
        $scope.closeable = "close" in $attrs
    }]).directive("alert", function() {
        return {
            restrict: "EA",
            controller: "AlertController",
            templateUrl: "template/alert/alert.html",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@",
                close: "&"
            }
        }
    }), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function() {
        return function(scope, element, attr) {
            element.addClass("ng-binding").data("$binding", attr.bindHtmlUnsafe), scope.$watch(attr.bindHtmlUnsafe, function(value) {
                element.html(value || "")
            })
        }
    }), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).controller("ButtonsController", ["buttonConfig", function(buttonConfig) {
        this.activeClass = buttonConfig.activeClass || "active", this.toggleEvent = buttonConfig.toggleEvent || "click"
    }]).directive("btnRadio", function() {
        return {
            require: ["btnRadio", "ngModel"],
            controller: "ButtonsController",
            link: function(scope, element, attrs, ctrls) {
                var buttonsCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl.$render = function() {
                    element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)))
                }, element.bind(buttonsCtrl.toggleEvent, function() {
                    var isActive = element.hasClass(buttonsCtrl.activeClass);
                    isActive && !angular.isDefined(attrs.uncheckable) || scope.$apply(function() {
                        ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio)), ngModelCtrl.$render()
                    })
                })
            }
        }
    }).directive("btnCheckbox", function() {
        return {
            require: ["btnCheckbox", "ngModel"],
            controller: "ButtonsController",
            link: function(scope, element, attrs, ctrls) {
                function getTrueValue() {
                    return getCheckboxValue(attrs.btnCheckboxTrue, !0)
                }

                function getFalseValue() {
                    return getCheckboxValue(attrs.btnCheckboxFalse, !1)
                }

                function getCheckboxValue(attributeValue, defaultValue) {
                    var val = scope.$eval(attributeValue);
                    return angular.isDefined(val) ? val : defaultValue
                }
                var buttonsCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                ngModelCtrl.$render = function() {
                    element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()))
                }, element.bind(buttonsCtrl.toggleEvent, function() {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue()), ngModelCtrl.$render()
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.carousel", ["ui.bootstrap.transition"]).controller("CarouselController", ["$scope", "$timeout", "$transition", function($scope, $timeout, $transition) {
        function restartTimer() {
            resetTimer();
            var interval = +$scope.interval;
            !isNaN(interval) && interval >= 0 && (currentTimeout = $timeout(timerFn, interval))
        }

        function resetTimer() {
            currentTimeout && ($timeout.cancel(currentTimeout), currentTimeout = null)
        }

        function timerFn() {
            isPlaying ? ($scope.next(), restartTimer()) : $scope.pause()
        }
        var currentTimeout, isPlaying, self = this,
            slides = self.slides = $scope.slides = [],
            currentIndex = -1;
        self.currentSlide = null;
        var destroyed = !1;
        self.select = $scope.select = function(nextSlide, direction) {
            function goNext() {
                if (!destroyed) {
                    if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
                        nextSlide.$element.addClass(direction);
                        nextSlide.$element[0].offsetWidth;
                        angular.forEach(slides, function(slide) {
                                angular.extend(slide, {
                                    direction: "",
                                    entering: !1,
                                    leaving: !1,
                                    active: !1
                                })
                            }), angular.extend(nextSlide, {
                                direction: direction,
                                active: !0,
                                entering: !0
                            }), angular.extend(self.currentSlide || {}, {
                                direction: direction,
                                leaving: !0
                            }), $scope.$currentTransition = $transition(nextSlide.$element, {}),
                            function(next, current) {
                                $scope.$currentTransition.then(function() {
                                    transitionDone(next, current)
                                }, function() {
                                    transitionDone(next, current)
                                })
                            }(nextSlide, self.currentSlide)
                    } else transitionDone(nextSlide, self.currentSlide);
                    self.currentSlide = nextSlide, currentIndex = nextIndex, restartTimer()
                }
            }

            function transitionDone(next, current) {
                angular.extend(next, {
                    direction: "",
                    active: !0,
                    leaving: !1,
                    entering: !1
                }), angular.extend(current || {}, {
                    direction: "",
                    active: !1,
                    leaving: !1,
                    entering: !1
                }), $scope.$currentTransition = null
            }
            var nextIndex = slides.indexOf(nextSlide);
            void 0 === direction && (direction = nextIndex > currentIndex ? "next" : "prev"), nextSlide && nextSlide !== self.currentSlide && ($scope.$currentTransition ? ($scope.$currentTransition.cancel(), $timeout(goNext)) : goNext())
        }, $scope.$on("$destroy", function() {
            destroyed = !0
        }), self.indexOfSlide = function(slide) {
            return slides.indexOf(slide)
        }, $scope.next = function() {
            var newIndex = (currentIndex + 1) % slides.length;
            return $scope.$currentTransition ? void 0 : self.select(slides[newIndex], "next")
        }, $scope.prev = function() {
            var newIndex = 0 > currentIndex - 1 ? slides.length - 1 : currentIndex - 1;
            return $scope.$currentTransition ? void 0 : self.select(slides[newIndex], "prev")
        }, $scope.isActive = function(slide) {
            return self.currentSlide === slide
        }, $scope.$watch("interval", restartTimer), $scope.$on("$destroy", resetTimer), $scope.play = function() {
            isPlaying || (isPlaying = !0, restartTimer());
        }, $scope.pause = function() {
            $scope.noPause || (isPlaying = !1, resetTimer())
        }, self.addSlide = function(slide, element) {
            slide.$element = element, slides.push(slide), 1 === slides.length || slide.active ? (self.select(slides[slides.length - 1]), 1 == slides.length && $scope.play()) : slide.active = !1
        }, self.removeSlide = function(slide) {
            var index = slides.indexOf(slide);
            slides.splice(index, 1), slides.length > 0 && slide.active ? index >= slides.length ? self.select(slides[index - 1]) : self.select(slides[index]) : currentIndex > index && currentIndex--
        }
    }]).directive("carousel", [function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            controller: "CarouselController",
            require: "carousel",
            templateUrl: "template/carousel/carousel.html",
            scope: {
                interval: "=",
                noTransition: "=",
                noPause: "="
            }
        }
    }]).directive("slide", function() {
        return {
            require: "^carousel",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/carousel/slide.html",
            scope: {
                active: "=?"
            },
            link: function(scope, element, attrs, carouselCtrl) {
                carouselCtrl.addSlide(scope, element), scope.$on("$destroy", function() {
                    carouselCtrl.removeSlide(scope)
                }), scope.$watch("active", function(active) {
                    active && carouselCtrl.select(scope)
                })
            }
        }
    }), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter", function($locale, orderByFilter) {
        function createParser(format) {
            var map = [],
                regex = format.split("");
            return angular.forEach(formatCodeToRegex, function(data, code) {
                var index = format.indexOf(code);
                if (index > -1) {
                    format = format.split(""), regex[index] = "(" + data.regex + ")", format[index] = "$";
                    for (var i = index + 1, n = index + code.length; n > i; i++) regex[i] = "", format[i] = "$";
                    format = format.join(""), map.push({
                        index: index,
                        apply: data.apply
                    })
                }
            }), {
                regex: new RegExp("^" + regex.join("") + "$"),
                map: orderByFilter(map, "index")
            }
        }

        function isValid(year, month, date) {
            return 1 === month && date > 28 ? 29 === date && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) : 3 === month || 5 === month || 8 === month || 10 === month ? 31 > date : !0
        }
        this.parsers = {};
        var formatCodeToRegex = {
            yyyy: {
                regex: "\\d{4}",
                apply: function(value) {
                    this.year = +value
                }
            },
            yy: {
                regex: "\\d{2}",
                apply: function(value) {
                    this.year = +value + 2e3
                }
            },
            y: {
                regex: "\\d{1,4}",
                apply: function(value) {
                    this.year = +value
                }
            },
            MMMM: {
                regex: $locale.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(value) {
                    this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value)
                }
            },
            MMM: {
                regex: $locale.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(value) {
                    this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)
                }
            },
            MM: {
                regex: "0[1-9]|1[0-2]",
                apply: function(value) {
                    this.month = value - 1
                }
            },
            M: {
                regex: "[1-9]|1[0-2]",
                apply: function(value) {
                    this.month = value - 1
                }
            },
            dd: {
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(value) {
                    this.date = +value
                }
            },
            d: {
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(value) {
                    this.date = +value
                }
            },
            EEEE: {
                regex: $locale.DATETIME_FORMATS.DAY.join("|")
            },
            EEE: {
                regex: $locale.DATETIME_FORMATS.SHORTDAY.join("|")
            }
        };
        this.parse = function(input, format) {
            if (!angular.isString(input) || !format) return input;
            format = $locale.DATETIME_FORMATS[format] || format, this.parsers[format] || (this.parsers[format] = createParser(format));
            var parser = this.parsers[format],
                regex = parser.regex,
                map = parser.map,
                results = input.match(regex);
            if (results && results.length) {
                for (var dt, fields = {
                        year: 1900,
                        month: 0,
                        date: 1,
                        hours: 0
                    }, i = 1, n = results.length; n > i; i++) {
                    var mapper = map[i - 1];
                    mapper.apply && mapper.apply.call(fields, results[i])
                }
                return isValid(fields.year, fields.month, fields.date) && (dt = new Date(fields.year, fields.month, fields.date, fields.hours)), dt
            }
        }
    }]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function($document, $window) {
        function getStyle(el, cssprop) {
            return el.currentStyle ? el.currentStyle[cssprop] : $window.getComputedStyle ? $window.getComputedStyle(el)[cssprop] : el.style[cssprop]
        }

        function isStaticPositioned(element) {
            return "static" === (getStyle(element, "position") || "static")
        }
        var parentOffsetEl = function(element) {
            for (var docDomEl = $document[0], offsetParent = element.offsetParent || docDomEl; offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent);) offsetParent = offsetParent.offsetParent;
            return offsetParent || docDomEl
        };
        return {
            position: function(element) {
                var elBCR = this.offset(element),
                    offsetParentBCR = {
                        top: 0,
                        left: 0
                    },
                    offsetParentEl = parentOffsetEl(element[0]);
                offsetParentEl != $document[0] && (offsetParentBCR = this.offset(angular.element(offsetParentEl)), offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop, offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft);
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop("offsetWidth"),
                    height: boundingClientRect.height || element.prop("offsetHeight"),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                }
            },
            offset: function(element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop("offsetWidth"),
                    height: boundingClientRect.height || element.prop("offsetHeight"),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                }
            },
            positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
                var hostElPos, targetElWidth, targetElHeight, targetElPos, positionStrParts = positionStr.split("-"),
                    pos0 = positionStrParts[0],
                    pos1 = positionStrParts[1] || "center";
                hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl), targetElWidth = targetEl.prop("offsetWidth"), targetElHeight = targetEl.prop("offsetHeight");
                var shiftWidth = {
                        center: function() {
                            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2
                        },
                        left: function() {
                            return hostElPos.left
                        },
                        right: function() {
                            return hostElPos.left + hostElPos.width
                        }
                    },
                    shiftHeight = {
                        center: function() {
                            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2
                        },
                        top: function() {
                            return hostElPos.top
                        },
                        bottom: function() {
                            return hostElPos.top + hostElPos.height
                        }
                    };
                switch (pos0) {
                    case "right":
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: shiftWidth[pos0]()
                        };
                        break;
                    case "left":
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: hostElPos.left - targetElWidth
                        };
                        break;
                    case "bottom":
                        targetElPos = {
                            top: shiftHeight[pos0](),
                            left: shiftWidth[pos1]()
                        };
                        break;
                    default:
                        targetElPos = {
                            top: hostElPos.top - targetElHeight,
                            left: shiftWidth[pos1]()
                        }
                }
                return targetElPos
            }
        }
    }]);