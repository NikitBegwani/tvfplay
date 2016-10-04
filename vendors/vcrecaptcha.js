function(ng) {
        "use strict";
        ng.module("vcRecaptcha", [])
    }(angular);
function(ng) {
        "use strict";
        var app = ng.module("vcRecaptcha");
        app.service("vcRecaptchaService", ["$window", "$q", function($window, $q) {
            function getRecaptcha() {
                return recaptcha ? $q.when(recaptcha) : promise
            }

            function validateRecaptchaInstance() {
                if (!recaptcha) throw new Error("reCaptcha has not been loaded yet.")
            }
            var recaptcha, deferred = $q.defer(),
                promise = deferred.promise;
            return $window.vcRecaptchaApiLoaded = function() {
                recaptcha = $window.grecaptcha, deferred.resolve(recaptcha)
            }, ng.isDefined($window.grecaptcha) && $window.vcRecaptchaApiLoaded(), {
                create: function(elm, key, fn, conf) {
                    return conf.callback = fn, conf.sitekey = key, getRecaptcha().then(function(recaptcha) {
                        return recaptcha.render(elm, conf)
                    })
                },
                reload: function(widgetId) {
                    validateRecaptchaInstance(), recaptcha.reset(widgetId)
                },
                getResponse: function(widgetId) {
                    return validateRecaptchaInstance(), recaptcha.getResponse(widgetId)
                }
            }
        }])
    }(angular),
function(ng) {
        "use strict";

        function throwNoKeyException() {
            throw new Error('You need to set the "key" attribute to your public reCaptcha key. If you don\'t have a key, please get one from https://www.google.com/recaptcha/admin/create')
        }
        var app = ng.module("vcRecaptcha");
        app.directive("vcRecaptcha", ["$document", "$timeout", "vcRecaptchaService", function($document, $timeout, vcRecaptcha) {
            return {
                restrict: "A",
                require: "?^^form",
                scope: {
                    response: "=?ngModel",
                    key: "=",
                    theme: "=?",
                    size: "=?",
                    tabindex: "=?",
                    onCreate: "&",
                    onSuccess: "&",
                    onExpire: "&"
                },
                link: function(scope, elm, attrs, ctrl) {
                    function destroy() {
                        ctrl && ctrl.$setValidity("recaptcha", null), sessionTimeout && ($timeout.cancel(sessionTimeout), sessionTimeout = null), cleanup()
                    }

                    function cleanup() {
                        angular.element($document[0].querySelectorAll(".pls-container")).parent().remove()
                    }
                    attrs.hasOwnProperty("key") || throwNoKeyException(), scope.widgetId = null;
                    var sessionTimeout, removeCreationListener = scope.$watch("key", function(key) {
                        if (key) {
                            40 !== key.length && throwNoKeyException();
                            var callback = function(gRecaptchaResponse) {
                                $timeout(function() {
                                    ctrl && ctrl.$setValidity("recaptcha", !0), scope.response = gRecaptchaResponse, scope.onSuccess({
                                        response: gRecaptchaResponse,
                                        widgetId: scope.widgetId
                                    })
                                }), sessionTimeout = $timeout(function() {
                                    ctrl && ctrl.$setValidity("recaptcha", !1), scope.response = "", scope.onExpire({
                                        widgetId: scope.widgetId
                                    })
                                }, 12e4)
                            };
                            vcRecaptcha.create(elm[0], key, callback, {
                                theme: scope.theme || attrs.theme || null,
                                tabindex: scope.tabindex || attrs.tabindex || null,
                                size: scope.size || attrs.size || null
                            }).then(function(widgetId) {
                                ctrl && ctrl.$setValidity("recaptcha", !1), scope.widgetId = widgetId, scope.onCreate({
                                    widgetId: widgetId
                                }), scope.$on("$destroy", destroy)
                            }), removeCreationListener()
                        }
                    })
                }
            }
        }])
    }(angular),
