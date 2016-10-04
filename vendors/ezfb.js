function(module) 
    {
        function creatSocialPluginDirective(availableAttrs, dirName) {
            var CLASS_WRAP = "ezfb-social-plugin-wrap",
                STYLE_WRAP_SPAN = "display: inline-block; width: 0; height: 0; overflow: hidden;",
                PLUGINS_WITH_ADAPTIVE_WIDTH = ["fbPage", "fbComments"],
                _wrap = function($elm) {
                    var tmpl = '<span class="' + CLASS_WRAP + '" style="' + STYLE_WRAP_SPAN + '">';
                    return $elm.wrap(tmpl).parent()
                },
                _wrapAdaptive = function($elm) {
                    var tmpl = '<div class="' + CLASS_WRAP + '">';
                    return $elm.wrap(tmpl).parent()
                },
                _isWrapped = function($elm) {
                    return $elm.parent().hasClass(CLASS_WRAP)
                },
                _unwrap = function($elm) {
                    var $parent = $elm.parent();
                    return $parent.after($elm).remove(), $elm
                };
            module.directive(dirName, ["ezfb", "$q", "$document", function(ezfb, $q, $document) {
                var _withAdaptiveWidth = PLUGINS_WITH_ADAPTIVE_WIDTH.indexOf(dirName) >= 0,
                    _dirClassName = dirName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
                return {
                    restrict: "EC",
                    require: "?^ezfbXfbml",
                    compile: function(tElm, tAttrs) {
                        return tElm.removeClass(_dirClassName),
                            function(scope, iElm, iAttrs, xfbmlCtrl) {
                                function genOnRenderHandler(id) {
                                    return function() {
                                        var onrenderExp;
                                        rendering && id === renderId && (onrenderExp = iAttrs.onrender, onrenderExp && scope.$eval(onrenderExp), rendering = !1, _unwrap(iElm))
                                    }
                                }
                                if (!xfbmlCtrl) {
                                    var rendering = !1,
                                        renderId = 0;
                                    ezfb.$rendered().then(function() {
                                        iElm.addClass(_dirClassName), scope.$watch(function() {
                                            var watchList = [];
                                            return angular.forEach(availableAttrs, function(attrName) {
                                                watchList.push(iAttrs[attrName])
                                            }), watchList
                                        }, function(v) {
                                            var wrapFn;
                                            renderId++, rendering ? ezfb.XFBML.parse(iElm.parent()[0], genOnRenderHandler(renderId)) : (rendering = !0, wrapFn = _withAdaptiveWidth ? _wrapAdaptive : _wrap, ezfb.XFBML.parse(wrapFn(iElm)[0], genOnRenderHandler(renderId)))
                                        }, !0)
                                    }), iElm.bind("$destroy", function() {
                                        _isWrapped(iElm) && _unwrap(iElm)
                                    })
                                }
                            }
                    }
                }
            }])
        }
        module.provider("ezfb", function() {
            function _config(target, config) {
                return angular.isObject(config) ? void angular.extend(target, config) : angular.copy(target)
            }

            function _proxy(func, context, args) {
                return function() {
                    return func.apply(context, args)
                }
            }
            var APP_EVENTS_EVENT_NAMES = {
                    COMPLETED_REGISTRATION: "fb_mobile_complete_registration",
                    VIEWED_CONTENT: "fb_mobile_content_view",
                    SEARCHED: "fb_mobile_search",
                    RATED: "fb_mobile_rate",
                    COMPLETED_TUTORIAL: "fb_mobile_tutorial_completion",
                    ADDED_TO_CART: "fb_mobile_add_to_cart",
                    ADDED_TO_WISHLIST: "fb_mobile_add_to_wishlist",
                    INITIATED_CHECKOUT: "fb_mobile_initiated_checkout",
                    ADDED_PAYMENT_INFO: "fb_mobile_add_payment_info",
                    ACHIEVED_LEVEL: "fb_mobile_level_achieved",
                    UNLOCKED_ACHIEVEMENT: "fb_mobile_achievement_unlocked",
                    SPENT_CREDITS: "fb_mobile_spent_credits"
                },
                APP_EVENTS_PARAMETER_NAMES = {
                    CURRENCY: "fb_currency",
                    REGISTRATION_METHOD: "fb_registration_method",
                    CONTENT_TYPE: "fb_content_type",
                    CONTENT_ID: "fb_content_id",
                    SEARCH_STRING: "fb_search_string",
                    SUCCESS: "fb_success",
                    MAX_RATING_VALUE: "fb_max_rating_value",
                    PAYMENT_INFO_AVAILABLE: "fb_payment_info_available",
                    NUM_ITEMS: "fb_num_items",
                    LEVEL: "fb_level",
                    DESCRIPTION: "fb_description"
                },
                NO_CALLBACK = -1,
                _publishedApis = {
                    api: [1, 2, 3],
                    ui: 1,
                    getAuthResponse: NO_CALLBACK,
                    getLoginStatus: 0,
                    login: 0,
                    logout: 0,
                    "Event.subscribe": 1,
                    "Event.unsubscribe": 1,
                    "XFBML.parse": 1,
                    "Canvas.Prefetcher.addStaticResource": NO_CALLBACK,
                    "Canvas.Prefetcher.setCollectionMode": NO_CALLBACK,
                    "Canvas.getPageInfo": 0,
                    "Canvas.hideFlashElement": NO_CALLBACK,
                    "Canvas.scrollTo": NO_CALLBACK,
                    "Canvas.setAutoGrow": NO_CALLBACK,
                    "Canvas.setDoneLoading": 0,
                    "Canvas.setSize": NO_CALLBACK,
                    "Canvas.setUrlHandler": 0,
                    "Canvas.showFlashElement": NO_CALLBACK,
                    "Canvas.startTimer": NO_CALLBACK,
                    "Canvas.stopTimer": 0,
                    "AppEvents.logEvent": NO_CALLBACK,
                    "AppEvents.logPurchase": NO_CALLBACK,
                    "AppEvents.activateApp": NO_CALLBACK
                },
                _locale = "en_US",
                _initParams = {
                    status: !0,
                    cookie: !0,
                    xfbml: !0,
                    version: "v2.4"
                },
                _defaultLoadSDKFunction = ["$window", "$document", "ezfbAsyncInit", "ezfbLocale", function($window, $document, ezfbAsyncInit, ezfbLocale) {
                    ! function(d) {
                        var js, id = "facebook-jssdk",
                            ref = d.getElementsByTagName("script")[0];
                        d.getElementById(id) || (js = d.createElement("script"), js.id = id, js.async = !0, js.src = "//connect.facebook.net/" + ezfbLocale + "/sdk.js", ref.parentNode.insertBefore(js, ref))
                    }($document[0]), $window.fbAsyncInit = ezfbAsyncInit
                }],
                _loadSDKFunction = _defaultLoadSDKFunction,
                _defaultInitFunction = ["$window", "ezfbInitParams", function($window, ezfbInitParams) {
                    $window.FB.init(ezfbInitParams)
                }],
                _initFunction = _defaultInitFunction;
            return {
                setInitParams: function(params) {
                    _config(_initParams, params)
                },
                getInitParams: function() {
                    return _config(_initParams)
                },
                setLocale: function(locale) {
                    _locale = locale
                },
                getLocale: function() {
                    return _locale
                },
                setLoadSDKFunction: function(func) {
                    if (!angular.isArray(func) && !angular.isFunction(func)) throw new Error("Init function type error.");
                    _loadSDKFunction = func
                },
                getLoadSDKFunction: function() {
                    return _loadSDKFunction
                },
                setInitFunction: function(func) {
                    if (!angular.isArray(func) && !angular.isFunction(func)) throw new Error("Init function type error.");
                    _initFunction = func
                },
                getInitFunction: function() {
                    return _initFunction
                },
                $get: ["$window", "$q", "$document", "$parse", "$rootScope", "$injector", "$timeout", function($window, $q, $document, $parse, $rootScope, $injector, $timeout) {
                    var _initReady, _initRenderReady, _ezfb, _savedListeners, _paramsReady, ezfbAsyncInit;
                    return _savedListeners = {}, _paramsReady = $q.defer(), (_initParams.appId || _initFunction !== _defaultInitFunction) && _paramsReady.resolve(), _initReady = $q.defer(), _initRenderReady = $q.defer(), $document[0].getElementById("fb-root") || $document.find("body").append('<div id="fb-root"></div>'), ezfbAsyncInit = function() {
                        _paramsReady.promise.then(function() {
                            var onRender = function() {
                                _ezfb.$$rendered = !0, $timeout(function() {
                                    _initRenderReady.resolve()
                                }), _ezfb.Event.unsubscribe("xfbml.render", onRender)
                            };
                            _ezfb.Event.subscribe("xfbml.render", onRender), $injector.invoke(_initFunction, null, {
                                ezfbInitParams: _initParams
                            }), _ezfb.$$ready = !0, _initReady.resolve()
                        })
                    }, $injector.invoke(_loadSDKFunction, null, {
                        ezfbAsyncInit: ezfbAsyncInit,
                        ezfbLocale: _locale
                    }), _ezfb = {
                        $$ready: !1,
                        $$rendered: !1,
                        $ready: function(fn) {
                            return angular.isFunction(fn) && _initReady.promise.then(fn), _initReady.promise
                        },
                        $rendered: function(fn) {
                            return angular.isFunction(fn) && _initRenderReady.promise.then(fn), _initRenderReady.promise
                        },
                        init: function(params) {
                            _config(_initParams, params), _paramsReady.resolve()
                        },
                        AppEvents: {
                            EventNames: APP_EVENTS_EVENT_NAMES,
                            ParameterNames: APP_EVENTS_PARAMETER_NAMES
                        }
                    }, angular.forEach(_publishedApis, function(cbArgIndex, apiPath) {
                        var getter = $parse(apiPath),
                            setter = getter.assign;
                        setter(_ezfb, function() {
                            var apiCall = _proxy(function(args) {
                                var dfd, replaceCallbackAt;
                                if (dfd = $q.defer(), replaceCallbackAt = function(index) {
                                        var func, newFunc;
                                        for (func = angular.isFunction(args[index]) ? args[index] : angular.noop, newFunc = function() {
                                                var funcArgs = Array.prototype.slice.call(arguments);
                                                $rootScope.$$phase ? (func.apply(null, funcArgs), dfd.resolve.apply(dfd, funcArgs)) : $rootScope.$apply(function() {
                                                    func.apply(null, funcArgs), dfd.resolve.apply(dfd, funcArgs)
                                                })
                                            }; args.length <= index;) args.push(null);
                                        var eventName;
                                        if ("Event.subscribe" === apiPath) eventName = args[0], angular.isUndefined(_savedListeners[eventName]) && (_savedListeners[eventName] = []), _savedListeners[eventName].push({
                                            original: func,
                                            wrapped: newFunc
                                        });
                                        else if ("Event.unsubscribe" === apiPath && (eventName = args[0], angular.isArray(_savedListeners[eventName]))) {
                                            var i, subscribed, l = _savedListeners[eventName].length;
                                            for (i = 0; l > i; i++)
                                                if (subscribed = _savedListeners[eventName][i], subscribed.original === func) {
                                                    newFunc = subscribed.wrapped, _savedListeners[eventName].splice(i, 1);
                                                    break
                                                }
                                        }
                                        args[index] = newFunc
                                    }, cbArgIndex !== NO_CALLBACK)
                                    if (angular.isNumber(cbArgIndex)) replaceCallbackAt(cbArgIndex);
                                    else if (angular.isArray(cbArgIndex)) {
                                    var i, c;
                                    for (i = 0; i < cbArgIndex.length; i++)
                                        if (c = cbArgIndex[i], args.length == c || args.length == c + 1 && angular.isFunction(args[c])) {
                                            replaceCallbackAt(c);
                                            break
                                        }
                                }
                                var origFBFunc = getter($window.FB);
                                if (!origFBFunc) throw new Error("Facebook API `FB." + apiPath + "` doesn't exist.");
                                return origFBFunc.apply($window.FB, args), dfd.promise
                            }, null, [Array.prototype.slice.call(arguments)]);
                            if ("getAuthResponse" === apiPath) {
                                if (angular.isUndefined($window.FB)) throw new Error("`FB` is not ready.");
                                return $window.FB.getAuthResponse()
                            }
                            return cbArgIndex !== NO_CALLBACK ? _initReady.promise.then(apiCall) : void _initReady.promise.then(apiCall)
                        })
                    }), _ezfb
                }]
            }
        }).directive("ezfbXfbml", ["ezfb", "$parse", "$compile", "$timeout", function(ezfb, $parse, $compile, $timeout) {
            return {
                restrict: "EAC",
                controller: function() {},
                compile: function(tElm, tAttrs) {
                    var _savedHtml = tElm.html();
                    return function(scope, iElm, iAttrs) {
                        var _rendering = !0,
                            onrenderExp = iAttrs.onrender,
                            onrenderHandler = function() {
                                _rendering && (onrenderExp && scope.$eval(onrenderExp), _rendering = !1)
                            };
                        ezfb.XFBML.parse(iElm[0], onrenderHandler);
                        var setter = $parse(iAttrs.ezfbXfbml).assign;
                        scope.$watch(iAttrs.ezfbXfbml, function(val) {
                            val && (_rendering = !0, iElm.html(_savedHtml), $compile(iElm.contents())(scope), $timeout(function() {
                                ezfb.XFBML.parse(iElm[0], onrenderHandler)
                            }), (setter || angular.noop)(scope, !1))
                        }, !0)
                    }
                }
            }
        }]);
        var _socialPluginDirectiveConfig = {
            fbLike: ["action", "colorscheme", "href", "kidDirectedSite", "layout", "ref", "share", "showFaces", "width"],
            fbShareButton: ["href", "layout", "width"],
            fbSend: ["colorscheme", "href", "kidDirectedSite", "ref"],
            fbPost: ["href", "width"],
            fbFollow: ["colorscheme", "href", "kidDirectedSite", "layout", "showFaces", "width"],
            fbComments: ["colorscheme", "href", "mobile", "numPosts", "orderBy", "width"],
            fbCommentsCount: ["href"],
            fbActivity: ["action", "appId", "colorscheme", "filter", "header", "height", "linktarget", "maxAge", "recommendations", "ref", "site", "width"],
            fbRecommendations: ["action", "appId", "colorscheme", "header", "height", "linktarget", "maxAge", "ref", "site", "width"],
            fbRecommendationsBar: ["action", "href", "maxAge", "numRecommendations", "readTime", "ref", "side", "site", "trigger"],
            fbLikeBox: ["colorscheme", "forceWall", "header", "height", "href", "showBorder", "showFaces", "stream", "width"],
            fbFacepile: ["action", "appId", "colorscheme", "href", "maxRows", "size", "width"],
            fbPage: ["href", "width", "height", "hideCover", "showFacepile", "showPosts"],
            fbVideo: ["href", "width", "allowfullscreen"],
            fbAdPreview: ["adAccountId", "adgroupId", "creative", "creativeId", "adFormat", "pageType", "targeting", "post"]
        };
        angular.forEach(_socialPluginDirectiveConfig, creatSocialPluginDirective)
    }(angular.module("ezfb", []));