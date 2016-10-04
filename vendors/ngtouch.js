function(window, angular, undefined) {
        "use strict";

        function nodeName_(element) {
            return angular.lowercase(element.nodeName || element[0] && element[0].nodeName)
        }

        function makeSwipeDirective(directiveName, direction, eventName) {
            ngTouch.directive(directiveName, ["$parse", "$swipe", function($parse, $swipe) {
                var MAX_VERTICAL_DISTANCE = 75,
                    MAX_VERTICAL_RATIO = .3,
                    MIN_HORIZONTAL_DISTANCE = 30;
                return function(scope, element, attr) {
                    function validSwipe(coords) {
                        if (!startCoords) return !1;
                        var deltaY = Math.abs(coords.y - startCoords.y),
                            deltaX = (coords.x - startCoords.x) * direction;
                        return valid && MAX_VERTICAL_DISTANCE > deltaY && deltaX > 0 && deltaX > MIN_HORIZONTAL_DISTANCE && MAX_VERTICAL_RATIO > deltaY / deltaX
                    }
                    var startCoords, valid, swipeHandler = $parse(attr[directiveName]),
                        pointerTypes = ["touch"];
                    angular.isDefined(attr.ngSwipeDisableMouse) || pointerTypes.push("mouse"), $swipe.bind(element, {
                        start: function(coords, event) {
                            startCoords = coords, valid = !0
                        },
                        cancel: function(event) {
                            valid = !1
                        },
                        end: function(coords, event) {
                            validSwipe(coords) && scope.$apply(function() {
                                element.triggerHandler(eventName), swipeHandler(scope, {
                                    $event: event
                                })
                            })
                        }
                    }, pointerTypes)
                }
            }])
        }
        var ngTouch = angular.module("ngTouch", []);
        ngTouch.factory("$swipe", [function() {
            function getCoordinates(event) {
                var originalEvent = event.originalEvent || event,
                    touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent],
                    e = originalEvent.changedTouches && originalEvent.changedTouches[0] || touches[0];
                return {
                    x: e.clientX,
                    y: e.clientY
                }
            }

            function getEvents(pointerTypes, eventType) {
                var res = [];
                return angular.forEach(pointerTypes, function(pointerType) {
                    var eventName = POINTER_EVENTS[pointerType][eventType];
                    eventName && res.push(eventName)
                }), res.join(" ")
            }
            var MOVE_BUFFER_RADIUS = 10,
                POINTER_EVENTS = {
                    mouse: {
                        start: "mousedown",
                        move: "mousemove",
                        end: "mouseup"
                    },
                    touch: {
                        start: "touchstart",
                        move: "touchmove",
                        end: "touchend",
                        cancel: "touchcancel"
                    }
                };
            return {
                bind: function(element, eventHandlers, pointerTypes) {
                    var totalX, totalY, startCoords, lastPos, active = !1;
                    pointerTypes = pointerTypes || ["mouse", "touch"], element.on(getEvents(pointerTypes, "start"), function(event) {
                        startCoords = getCoordinates(event), active = !0, totalX = 0, totalY = 0, lastPos = startCoords, eventHandlers.start && eventHandlers.start(startCoords, event)
                    });
                    var events = getEvents(pointerTypes, "cancel");
                    events && element.on(events, function(event) {
                        active = !1, eventHandlers.cancel && eventHandlers.cancel(event)
                    }), element.on(getEvents(pointerTypes, "move"), function(event) {
                        if (active && startCoords) {
                            var coords = getCoordinates(event);
                            if (totalX += Math.abs(coords.x - lastPos.x), totalY += Math.abs(coords.y - lastPos.y), lastPos = coords, !(MOVE_BUFFER_RADIUS > totalX && MOVE_BUFFER_RADIUS > totalY)) return totalY > totalX ? (active = !1, void(eventHandlers.cancel && eventHandlers.cancel(event))) : (event.preventDefault(), void(eventHandlers.move && eventHandlers.move(coords, event)))
                        }
                    }), element.on(getEvents(pointerTypes, "end"), function(event) {
                        active && (active = !1, eventHandlers.end && eventHandlers.end(getCoordinates(event), event))
                    })
                }
            }
        }]), ngTouch.config(["$provide", function($provide) {
            $provide.decorator("ngClickDirective", ["$delegate", function($delegate) {
                return $delegate.shift(), $delegate
            }])
        }]), ngTouch.directive("ngClick", ["$parse", "$timeout", "$rootElement", function($parse, $timeout, $rootElement) {
            function hit(x1, y1, x2, y2) {
                return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD
            }

            function checkAllowableRegions(touchCoordinates, x, y) {
                for (var i = 0; i < touchCoordinates.length; i += 2)
                    if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) return touchCoordinates.splice(i, i + 2), !0;
                return !1
            }

            function onClick(event) {
                if (!(Date.now() - lastPreventedTime > PREVENT_DURATION)) {
                    var touches = event.touches && event.touches.length ? event.touches : [event],
                        x = touches[0].clientX,
                        y = touches[0].clientY;
                    1 > x && 1 > y || lastLabelClickCoordinates && lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y || (lastLabelClickCoordinates && (lastLabelClickCoordinates = null), "label" === nodeName_(event.target) && (lastLabelClickCoordinates = [x, y]), checkAllowableRegions(touchCoordinates, x, y) || (event.stopPropagation(), event.preventDefault(), event.target && event.target.blur && event.target.blur()))
                }
            }

            function onTouchStart(event) {
                var touches = event.touches && event.touches.length ? event.touches : [event],
                    x = touches[0].clientX,
                    y = touches[0].clientY;
                touchCoordinates.push(x, y), $timeout(function() {
                    for (var i = 0; i < touchCoordinates.length; i += 2)
                        if (touchCoordinates[i] == x && touchCoordinates[i + 1] == y) return void touchCoordinates.splice(i, i + 2)
                }, PREVENT_DURATION, !1)
            }

            function preventGhostClick(x, y) {
                touchCoordinates || ($rootElement[0].addEventListener("click", onClick, !0), $rootElement[0].addEventListener("touchstart", onTouchStart, !0), touchCoordinates = []), lastPreventedTime = Date.now(), checkAllowableRegions(touchCoordinates, x, y)
            }
            var lastPreventedTime, touchCoordinates, lastLabelClickCoordinates, TAP_DURATION = 750,
                MOVE_TOLERANCE = 12,
                PREVENT_DURATION = 2500,
                CLICKBUSTER_THRESHOLD = 25,
                ACTIVE_CLASS_NAME = "ng-click-active";
            return function(scope, element, attr) {
                function resetState() {
                    tapping = !1, element.removeClass(ACTIVE_CLASS_NAME)
                }
                var tapElement, startTime, touchStartX, touchStartY, clickHandler = $parse(attr.ngClick),
                    tapping = !1;
                element.on("touchstart", function(event) {
                    tapping = !0, tapElement = event.target ? event.target : event.srcElement, 3 == tapElement.nodeType && (tapElement = tapElement.parentNode), element.addClass(ACTIVE_CLASS_NAME), startTime = Date.now();
                    var originalEvent = event.originalEvent || event,
                        touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent],
                        e = touches[0];
                    touchStartX = e.clientX, touchStartY = e.clientY
                }), element.on("touchcancel", function(event) {
                    resetState()
                }), element.on("touchend", function(event) {
                    var diff = Date.now() - startTime,
                        originalEvent = event.originalEvent || event,
                        touches = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches : originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent],
                        e = touches[0],
                        x = e.clientX,
                        y = e.clientY,
                        dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));
                    tapping && TAP_DURATION > diff && MOVE_TOLERANCE > dist && (preventGhostClick(x, y), tapElement && tapElement.blur(), angular.isDefined(attr.disabled) && attr.disabled !== !1 || element.triggerHandler("click", [event])), resetState()
                }), element.onclick = function(event) {}, element.on("click", function(event, touchend) {
                    scope.$apply(function() {
                        clickHandler(scope, {
                            $event: touchend || event
                        })
                    })
                }), element.on("mousedown", function(event) {
                    element.addClass(ACTIVE_CLASS_NAME)
                }), element.on("mousemove mouseup", function(event) {
                    element.removeClass(ACTIVE_CLASS_NAME)
                })
            }
        }]), makeSwipeDirective("ngSwipeLeft", -1, "swipeleft"), makeSwipeDirective("ngSwipeRight", 1, "swiperight")
    }(window, window.angular)