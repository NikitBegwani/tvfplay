"undefined" != typeof module && "undefined" != typeof exports && module.exports === exports && (module.exports = "ui.router"),
    function(window, angular, undefined) {
        "use strict";

        function inherit(parent, extra) {
            return extend(new(extend(function() {}, {
                prototype: parent
            })), extra)
        }

        function merge(dst) {
            return forEach(arguments, function(obj) {
                obj !== dst && forEach(obj, function(value, key) {
                    dst.hasOwnProperty(key) || (dst[key] = value)
                })
            }), dst
        }

        function ancestors(first, second) {
            var path = [];
            for (var n in first.path) {
                if (first.path[n] !== second.path[n]) break;
                path.push(first.path[n])
            }
            return path
        }

        function objectKeys(object) {
            if (Object.keys) return Object.keys(object);
            var result = [];
            return forEach(object, function(val, key) {
                result.push(key)
            }), result
        }

        function indexOf(array, value) {
            if (Array.prototype.indexOf) return array.indexOf(value, Number(arguments[2]) || 0);
            var len = array.length >>> 0,
                from = Number(arguments[2]) || 0;
            for (from = 0 > from ? Math.ceil(from) : Math.floor(from), 0 > from && (from += len); len > from; from++)
                if (from in array && array[from] === value) return from;
            return -1
        }

        function inheritParams(currentParams, newParams, $current, $to) {
            var parentParams, parents = ancestors($current, $to),
                inherited = {},
                inheritList = [];
            for (var i in parents)
                if (parents[i].params && (parentParams = objectKeys(parents[i].params), parentParams.length))
                    for (var j in parentParams) indexOf(inheritList, parentParams[j]) >= 0 || (inheritList.push(parentParams[j]), inherited[parentParams[j]] = currentParams[parentParams[j]]);
            return extend({}, inherited, newParams)
        }

        function equalForKeys(a, b, keys) {
            if (!keys) {
                keys = [];
                for (var n in a) keys.push(n)
            }
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (a[k] != b[k]) return !1
            }
            return !0
        }

        function filterByKeys(keys, values) {
            var filtered = {};
            return forEach(keys, function(name) {
                filtered[name] = values[name]
            }), filtered
        }

        function pick(obj) {
            var copy = {},
                keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            return forEach(keys, function(key) {
                key in obj && (copy[key] = obj[key])
            }), copy
        }

        function omit(obj) {
            var copy = {},
                keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
            for (var key in obj) - 1 == indexOf(keys, key) && (copy[key] = obj[key]);
            return copy
        }

        function filter(collection, callback) {
            var array = isArray(collection),
                result = array ? [] : {};
            return forEach(collection, function(val, i) {
                callback(val, i) && (result[array ? result.length : i] = val)
            }), result
        }

        function map(collection, callback) {
            var result = isArray(collection) ? [] : {};
            return forEach(collection, function(val, i) {
                result[i] = callback(val, i)
            }), result
        }

        function $Resolve($q, $injector) {
            var VISIT_IN_PROGRESS = 1,
                VISIT_DONE = 2,
                NOTHING = {},
                NO_DEPENDENCIES = [],
                NO_LOCALS = NOTHING,
                NO_PARENT = extend($q.when(NOTHING), {
                    $$promises: NOTHING,
                    $$values: NOTHING
                });
            this.study = function(invocables) {
                function visit(value, key) {
                    if (visited[key] !== VISIT_DONE) {
                        if (cycle.push(key), visited[key] === VISIT_IN_PROGRESS) throw cycle.splice(0, indexOf(cycle, key)), new Error("Cyclic dependency: " + cycle.join(" -> "));
                        if (visited[key] = VISIT_IN_PROGRESS, isString(value)) plan.push(key, [function() {
                            return $injector.get(value)
                        }], NO_DEPENDENCIES);
                        else {
                            var params = $injector.annotate(value);
                            forEach(params, function(param) {
                                param !== key && invocables.hasOwnProperty(param) && visit(invocables[param], param)
                            }), plan.push(key, value, params)
                        }
                        cycle.pop(), visited[key] = VISIT_DONE
                    }
                }

                function isResolve(value) {
                    return isObject(value) && value.then && value.$$promises
                }
                if (!isObject(invocables)) throw new Error("'invocables' must be an object");
                var invocableKeys = objectKeys(invocables || {}),
                    plan = [],
                    cycle = [],
                    visited = {};
                return forEach(invocables, visit), invocables = cycle = visited = null,
                    function(locals, parent, self) {
                        function done() {
                            --wait || (merged || merge(values, parent.$$values), result.$$values = values, result.$$promises = result.$$promises || !0, delete result.$$inheritedValues, resolution.resolve(values))
                        }

                        function fail(reason) {
                            result.$$failure = reason, resolution.reject(reason)
                        }

                        function invoke(key, invocable, params) {
                            function onfailure(reason) {
                                invocation.reject(reason), fail(reason)
                            }

                            function proceed() {
                                if (!isDefined(result.$$failure)) try {
                                    invocation.resolve($injector.invoke(invocable, self, values)), invocation.promise.then(function(result) {
                                        values[key] = result, done()
                                    }, onfailure)
                                } catch (e) {
                                    onfailure(e)
                                }
                            }
                            var invocation = $q.defer(),
                                waitParams = 0;
                            forEach(params, function(dep) {
                                promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep) && (waitParams++, promises[dep].then(function(result) {
                                    values[dep] = result, --waitParams || proceed()
                                }, onfailure))
                            }), waitParams || proceed(), promises[key] = invocation.promise
                        }
                        if (isResolve(locals) && self === undefined && (self = parent, parent = locals, locals = null), locals) {
                            if (!isObject(locals)) throw new Error("'locals' must be an object")
                        } else locals = NO_LOCALS;
                        if (parent) {
                            if (!isResolve(parent)) throw new Error("'parent' must be a promise returned by $resolve.resolve()")
                        } else parent = NO_PARENT;
                        var resolution = $q.defer(),
                            result = resolution.promise,
                            promises = result.$$promises = {},
                            values = extend({}, locals),
                            wait = 1 + plan.length / 3,
                            merged = !1;
                        if (isDefined(parent.$$failure)) return fail(parent.$$failure), result;
                        parent.$$inheritedValues && merge(values, omit(parent.$$inheritedValues, invocableKeys)), extend(promises, parent.$$promises), parent.$$values ? (merged = merge(values, omit(parent.$$values, invocableKeys)), result.$$inheritedValues = omit(parent.$$values, invocableKeys), done()) : (parent.$$inheritedValues && (result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys)), parent.then(done, fail));
                        for (var i = 0, ii = plan.length; ii > i; i += 3) locals.hasOwnProperty(plan[i]) ? done() : invoke(plan[i], plan[i + 1], plan[i + 2]);
                        return result
                    }
            }, this.resolve = function(invocables, locals, parent, self) {
                return this.study(invocables)(locals, parent, self)
            }
        }

        function $TemplateFactory($http, $templateCache, $injector) {
            this.fromConfig = function(config, params, locals) {
                return isDefined(config.template) ? this.fromString(config.template, params) : isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) : isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) : null
            }, this.fromString = function(template, params) {
                return isFunction(template) ? template(params) : template
            }, this.fromUrl = function(url, params) {
                return isFunction(url) && (url = url(params)), null == url ? null : $http.get(url, {
                    cache: $templateCache,
                    headers: {
                        Accept: "text/html"
                    }
                }).then(function(response) {
                    return response.data
                })
            }, this.fromProvider = function(provider, params, locals) {
                return $injector.invoke(provider, null, locals || {
                    params: params
                })
            }
        }

        function UrlMatcher(pattern, config, parentMatcher) {
            function addParameter(id, type, config, location) {
                if (paramNames.push(id), parentParams[id]) return parentParams[id];
                if (!/^\w+(-+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
                if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
                return params[id] = new $$UMFP.Param(id, type, config, location), params[id]
            }

            function quoteRegExp(string, pattern, squash, optional) {
                var surroundPattern = ["", ""],
                    result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
                if (!pattern) return result;
                switch (squash) {
                    case !1:
                        surroundPattern = ["(", ")" + (optional ? "?" : "")];
                        break;
                    case !0:
                        surroundPattern = ["?(", ")?"];
                        break;
                    default:
                        surroundPattern = ["(" + squash + "|", ")?"]
                }
                return result + surroundPattern[0] + pattern + surroundPattern[1]
            }

            function matchDetails(m, isSearch) {
                var id, regexp, segment, type, cfg;
                return id = m[2] || m[3], cfg = config.params[id], segment = pattern.substring(last, m.index), regexp = isSearch ? m[4] : m[4] || ("*" == m[1] ? ".*" : null), type = $$UMFP.type(regexp || "string") || inherit($$UMFP.type("string"), {
                    pattern: new RegExp(regexp, config.caseInsensitive ? "i" : undefined)
                }), {
                    id: id,
                    regexp: regexp,
                    segment: segment,
                    type: type,
                    cfg: cfg
                }
            }
            config = extend({
                params: {}
            }, isObject(config) ? config : {});
            var m, placeholder = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
                searchPlaceholder = /([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
                compiled = "^",
                last = 0,
                segments = this.segments = [],
                parentParams = parentMatcher ? parentMatcher.params : {},
                params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet,
                paramNames = [];
            this.source = pattern;
            for (var p, param, segment;
                (m = placeholder.exec(pattern)) && (p = matchDetails(m, !1), !(p.segment.indexOf("?") >= 0));) param = addParameter(p.id, p.type, p.cfg, "path"), compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash, param.isOptional), segments.push(p.segment), last = placeholder.lastIndex;
            segment = pattern.substring(last);
            var i = segment.indexOf("?");
            if (i >= 0) {
                var search = this.sourceSearch = segment.substring(i);
                if (segment = segment.substring(0, i), this.sourcePath = pattern.substring(0, last + i), search.length > 0)
                    for (last = 0; m = searchPlaceholder.exec(search);) p = matchDetails(m, !0), param = addParameter(p.id, p.type, p.cfg, "search"), last = placeholder.lastIndex
            } else this.sourcePath = pattern, this.sourceSearch = "";
            compiled += quoteRegExp(segment) + (config.strict === !1 ? "/?" : "") + "$", segments.push(segment), this.regexp = new RegExp(compiled, config.caseInsensitive ? "i" : undefined), this.prefix = segments[0], this.$$paramNames = paramNames
        }

        function Type(config) {
            extend(this, config)
        }

        function $UrlMatcherFactory() {
            function valToString(val) {
                return null != val ? val.toString().replace(/\//g, "%2F") : val
            }

            function valFromString(val) {
                return null != val ? val.toString().replace(/%2F/g, "/") : val
            }

            function getDefaultConfig() {
                return {
                    strict: isStrictMode,
                    caseInsensitive: isCaseInsensitive
                }
            }

            function isInjectable(value) {
                return isFunction(value) || isArray(value) && isFunction(value[value.length - 1])
            }

            function flushTypeQueue() {
                for (; typeQueue.length;) {
                    var type = typeQueue.shift();
                    if (type.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
                    angular.extend($types[type.name], injector.invoke(type.def))
                }
            }

            function ParamSet(params) {
                extend(this, params || {})
            }
            $$UMFP = this;
            var injector, isCaseInsensitive = !1,
                isStrictMode = !0,
                defaultSquashPolicy = !1,
                $types = {},
                enqueue = !0,
                typeQueue = [],
                defaultTypes = {
                    string: {
                        encode: valToString,
                        decode: valFromString,
                        is: function(val) {
                            return null == val || !isDefined(val) || "string" == typeof val
                        },
                        pattern: /[^\/]*/
                    },
                    "int": {
                        encode: valToString,
                        decode: function(val) {
                            return parseInt(val, 10)
                        },
                        is: function(val) {
                            return isDefined(val) && this.decode(val.toString()) === val
                        },
                        pattern: /\d+/
                    },
                    bool: {
                        encode: function(val) {
                            return val ? 1 : 0
                        },
                        decode: function(val) {
                            return 0 !== parseInt(val, 10)
                        },
                        is: function(val) {
                            return val === !0 || val === !1
                        },
                        pattern: /0|1/
                    },
                    date: {
                        encode: function(val) {
                            return this.is(val) ? [val.getFullYear(), ("0" + (val.getMonth() + 1)).slice(-2), ("0" + val.getDate()).slice(-2)].join("-") : undefined
                        },
                        decode: function(val) {
                            if (this.is(val)) return val;
                            var match = this.capture.exec(val);
                            return match ? new Date(match[1], match[2] - 1, match[3]) : undefined
                        },
                        is: function(val) {
                            return val instanceof Date && !isNaN(val.valueOf())
                        },
                        equals: function(a, b) {
                            return this.is(a) && this.is(b) && a.toISOString() === b.toISOString()
                        },
                        pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
                        capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
                    },
                    json: {
                        encode: angular.toJson,
                        decode: angular.fromJson,
                        is: angular.isObject,
                        equals: angular.equals,
                        pattern: /[^\/]*/
                    },
                    any: {
                        encode: angular.identity,
                        decode: angular.identity,
                        equals: angular.equals,
                        pattern: /.*/
                    }
                };
            $UrlMatcherFactory.$$getDefaultValue = function(config) {
                if (!isInjectable(config.value)) return config.value;
                if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
                return injector.invoke(config.value)
            }, this.caseInsensitive = function(value) {
                return isDefined(value) && (isCaseInsensitive = value), isCaseInsensitive
            }, this.strictMode = function(value) {
                return isDefined(value) && (isStrictMode = value), isStrictMode
            }, this.defaultSquashPolicy = function(value) {
                if (!isDefined(value)) return defaultSquashPolicy;
                if (value !== !0 && value !== !1 && !isString(value)) throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
                return defaultSquashPolicy = value, value
            }, this.compile = function(pattern, config) {
                return new UrlMatcher(pattern, extend(getDefaultConfig(), config))
            }, this.isMatcher = function(o) {
                if (!isObject(o)) return !1;
                var result = !0;
                return forEach(UrlMatcher.prototype, function(val, name) {
                    isFunction(val) && (result = result && isDefined(o[name]) && isFunction(o[name]))
                }), result
            }, this.type = function(name, definition, definitionFn) {
                if (!isDefined(definition)) return $types[name];
                if ($types.hasOwnProperty(name)) throw new Error("A type named '" + name + "' has already been defined.");
                return $types[name] = new Type(extend({
                    name: name
                }, definition)), definitionFn && (typeQueue.push({
                    name: name,
                    def: definitionFn
                }), enqueue || flushTypeQueue()), this
            }, forEach(defaultTypes, function(type, name) {
                $types[name] = new Type(extend({
                    name: name
                }, type))
            }), $types = inherit($types, {}), this.$get = ["$injector", function($injector) {
                return injector = $injector, enqueue = !1, flushTypeQueue(), forEach(defaultTypes, function(type, name) {
                    $types[name] || ($types[name] = new Type(type))
                }), this
            }], this.Param = function(id, type, config, location) {
                function unwrapShorthand(config) {
                    var keys = isObject(config) ? objectKeys(config) : [],
                        isShorthand = -1 === indexOf(keys, "value") && -1 === indexOf(keys, "type") && -1 === indexOf(keys, "squash") && -1 === indexOf(keys, "array");
                    return isShorthand && (config = {
                        value: config
                    }), config.$$fn = isInjectable(config.value) ? config.value : function() {
                        return config.value
                    }, config
                }

                function getType(config, urlType, location) {
                    if (config.type && urlType) throw new Error("Param '" + id + "' has two type configurations.");
                    return urlType ? urlType : config.type ? config.type instanceof Type ? config.type : new Type(config.type) : "config" === location ? $types.any : $types.string
                }

                function getArrayMode() {
                    var arrayDefaults = {
                            array: "search" === location ? "auto" : !1
                        },
                        arrayParamNomenclature = id.match(/\[\]$/) ? {
                            array: !0
                        } : {};
                    return extend(arrayDefaults, arrayParamNomenclature, config).array
                }

                function getSquashPolicy(config, isOptional) {
                    var squash = config.squash;
                    if (!isOptional || squash === !1) return !1;
                    if (!isDefined(squash) || null == squash) return defaultSquashPolicy;
                    if (squash === !0 || isString(squash)) return squash;
                    throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string")
                }

                function getReplace(config, arrayMode, isOptional, squash) {
                    var replace, configuredKeys, defaultPolicy = [{
                        from: "",
                        to: isOptional || arrayMode ? undefined : ""
                    }, {
                        from: null,
                        to: isOptional || arrayMode ? undefined : ""
                    }];
                    return replace = isArray(config.replace) ? config.replace : [], isString(squash) && replace.push({
                        from: squash,
                        to: undefined
                    }), configuredKeys = map(replace, function(item) {
                        return item.from
                    }), filter(defaultPolicy, function(item) {
                        return -1 === indexOf(configuredKeys, item.from)
                    }).concat(replace)
                }

                function $$getDefaultValue() {
                    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
                    var defaultValue = injector.invoke(config.$$fn);
                    if (null !== defaultValue && defaultValue !== undefined && !self.type.is(defaultValue)) throw new Error("Default value (" + defaultValue + ") for parameter '" + self.id + "' is not an instance of Type (" + self.type.name + ")");
                    return defaultValue
                }

                function $value(value) {
                    function hasReplaceVal(val) {
                        return function(obj) {
                            return obj.from === val
                        }
                    }

                    function $replace(value) {
                        var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) {
                            return obj.to
                        });
                        return replacement.length ? replacement[0] : value
                    }
                    return value = $replace(value), isDefined(value) ? self.type.$normalize(value) : $$getDefaultValue()
                }

                function toString() {
                    return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}"
                }
                var self = this;
                config = unwrapShorthand(config), type = getType(config, type, location);
                var arrayMode = getArrayMode();
                type = arrayMode ? type.$asArray(arrayMode, "search" === location) : type, "string" !== type.name || arrayMode || "path" !== location || config.value !== undefined || (config.value = "");
                var isOptional = config.value !== undefined,
                    squash = getSquashPolicy(config, isOptional),
                    replace = getReplace(config, arrayMode, isOptional, squash);
                extend(this, {
                    id: id,
                    type: type,
                    location: location,
                    array: arrayMode,
                    squash: squash,
                    replace: replace,
                    isOptional: isOptional,
                    value: $value,
                    dynamic: undefined,
                    config: config,
                    toString: toString
                })
            }, ParamSet.prototype = {
                $$new: function() {
                    return inherit(this, extend(new ParamSet, {
                        $$parent: this
                    }))
                },
                $$keys: function() {
                    for (var keys = [], chain = [], parent = this, ignore = objectKeys(ParamSet.prototype); parent;) chain.push(parent), parent = parent.$$parent;
                    return chain.reverse(), forEach(chain, function(paramset) {
                        forEach(objectKeys(paramset), function(key) {
                            -1 === indexOf(keys, key) && -1 === indexOf(ignore, key) && keys.push(key)
                        })
                    }), keys
                },
                $$values: function(paramValues) {
                    var values = {},
                        self = this;
                    return forEach(self.$$keys(), function(key) {
                        values[key] = self[key].value(paramValues && paramValues[key])
                    }), values
                },
                $$equals: function(paramValues1, paramValues2) {
                    var equal = !0,
                        self = this;
                    return forEach(self.$$keys(), function(key) {
                        var left = paramValues1 && paramValues1[key],
                            right = paramValues2 && paramValues2[key];
                        self[key].type.equals(left, right) || (equal = !1)
                    }), equal
                },
                $$validates: function(paramValues) {
                    var i, param, rawVal, normalized, encoded, keys = this.$$keys();
                    for (i = 0; i < keys.length && (param = this[keys[i]], rawVal = paramValues[keys[i]], rawVal !== undefined && null !== rawVal || !param.isOptional); i++) {
                        if (normalized = param.type.$normalize(rawVal), !param.type.is(normalized)) return !1;
                        if (encoded = param.type.encode(normalized), angular.isString(encoded) && !param.type.pattern.exec(encoded)) return !1
                    }
                    return !0
                },
                $$parent: undefined
            }, this.ParamSet = ParamSet
        }

        function $UrlRouterProvider($locationProvider, $urlMatcherFactory) {
            function regExpPrefix(re) {
                var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
                return null != prefix ? prefix[1].replace(/\\(.)/g, "$1") : ""
            }

            function interpolate(pattern, match) {
                return pattern.replace(/\$(\$|\d{1,2})/, function(m, what) {
                    return match["$" === what ? 0 : Number(what)]
                })
            }

            function handleIfMatch($injector, handler, match) {
                if (!match) return !1;
                var result = $injector.invoke(handler, handler, {
                    $match: match
                });
                return isDefined(result) ? result : !0
            }

            function $get($location, $rootScope, $injector, $browser) {
                function appendBasePath(url, isHtml5, absolute) {
                    return "/" === baseHref ? url : isHtml5 ? baseHref.slice(0, -1) + url : absolute ? baseHref.slice(1) + url : url
                }

                function update(evt) {
                    function check(rule) {
                        var handled = rule($injector, $location);
                        return handled ? (isString(handled) && $location.replace().url(handled), !0) : !1
                    }
                    if (!evt || !evt.defaultPrevented) {
                        lastPushedUrl && $location.url() === lastPushedUrl;
                        lastPushedUrl = undefined;
                        var i, n = rules.length;
                        for (i = 0; n > i; i++)
                            if (check(rules[i])) return;
                        otherwise && check(otherwise)
                    }
                }

                function listen() {
                    return listener = listener || $rootScope.$on("$locationChangeSuccess", update)
                }
                var lastPushedUrl, baseHref = $browser.baseHref(),
                    location = $location.url();
                return interceptDeferred || listen(), {
                    sync: function() {
                        update()
                    },
                    listen: function() {
                        return listen()
                    },
                    update: function(read) {
                        return read ? void(location = $location.url()) : void($location.url() !== location && ($location.url(location), $location.replace()))
                    },
                    push: function(urlMatcher, params, options) {
                        var url = urlMatcher.format(params || {});
                        null !== url && params && params["#"] && (url += "#" + params["#"]), $location.url(url), lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined, options && options.replace && $location.replace()
                    },
                    href: function(urlMatcher, params, options) {
                        if (!urlMatcher.validates(params)) return null;
                        var isHtml5 = $locationProvider.html5Mode();
                        angular.isObject(isHtml5) && (isHtml5 = isHtml5.enabled);
                        var url = urlMatcher.format(params);
                        if (options = options || {}, isHtml5 || null === url || (url = "#" + $locationProvider.hashPrefix() + url), null !== url && params && params["#"] && (url += "#" + params["#"]), url = appendBasePath(url, isHtml5, options.absolute), !options.absolute || !url) return url;
                        var slash = !isHtml5 && url ? "/" : "",
                            port = $location.port();
                        return port = 80 === port || 443 === port ? "" : ":" + port, [$location.protocol(), "://", $location.host(), port, slash, url].join("")
                    }
                }
            }
            var listener, rules = [],
                otherwise = null,
                interceptDeferred = !1;
            this.rule = function(rule) {
                if (!isFunction(rule)) throw new Error("'rule' must be a function");
                return rules.push(rule), this
            }, this.otherwise = function(rule) {
                if (isString(rule)) {
                    var redirect = rule;
                    rule = function() {
                        return redirect
                    }
                } else if (!isFunction(rule)) throw new Error("'rule' must be a function");
                return otherwise = rule, this
            }, this.when = function(what, handler) {
                var redirect, handlerIsString = isString(handler);
                if (isString(what) && (what = $urlMatcherFactory.compile(what)), !handlerIsString && !isFunction(handler) && !isArray(handler)) throw new Error("invalid 'handler' in when()");
                var strategies = {
                        matcher: function(what, handler) {
                            return handlerIsString && (redirect = $urlMatcherFactory.compile(handler), handler = ["$match", function($match) {
                                return redirect.format($match)
                            }]), extend(function($injector, $location) {
                                return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()))
                            }, {
                                prefix: isString(what.prefix) ? what.prefix : ""
                            })
                        },
                        regex: function(what, handler) {
                            if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");
                            return handlerIsString && (redirect = handler, handler = ["$match", function($match) {
                                return interpolate(redirect, $match)
                            }]), extend(function($injector, $location) {
                                return handleIfMatch($injector, handler, what.exec($location.path()))
                            }, {
                                prefix: regExpPrefix(what)
                            })
                        }
                    },
                    check = {
                        matcher: $urlMatcherFactory.isMatcher(what),
                        regex: what instanceof RegExp
                    };
                for (var n in check)
                    if (check[n]) return this.rule(strategies[n](what, handler));
                throw new Error("invalid 'what' in when()")
            }, this.deferIntercept = function(defer) {
                defer === undefined && (defer = !0), interceptDeferred = defer
            }, this.$get = $get, $get.$inject = ["$location", "$rootScope", "$injector", "$browser"]
        }

        function $StateProvider($urlRouterProvider, $urlMatcherFactory) {
            function isRelative(stateName) {
                return 0 === stateName.indexOf(".") || 0 === stateName.indexOf("^")
            }

            function findState(stateOrName, base) {
                if (!stateOrName) return undefined;
                var isStr = isString(stateOrName),
                    name = isStr ? stateOrName : stateOrName.name,
                    path = isRelative(name);
                if (path) {
                    if (!base) throw new Error("No reference point given for path '" + name + "'");
                    base = findState(base);
                    for (var rel = name.split("."), i = 0, pathLength = rel.length, current = base; pathLength > i; i++)
                        if ("" !== rel[i] || 0 !== i) {
                            if ("^" !== rel[i]) break;
                            if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
                            current = current.parent
                        } else current = base;
                    rel = rel.slice(i).join("."), name = current.name + (current.name && rel ? "." : "") + rel
                }
                var state = states[name];
                return !state || !isStr && (isStr || state !== stateOrName && state.self !== stateOrName) ? undefined : state
            }

            function queueState(parentName, state) {
                queue[parentName] || (queue[parentName] = []), queue[parentName].push(state)
            }

            function flushQueuedChildren(parentName) {
                for (var queued = queue[parentName] || []; queued.length;) registerState(queued.shift())
            }

            function registerState(state) {
                state = inherit(state, {
                    self: state,
                    resolve: state.resolve || {},
                    toString: function() {
                        return this.name
                    }
                });
                var name = state.name;
                if (!isString(name) || name.indexOf("@") >= 0) throw new Error("State must have a valid name");
                if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");
                var parentName = -1 !== name.indexOf(".") ? name.substring(0, name.lastIndexOf(".")) : isString(state.parent) ? state.parent : isObject(state.parent) && isString(state.parent.name) ? state.parent.name : "";
                if (parentName && !states[parentName]) return queueState(parentName, state.self);
                for (var key in stateBuilder) isFunction(stateBuilder[key]) && (state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]));
                return states[name] = state, !state[abstractKey] && state.url && $urlRouterProvider.when(state.url, ["$match", "$stateParams", function($match, $stateParams) {
                    $state.$current.navigable == state && equalForKeys($match, $stateParams) || $state.transitionTo(state, $match, {
                        inherit: !0,
                        location: !1
                    })
                }]), flushQueuedChildren(name), state
            }

            function isGlob(text) {
                return text.indexOf("*") > -1
            }

            function doesStateMatchGlob(glob) {
                for (var globSegments = glob.split("."), segments = $state.$current.name.split("."), i = 0, l = globSegments.length; l > i; i++) "*" === globSegments[i] && (segments[i] = "*");
                return "**" === globSegments[0] && (segments = segments.slice(indexOf(segments, globSegments[1])), segments.unshift("**")), "**" === globSegments[globSegments.length - 1] && (segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE), segments.push("**")), globSegments.length != segments.length ? !1 : segments.join("") === globSegments.join("")
            }

            function decorator(name, func) {
                return isString(name) && !isDefined(func) ? stateBuilder[name] : isFunction(func) && isString(name) ? (stateBuilder[name] && !stateBuilder.$delegates[name] && (stateBuilder.$delegates[name] = stateBuilder[name]), stateBuilder[name] = func, this) : this
            }

            function state(name, definition) {
                return isObject(name) ? definition = name : definition.name = name, registerState(definition), this
            }

            function $get($rootScope, $q, $view, $injector, $resolve, $stateParams, $urlRouter, $location, $urlMatcherFactory) {
                function handleRedirect(redirect, state, params, options) {
                    var evt = $rootScope.$broadcast("$stateNotFound", redirect, state, params);
                    if (evt.defaultPrevented) return $urlRouter.update(), TransitionAborted;
                    if (!evt.retry) return null;
                    if (options.$retry) return $urlRouter.update(), TransitionFailed;
                    var retryTransition = $state.transition = $q.when(evt.retry);
                    return retryTransition.then(function() {
                        return retryTransition !== $state.transition ? TransitionSuperseded : (redirect.options.$retry = !0, $state.transitionTo(redirect.to, redirect.toParams, redirect.options))
                    }, function() {
                        return TransitionAborted
                    }), $urlRouter.update(), retryTransition
                }

                function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
                    function resolveViews() {
                        var viewsPromises = [];
                        return forEach(state.views, function(view, name) {
                            var injectables = view.resolve && view.resolve !== state.resolve ? view.resolve : {};
                            injectables.$template = [function() {
                                return $view.load(name, {
                                    view: view,
                                    locals: dst.globals,
                                    params: $stateParams,
                                    notify: options.notify
                                }) || ""
                            }], viewsPromises.push($resolve.resolve(injectables, dst.globals, dst.resolve, state).then(function(result) {
                                if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
                                    var injectLocals = angular.extend({}, injectables, dst.globals);
                                    result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals)
                                } else result.$$controller = view.controller;
                                result.$$state = state, result.$$controllerAs = view.controllerAs, dst[name] = result
                            }))
                        }), $q.all(viewsPromises).then(function() {
                            return dst.globals
                        })
                    }
                    var $stateParams = paramsAreFiltered ? params : filterByKeys(state.params.$$keys(), params),
                        locals = {
                            $stateParams: $stateParams
                        };
                    dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
                    var promises = [dst.resolve.then(function(globals) {
                        dst.globals = globals
                    })];
                    return inherited && promises.push(inherited), $q.all(promises).then(resolveViews).then(function(values) {
                        return dst
                    })
                }
                var TransitionSuperseded = $q.reject(new Error("transition superseded")),
                    TransitionPrevented = $q.reject(new Error("transition prevented")),
                    TransitionAborted = $q.reject(new Error("transition aborted")),
                    TransitionFailed = $q.reject(new Error("transition failed"));
                return root.locals = {
                    resolve: null,
                    globals: {
                        $stateParams: {}
                    }
                }, $state = {
                    params: {},
                    current: root.self,
                    $current: root,
                    transition: null
                }, $state.reload = function(state) {
                    return $state.transitionTo($state.current, $stateParams, {
                        reload: state || !0,
                        inherit: !1,
                        notify: !0
                    })
                }, $state.go = function(to, params, options) {
                    return $state.transitionTo(to, params, extend({
                        inherit: !0,
                        relative: $state.$current
                    }, options))
                }, $state.transitionTo = function(to, toParams, options) {
                    toParams = toParams || {}, options = extend({
                        location: !0,
                        inherit: !1,
                        relative: null,
                        notify: !0,
                        reload: !1,
                        $retry: !1
                    }, options || {});
                    var evt, from = $state.$current,
                        fromParams = $state.params,
                        fromPath = from.path,
                        toState = findState(to, options.relative),
                        hash = toParams["#"];
                    if (!isDefined(toState)) {
                        var redirect = {
                                to: to,
                                toParams: toParams,
                                options: options
                            },
                            redirectResult = handleRedirect(redirect, from.self, fromParams, options);
                        if (redirectResult) return redirectResult;
                        if (to = redirect.to, toParams = redirect.toParams, options = redirect.options, toState = findState(to, options.relative), !isDefined(toState)) {
                            if (!options.relative) throw new Error("No such state '" + to + "'");
                            throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'")
                        }
                    }
                    if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
                    if (options.inherit && (toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState)), !toState.params.$$validates(toParams)) return TransitionFailed;
                    toParams = toState.params.$$values(toParams), to = toState;
                    var toPath = to.path,
                        keep = 0,
                        state = toPath[keep],
                        locals = root.locals,
                        toLocals = [];
                    if (options.reload) {
                        if (isString(options.reload) || isObject(options.reload)) {
                            if (isObject(options.reload) && !options.reload.name) throw new Error("Invalid reload state object");
                            var reloadState = options.reload === !0 ? fromPath[0] : findState(options.reload);
                            if (options.reload && !reloadState) throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
                            for (; state && state === fromPath[keep] && state !== reloadState;) locals = toLocals[keep] = state.locals, keep++, state = toPath[keep]
                        }
                    } else
                        for (; state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams);) locals = toLocals[keep] = state.locals, keep++, state = toPath[keep];
                    if (shouldSkipReload(to, toParams, from, fromParams, locals, options)) return hash && (toParams["#"] = hash), $state.params = toParams, copy($state.params, $stateParams), options.location && to.navigable && to.navigable.url && ($urlRouter.push(to.navigable.url, toParams, {
                        $$avoidResync: !0,
                        replace: "replace" === options.location
                    }), $urlRouter.update(!0)), $state.transition = null, $q.when($state.current);
                    if (toParams = filterByKeys(to.params.$$keys(), toParams || {}), options.notify && $rootScope.$broadcast("$stateChangeStart", to.self, toParams, from.self, fromParams).defaultPrevented) return $rootScope.$broadcast("$stateChangeCancel", to.self, toParams, from.self, fromParams), $urlRouter.update(), TransitionPrevented;
                    for (var resolved = $q.when(locals), l = keep; l < toPath.length; l++, state = toPath[l]) locals = toLocals[l] = inherit(locals), resolved = resolveState(state, toParams, state === to, resolved, locals, options);
                    var transition = $state.transition = resolved.then(function() {
                        var l, entering, exiting;
                        if ($state.transition !== transition) return TransitionSuperseded;
                        for (l = fromPath.length - 1; l >= keep; l--) exiting = fromPath[l], exiting.self.onExit && $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals), exiting.locals = null;
                        for (l = keep; l < toPath.length; l++) entering = toPath[l], entering.locals = toLocals[l], entering.self.onEnter && $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
                        return hash && (toParams["#"] = hash), $state.transition !== transition ? TransitionSuperseded : ($state.$current = to, $state.current = to.self, $state.params = toParams, copy($state.params, $stateParams), $state.transition = null, options.location && to.navigable && $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
                            $$avoidResync: !0,
                            replace: "replace" === options.location
                        }), options.notify && $rootScope.$broadcast("$stateChangeSuccess", to.self, toParams, from.self, fromParams), $urlRouter.update(!0), $state.current)
                    }, function(error) {
                        return $state.transition !== transition ? TransitionSuperseded : ($state.transition = null, evt = $rootScope.$broadcast("$stateChangeError", to.self, toParams, from.self, fromParams, error), evt.defaultPrevented || $urlRouter.update(), $q.reject(error))
                    });
                    return transition
                }, $state.is = function(stateOrName, params, options) {
                    options = extend({
                        relative: $state.$current
                    }, options || {});
                    var state = findState(stateOrName, options.relative);
                    return isDefined(state) ? $state.$current !== state ? !1 : params ? equalForKeys(state.params.$$values(params), $stateParams) : !0 : undefined
                }, $state.includes = function(stateOrName, params, options) {
                    if (options = extend({
                            relative: $state.$current
                        }, options || {}), isString(stateOrName) && isGlob(stateOrName)) {
                        if (!doesStateMatchGlob(stateOrName)) return !1;
                        stateOrName = $state.$current.name
                    }
                    var state = findState(stateOrName, options.relative);
                    return isDefined(state) ? isDefined($state.$current.includes[state.name]) ? params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : !0 : !1 : undefined
                }, $state.href = function(stateOrName, params, options) {
                    options = extend({
                        lossy: !0,
                        inherit: !0,
                        absolute: !1,
                        relative: $state.$current
                    }, options || {});
                    var state = findState(stateOrName, options.relative);
                    if (!isDefined(state)) return null;
                    options.inherit && (params = inheritParams($stateParams, params || {}, $state.$current, state));
                    var nav = state && options.lossy ? state.navigable : state;
                    return nav && nav.url !== undefined && null !== nav.url ? $urlRouter.href(nav.url, filterByKeys(state.params.$$keys().concat("#"), params || {}), {
                        absolute: options.absolute
                    }) : null
                }, $state.get = function(stateOrName, context) {
                    if (0 === arguments.length) return map(objectKeys(states), function(name) {
                        return states[name].self
                    });
                    var state = findState(stateOrName, context || $state.$current);
                    return state && state.self ? state.self : null
                }, $state
            }

            function shouldSkipReload(to, toParams, from, fromParams, locals, options) {
                function nonSearchParamsEqual(fromAndToState, fromParams, toParams) {
                    function notSearchParam(key) {
                        return "search" != fromAndToState.params[key].location
                    }
                    var nonQueryParamKeys = fromAndToState.params.$$keys().filter(notSearchParam),
                        nonQueryParams = pick.apply({}, [fromAndToState.params].concat(nonQueryParamKeys)),
                        nonQueryParamSet = new $$UMFP.ParamSet(nonQueryParams);
                    return nonQueryParamSet.$$equals(fromParams, toParams)
                }
                return !options.reload && to === from && (locals === from.locals || to.self.reloadOnSearch === !1 && nonSearchParamsEqual(from, fromParams, toParams)) ? !0 : void 0
            }
            var root, $state, states = {},
                queue = {},
                abstractKey = "abstract",
                stateBuilder = {
                    parent: function(state) {
                        if (isDefined(state.parent) && state.parent) return findState(state.parent);
                        var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
                        return compositeName ? findState(compositeName[1]) : root
                    },
                    data: function(state) {
                        return state.parent && state.parent.data && (state.data = state.self.data = extend({}, state.parent.data, state.data)), state.data
                    },
                    url: function(state) {
                        var url = state.url,
                            config = {
                                params: state.params || {}
                            };
                        if (isString(url)) return "^" == url.charAt(0) ? $urlMatcherFactory.compile(url.substring(1), config) : (state.parent.navigable || root).url.concat(url, config);
                        if (!url || $urlMatcherFactory.isMatcher(url)) return url;
                        throw new Error("Invalid url '" + url + "' in state '" + state + "'")
                    },
                    navigable: function(state) {
                        return state.url ? state : state.parent ? state.parent.navigable : null
                    },
                    ownParams: function(state) {
                        var params = state.url && state.url.params || new $$UMFP.ParamSet;
                        return forEach(state.params || {}, function(config, id) {
                            params[id] || (params[id] = new $$UMFP.Param(id, null, config, "config"))
                        }), params
                    },
                    params: function(state) {
                        return state.parent && state.parent.params ? extend(state.parent.params.$$new(), state.ownParams) : new $$UMFP.ParamSet
                    },
                    views: function(state) {
                        var views = {};
                        return forEach(isDefined(state.views) ? state.views : {
                            "": state
                        }, function(view, name) {
                            name.indexOf("@") < 0 && (name += "@" + state.parent.name), views[name] = view
                        }), views
                    },
                    path: function(state) {
                        return state.parent ? state.parent.path.concat(state) : []
                    },
                    includes: function(state) {
                        var includes = state.parent ? extend({}, state.parent.includes) : {};
                        return includes[state.name] = !0, includes
                    },
                    $delegates: {}
                };
            root = registerState({
                name: "",
                url: "^",
                views: null,
                "abstract": !0
            }), root.navigable = null, this.decorator = decorator, this.state = state, this.$get = $get, $get.$inject = ["$rootScope", "$q", "$view", "$injector", "$resolve", "$stateParams", "$urlRouter", "$location", "$urlMatcherFactory"]
        }

        function $ViewProvider() {
            function $get($rootScope, $templateFactory) {
                return {
                    load: function(name, options) {
                        var result, defaults = {
                            template: null,
                            controller: null,
                            view: null,
                            locals: null,
                            notify: !0,
                            async: !0,
                            params: {}
                        };
                        return options = extend(defaults, options), options.view && (result = $templateFactory.fromConfig(options.view, options.params, options.locals)), result && options.notify && $rootScope.$broadcast("$viewContentLoading", options), result
                    }
                }
            }
            this.$get = $get, $get.$inject = ["$rootScope", "$templateFactory"]
        }

        function $ViewScrollProvider() {
            var useAnchorScroll = !1;
            this.useAnchorScroll = function() {
                useAnchorScroll = !0
            }, this.$get = ["$anchorScroll", "$timeout", function($anchorScroll, $timeout) {
                return useAnchorScroll ? $anchorScroll : function($element) {
                    return $timeout(function() {
                        $element[0].scrollIntoView()
                    }, 0, !1)
                }
            }]
        }

        function $ViewDirective($state, $injector, $uiViewScroll, $interpolate) {
            function getService() {
                return $injector.has ? function(service) {
                    return $injector.has(service) ? $injector.get(service) : null
                } : function(service) {
                    try {
                        return $injector.get(service)
                    } catch (e) {
                        return null
                    }
                }
            }

            function getRenderer(attrs, scope) {
                var statics = function() {
                    return {
                        enter: function(element, target, cb) {
                            target.after(element), cb()
                        },
                        leave: function(element, cb) {
                            element.remove(), cb()
                        }
                    }
                };
                if ($animate) return {
                    enter: function(element, target, cb) {
                        var promise = $animate.enter(element, null, target, cb);
                        promise && promise.then && promise.then(cb)
                    },
                    leave: function(element, cb) {
                        var promise = $animate.leave(element, cb);
                        promise && promise.then && promise.then(cb)
                    }
                };
                if ($animator) {
                    var animate = $animator && $animator(scope, attrs);
                    return {
                        enter: function(element, target, cb) {
                            animate.enter(element, null, target), cb()
                        },
                        leave: function(element, cb) {
                            animate.leave(element), cb()
                        }
                    }
                }
                return statics()
            }
            var service = getService(),
                $animator = service("$animator"),
                $animate = service("$animate"),
                directive = {
                    restrict: "ECA",
                    terminal: !0,
                    priority: 400,
                    transclude: "element",
                    compile: function(tElement, tAttrs, $transclude) {
                        return function(scope, $element, attrs) {
                            function cleanupLastView() {
                                previousEl && (previousEl.remove(), previousEl = null), currentScope && (currentScope.$destroy(), currentScope = null), currentEl && (renderer.leave(currentEl, function() {
                                    previousEl = null
                                }), previousEl = currentEl, currentEl = null)
                            }

                            function updateView(firstTime) {
                                var newScope, name = getUiViewName(scope, attrs, $element, $interpolate),
                                    previousLocals = name && $state.$current && $state.$current.locals[name];
                                if (firstTime || previousLocals !== latestLocals) {
                                    newScope = scope.$new(), latestLocals = $state.$current.locals[name];
                                    var clone = $transclude(newScope, function(clone) {
                                        renderer.enter(clone, $element, function() {
                                            currentScope && currentScope.$emit("$viewContentAnimationEnded"), (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) && $uiViewScroll(clone)
                                        }), cleanupLastView()
                                    });
                                    currentEl = clone, currentScope = newScope, currentScope.$emit("$viewContentLoaded"), currentScope.$eval(onloadExp)
                                }
                            }
                            var previousEl, currentEl, currentScope, latestLocals, onloadExp = attrs.onload || "",
                                autoScrollExp = attrs.autoscroll,
                                renderer = getRenderer(attrs, scope);
                            scope.$on("$stateChangeSuccess", function() {
                                updateView(!1)
                            }), scope.$on("$viewContentLoading", function() {
                                updateView(!1)
                            }), updateView(!0)
                        }
                    }
                };
            return directive
        }

        function $ViewDirectiveFill($compile, $controller, $state, $interpolate) {
            return {
                restrict: "ECA",
                priority: -400,
                compile: function(tElement) {
                    var initial = tElement.html();
                    return function(scope, $element, attrs) {
                        var current = $state.$current,
                            name = getUiViewName(scope, attrs, $element, $interpolate),
                            locals = current && current.locals[name];
                        if (locals) {
                            $element.data("$uiView", {
                                name: name,
                                state: locals.$$state
                            }), $element.html(locals.$template ? locals.$template : initial);
                            var link = $compile($element.contents());
                            if (locals.$$controller) {
                                locals.$scope = scope, locals.$element = $element;
                                var controller = $controller(locals.$$controller, locals);
                                locals.$$controllerAs && (scope[locals.$$controllerAs] = controller), $element.data("$ngControllerController", controller), $element.children().data("$ngControllerController", controller)
                            }
                            link(scope)
                        }
                    }
                }
            }
        }

        function getUiViewName(scope, attrs, element, $interpolate) {
            var name = $interpolate(attrs.uiView || attrs.name || "")(scope),
                inherited = element.inheritedData("$uiView");
            return name.indexOf("@") >= 0 ? name : name + "@" + (inherited ? inherited.state.name : "")
        }

        function parseStateRef(ref, current) {
            var parsed, preparsed = ref.match(/^\s*({[^}]*})\s*$/);
            if (preparsed && (ref = current + "(" + preparsed[1] + ")"), parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/), !parsed || 4 !== parsed.length) throw new Error("Invalid state ref '" + ref + "'");
            return {
                state: parsed[1],
                paramExpr: parsed[3] || null
            }
        }

        function stateContext(el) {
            var stateData = el.parent().inheritedData("$uiView");
            return stateData && stateData.state && stateData.state.name ? stateData.state : void 0
        }

        function $StateRefDirective($state, $timeout) {
            var allowedOptions = ["location", "inherit", "reload", "absolute"];
            return {
                restrict: "A",
                require: ["?^uiSrefActive", "?^uiSrefActiveEq"],
                link: function(scope, element, attrs, uiSrefActive) {
                    var ref = parseStateRef(attrs.uiSref, $state.current.name),
                        params = null,
                        base = stateContext(element) || $state.$current,
                        hrefKind = "[object SVGAnimatedString]" === Object.prototype.toString.call(element.prop("href")) ? "xlink:href" : "href",
                        newHref = null,
                        isAnchor = "A" === element.prop("tagName").toUpperCase(),
                        isForm = "FORM" === element[0].nodeName,
                        attr = isForm ? "action" : hrefKind,
                        nav = !0,
                        options = {
                            relative: base,
                            inherit: !0
                        },
                        optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
                    angular.forEach(allowedOptions, function(option) {
                        option in optionsOverride && (options[option] = optionsOverride[option])
                    });
                    var update = function(newVal) {
                        if (newVal && (params = angular.copy(newVal)), nav) {
                            newHref = $state.href(ref.state, params, options);
                            var activeDirective = uiSrefActive[1] || uiSrefActive[0];
                            return activeDirective && activeDirective.$$addStateInfo(ref.state, params), null === newHref ? (nav = !1, !1) : void attrs.$set(attr, newHref)
                        }
                    };
                    ref.paramExpr && (scope.$watch(ref.paramExpr, function(newVal, oldVal) {
                        newVal !== params && update(newVal)
                    }, !0), params = angular.copy(scope.$eval(ref.paramExpr))), update(), isForm || element.bind("click", function(e) {
                        var button = e.which || e.button;
                        if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr("target"))) {
                            var transition = $timeout(function() {
                                $state.go(ref.state, params, options)
                            });
                            e.preventDefault();
                            var ignorePreventDefaultCount = isAnchor && !newHref ? 1 : 0;
                            e.preventDefault = function() {
                                ignorePreventDefaultCount-- <= 0 && $timeout.cancel(transition)
                            }
                        }
                    })
                }
            }
        }

        function $StateRefActiveDirective($state, $stateParams, $interpolate) {
            return {
                restrict: "A",
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                    function update() {
                        anyMatch() ? $element.addClass(activeClass) : $element.removeClass(activeClass)
                    }

                    function anyMatch() {
                        for (var i = 0; i < states.length; i++)
                            if (isMatch(states[i].state, states[i].params)) return !0;
                        return !1
                    }

                    function isMatch(state, params) {
                        return "undefined" != typeof $attrs.uiSrefActiveEq ? $state.is(state.name, params) : $state.includes(state.name, params)
                    }
                    var activeClass, states = [];
                    activeClass = $interpolate($attrs.uiSrefActiveEq || $attrs.uiSrefActive || "", !1)($scope), this.$$addStateInfo = function(newState, newParams) {
                        var state = $state.get(newState, stateContext($element));
                        states.push({
                            state: state || {
                                name: newState
                            },
                            params: newParams
                        }), update()
                    }, $scope.$on("$stateChangeSuccess", update)
                }]
            }
        }

        function $IsStateFilter($state) {
            var isFilter = function(state) {
                return $state.is(state)
            };
            return isFilter.$stateful = !0, isFilter
        }

        function $IncludedByStateFilter($state) {
            var includesFilter = function(state) {
                return $state.includes(state)
            };
            return includesFilter.$stateful = !0, includesFilter
        }
        var isDefined = angular.isDefined,
            isFunction = angular.isFunction,
            isString = angular.isString,
            isObject = angular.isObject,
            isArray = angular.isArray,
            forEach = angular.forEach,
            extend = angular.extend,
            copy = angular.copy;
        angular.module("ui.router.util", ["ng"]), 
        angular.module("ui.router.router", ["ui.router.util"]), 
        angular.module("ui.router.state", ["ui.router.router", "ui.router.util"]), 
        angular.module("ui.router", ["ui.router.state"]), 
        angular.module("ui.router.compat", ["ui.router"]), $Resolve.$inject = ["$q", "$injector"], angular.module("ui.router.util").service("$resolve", $Resolve), $TemplateFactory.$inject = ["$http", "$templateCache", "$injector"], angular.module("ui.router.util").service("$templateFactory", $TemplateFactory);
        var $$UMFP;
        UrlMatcher.prototype.concat = function(pattern, config) {
            var defaultConfig = {
                caseInsensitive: $$UMFP.caseInsensitive(),
                strict: $$UMFP.strictMode(),
                squash: $$UMFP.defaultSquashPolicy()
            };
            return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this)
        }, UrlMatcher.prototype.toString = function() {
            return this.source
        }, UrlMatcher.prototype.exec = function(path, searchParams) {
            function decodePathArray(string) {
                function reverseString(str) {
                    return str.split("").reverse().join("")
                }

                function unquoteDashes(str) {
                    return str.replace(/\\-/g, "-")
                }
                var split = reverseString(string).split(/-(?!\\)/),
                    allReversed = map(split, reverseString);
                return map(allReversed, unquoteDashes).reverse()
            }
            var m = this.regexp.exec(path);
            if (!m) return null;
            searchParams = searchParams || {};
            var i, j, paramName, paramNames = this.parameters(),
                nTotal = paramNames.length,
                nPath = this.segments.length - 1,
                values = {};
            if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");
            for (i = 0; nPath > i; i++) {
                paramName = paramNames[i];
                var param = this.params[paramName],
                    paramVal = m[i + 1];
                for (j = 0; j < param.replace; j++) param.replace[j].from === paramVal && (paramVal = param.replace[j].to);
                paramVal && param.array === !0 && (paramVal = decodePathArray(paramVal)), values[paramName] = param.value(paramVal)
            }
            for (; nTotal > i; i++) paramName = paramNames[i], values[paramName] = this.params[paramName].value(searchParams[paramName]);
            return values
        }, UrlMatcher.prototype.parameters = function(param) {
            return isDefined(param) ? this.params[param] || null : this.$$paramNames
        }, UrlMatcher.prototype.validates = function(params) {
            return this.params.$$validates(params)
        }, UrlMatcher.prototype.format = function(values) {
            function encodeDashes(str) {
                return encodeURIComponent(str).replace(/-/g, function(c) {
                    return "%5C%" + c.charCodeAt(0).toString(16).toUpperCase()
                })
            }
            values = values || {};
            var segments = this.segments,
                params = this.parameters(),
                paramset = this.params;
            if (!this.validates(values)) return null;
            var i, search = !1,
                nPath = segments.length - 1,
                nTotal = params.length,
                result = segments[0];
            for (i = 0; nTotal > i; i++) {
                var isPathParam = nPath > i,
                    name = params[i],
                    param = paramset[name],
                    value = param.value(values[name]),
                    isDefaultValue = param.isOptional && param.type.equals(param.value(), value),
                    squash = isDefaultValue ? param.squash : !1,
                    encoded = param.type.encode(value);
                if (isPathParam) {
                    var nextSegment = segments[i + 1];
                    if (squash === !1) null != encoded && (result += isArray(encoded) ? map(encoded, encodeDashes).join("-") : encodeURIComponent(encoded)), result += nextSegment;
                    else if (squash === !0) {
                        var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
                        result += nextSegment.match(capture)[1]
                    } else isString(squash) && (result += squash + nextSegment)
                } else {
                    if (null == encoded || isDefaultValue && squash !== !1) continue;
                    isArray(encoded) || (encoded = [encoded]), encoded = map(encoded, encodeURIComponent).join("&" + name + "="), result += (search ? "&" : "?") + (name + "=" + encoded), search = !0
                }
            }
            return result
        }, Type.prototype.is = function(val, key) {
            return !0
        }, Type.prototype.encode = function(val, key) {
            return val
        }, Type.prototype.decode = function(val, key) {
            return val
        }, Type.prototype.equals = function(a, b) {
            return a == b
        }, Type.prototype.$subPattern = function() {
            var sub = this.pattern.toString();
            return sub.substr(1, sub.length - 2)
        }, Type.prototype.pattern = /.*/, Type.prototype.toString = function() {
            return "{Type:" + this.name + "}"
        }, Type.prototype.$normalize = function(val) {
            return this.is(val) ? val : this.decode(val)
        }, Type.prototype.$asArray = function(mode, isSearch) {
            function ArrayType(type, mode) {
                function bindTo(type, callbackName) {
                    return function() {
                        return type[callbackName].apply(type, arguments)
                    }
                }

                function arrayWrap(val) {
                    return isArray(val) ? val : isDefined(val) ? [val] : []
                }

                function arrayUnwrap(val) {
                    switch (val.length) {
                        case 0:
                            return undefined;
                        case 1:
                            return "auto" === mode ? val[0] : val;
                        default:
                            return val
                    }
                }

                function falsey(val) {
                    return !val
                }

                function arrayHandler(callback, allTruthyMode) {
                    return function(val) {
                        val = arrayWrap(val);
                        var result = map(val, callback);
                        return allTruthyMode === !0 ? 0 === filter(result, falsey).length : arrayUnwrap(result)
                    }
                }

                function arrayEqualsHandler(callback) {
                    return function(val1, val2) {
                        var left = arrayWrap(val1),
                            right = arrayWrap(val2);
                        if (left.length !== right.length) return !1;
                        for (var i = 0; i < left.length; i++)
                            if (!callback(left[i], right[i])) return !1;
                        return !0
                    }
                }
                this.encode = arrayHandler(bindTo(type, "encode")), this.decode = arrayHandler(bindTo(type, "decode")), this.is = arrayHandler(bindTo(type, "is"), !0), this.equals = arrayEqualsHandler(bindTo(type, "equals")), this.pattern = type.pattern, this.$normalize = arrayHandler(bindTo(type, "$normalize")), this.name = type.name, this.$arrayMode = mode
            }
            if (!mode) return this;
            if ("auto" === mode && !isSearch) throw new Error("'auto' array mode is for query parameters only");
            return new ArrayType(this, mode)
        }, angular.module("ui.router.util").provider("$urlMatcherFactory", $UrlMatcherFactory),
         angular.module("ui.router.util").run(["$urlMatcherFactory", function($urlMatcherFactory) {}]), 
         $UrlRouterProvider.$inject = ["$locationProvider", "$urlMatcherFactoryProvider"], 
         angular.module("ui.router.router").provider("$urlRouter", $UrlRouterProvider), 
         $StateProvider.$inject = ["$urlRouterProvider", "$urlMatcherFactoryProvider"], 
         angular.module("ui.router.state").value("$stateParams", {}).provider("$state", $StateProvider), $ViewProvider.$inject = [], angular.module("ui.router.state").provider("$view", $ViewProvider), angular.module("ui.router.state").provider("$uiViewScroll", $ViewScrollProvider), $ViewDirective.$inject = ["$state", "$injector", "$uiViewScroll", "$interpolate"], $ViewDirectiveFill.$inject = ["$compile", "$controller", "$state", "$interpolate"], angular.module("ui.router.state").directive("uiView", $ViewDirective), angular.module("ui.router.state").directive("uiView", $ViewDirectiveFill), $StateRefDirective.$inject = ["$state", "$timeout"], $StateRefActiveDirective.$inject = ["$state", "$stateParams", "$interpolate"], angular.module("ui.router.state").directive("uiSref", $StateRefDirective).directive("uiSrefActive", $StateRefActiveDirective).directive("uiSrefActiveEq", $StateRefActiveDirective), $IsStateFilter.$inject = ["$state"], $IncludedByStateFilter.$inject = ["$state"], 
         angular.module("ui.router.state").filter("isState", $IsStateFilter).filter("includedByState", $IncludedByStateFilter)
    }(window, window.angular);