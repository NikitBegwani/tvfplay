var ngFileUpload = angular.module("ngFileUpload", []);
ngFileUpload.version = "9.0.19", 
ngFileUpload.service("UploadBase", ["$http", "$q", "$timeout", function($http, $q, $timeout) {
        function sendHttp(config) {
            function notifyProgress(e) {
                deferred.notify && deferred.notify(e), promise.progressFunc && $timeout(function() {
                    promise.progressFunc(e)
                })
            }

            function getNotifyEvent(n) {
                return null != config._start && resumeSupported ? {
                    loaded: n.loaded + config._start,
                    total: config._file.size,
                    type: n.type,
                    config: config,
                    lengthComputable: !0,
                    target: n.target
                } : n
            }

            function uploadWithAngular() {
                $http(config).then(function(r) {
                    resumeSupported && config._chunkSize && !config._finished ? (notifyProgress({
                        loaded: config._end,
                        total: config._file.size,
                        config: config,
                        type: "progress"
                    }), upload.upload(config)) : (config._finished && delete config._finished, deferred.resolve(r))
                }, function(e) {
                    deferred.reject(e)
                }, function(n) {
                    deferred.notify(n)
                })
            }
            config.method = config.method || "POST", config.headers = config.headers || {};
            var deferred = config._deferred = config._deferred || $q.defer(),
                promise = deferred.promise;
            return config.disableProgress || (config.headers.__setXHR_ = function() {
                return function(xhr) {
                    xhr && xhr instanceof XMLHttpRequest && (config.__XHR = xhr, config.xhrFn && config.xhrFn(xhr), xhr.upload.addEventListener("progress", function(e) {
                        e.config = config, notifyProgress(getNotifyEvent(e))
                    }, !1), xhr.upload.addEventListener("load", function(e) {
                        e.lengthComputable && (e.config = config, notifyProgress(getNotifyEvent(e)))
                    }, !1))
                }
            }), resumeSupported ? config._chunkSize && config._end && !config._finished ? (config._start = config._end, config._end += config._chunkSize, uploadWithAngular()) : config.resumeSizeUrl ? $http.get(config.resumeSizeUrl).then(function(resp) {
                config.resumeSizeResponseReader ? config._start = config.resumeSizeResponseReader(resp.data) : config._start = parseInt((null == resp.data.size ? resp.data : resp.data.size).toString()), config._chunkSize && (config._end = config._start + config._chunkSize), uploadWithAngular()
            }, function(e) {
                throw e
            }) : config.resumeSize ? config.resumeSize().then(function(size) {
                config._start = size, uploadWithAngular()
            }, function(e) {
                throw e
            }) : uploadWithAngular() : uploadWithAngular(), promise.success = function(fn) {
                return promise.then(function(response) {
                    fn(response.data, response.status, response.headers, config)
                }), promise
            }, promise.error = function(fn) {
                return promise.then(null, function(response) {
                    fn(response.data, response.status, response.headers, config)
                }), promise
            }, promise.progress = function(fn) {
                return promise.progressFunc = fn, promise.then(null, null, function(n) {
                    fn(n)
                }), promise
            }, promise.abort = promise.pause = function() {
                return config.__XHR && $timeout(function() {
                    config.__XHR.abort()
                }), promise
            }, promise.xhr = function(fn) {
                return config.xhrFn = function(origXhrFn) {
                    return function() {
                        origXhrFn && origXhrFn.apply(promise, arguments), fn.apply(promise, arguments)
                    }
                }(config.xhrFn), promise
            }, promise
        }
        var upload = this;
        this.isResumeSupported = function() {
            return window.Blob && Blob instanceof Function && (new Blob).slice
        };
        var resumeSupported = this.isResumeSupported();
        this.rename = function(file, name) {
            return file.ngfName = name, file
        }, this.jsonBlob = function(val) {
            null == val || angular.isString(val) || (val = JSON.stringify(val));
            var blob = new Blob([val], {
                type: "application/json"
            });
            return blob._ngfBlob = !0, blob
        }, this.json = function(val) {
            return angular.toJson(val)
        }, this.upload = function(config) {
            function isFile(file) {
                return null != file && (file instanceof Blob || file.flashId && file.name && file.size)
            }

            function toResumeFile(file, formData) {
                if (file._ngfBlob) return file;
                if (config._file = config._file || file, null != config._start && resumeSupported) {
                    config._end && config._end >= file.size && (config._finished = !0, config._end = file.size);
                    var slice = file.slice(config._start, config._end || file.size);
                    return slice.name = file.name, slice.ngfName = file.ngfName, config._chunkSize && (formData.append("_chunkSize", config._end - config._start), formData.append("_chunkNumber", Math.floor(config._start / config._chunkSize)), formData.append("_totalSize", config._file.size)), slice
                }
                return file
            }

            function addFieldToFormData(formData, val, key) {
                if (void 0 !== val)
                    if (angular.isDate(val) && (val = val.toISOString()), angular.isString(val)) formData.append(key, val);
                    else if (isFile(val)) {
                    var file = toResumeFile(val, formData),
                        split = key.split(",");
                    split[1] && (file.ngfName = split[1].replace(/^\s+|\s+$/g, ""), key = split[0]), config._fileKey = config._fileKey || key, formData.append(key, file, file.ngfName || file.name)
                } else if (angular.isObject(val)) {
                    if (val.$$ngfCircularDetection) throw "ngFileUpload: Circular reference in config.data. Make sure specified data for Upload.upload() has no circular reference: " + key;
                    val.$$ngfCircularDetection = !0;
                    try {
                        for (var k in val)
                            if (val.hasOwnProperty(k) && "$$ngfCircularDetection" !== k) {
                                var objectKey = null == config.objectKey ? "[i]" : config.objectKey;
                                val.length && parseInt(k) > -1 && (objectKey = null == config.arrayKey ? objectKey : config.arrayKey), addFieldToFormData(formData, val[k], key + objectKey.replace(/[ik]/g, k))
                            }
                    } finally {
                        delete val.$$ngfCircularDetection
                    }
                } else formData.append(key, val)
            }

            function digestConfig() {
                config._chunkSize = upload.translateScalars(config.resumeChunkSize), config._chunkSize = config._chunkSize ? parseInt(config._chunkSize.toString()) : null, config.headers = config.headers || {}, config.headers["Content-Type"] = void 0, config.transformRequest = config.transformRequest ? angular.isArray(config.transformRequest) ? config.transformRequest : [config.transformRequest] : [], config.transformRequest.push(function(data) {
                    var key, formData = new FormData;
                    data = data || config.fields || {}, config.file && (data.file = config.file);
                    for (key in data)
                        if (data.hasOwnProperty(key)) {
                            var val = data[key];
                            config.formDataAppender ? config.formDataAppender(formData, key, val) : addFieldToFormData(formData, val, key)
                        }
                    return formData
                })
            }
            return config._isDigested || (config._isDigested = !0, digestConfig()), sendHttp(config)
        }, this.http = function(config) {
            return config.transformRequest = config.transformRequest || function(data) {
                return window.ArrayBuffer && data instanceof window.ArrayBuffer || data instanceof Blob ? data : $http.defaults.transformRequest[0].apply(this, arguments)
            }, config._chunkSize = upload.translateScalars(config.resumeChunkSize), config._chunkSize = config._chunkSize ? parseInt(config._chunkSize.toString()) : null, sendHttp(config)
        }, this.translateScalars = function(str) {
            if (angular.isString(str)) {
                if (str.search(/kb/i) === str.length - 2) return parseFloat(1e3 * str.substring(0, str.length - 2));
                if (str.search(/mb/i) === str.length - 2) return parseFloat(1e6 * str.substring(0, str.length - 2));
                if (str.search(/gb/i) === str.length - 2) return parseFloat(1e9 * str.substring(0, str.length - 2));
                if (str.search(/b/i) === str.length - 1) return parseFloat(str.substring(0, str.length - 1));
                if (str.search(/s/i) === str.length - 1) return parseFloat(str.substring(0, str.length - 1));
                if (str.search(/m/i) === str.length - 1) return parseFloat(60 * str.substring(0, str.length - 1));
                if (str.search(/h/i) === str.length - 1) return parseFloat(3600 * str.substring(0, str.length - 1))
            }
            return str
        }, this.setDefaults = function(defaults) {
            this.defaults = defaults || {}
        }, this.defaults = {}, this.version = ngFileUpload.version
    }]), ngFileUpload.service("Upload", ["$parse", "$timeout", "$compile", "UploadResize", function($parse, $timeout, $compile, UploadResize) {
        function resize(files, attr, scope, callback) {
            var param = upload.attrGetter("ngfResize", attr, scope);
            if (!param || !upload.isResizeSupported() || !files.length) return callback();
            if (!param.width || !param.height) throw "width and height are mandatory for ngf-resize";
            for (var count = files.length, checkCallback = function() {
                    count--, 0 === count && callback()
                }, success = function(index) {
                    return function(resizedFile) {
                        files.splice(index, 1, resizedFile), checkCallback()
                    }
                }, error = function(f) {
                    return function(e) {
                        checkCallback(), f.$error = "resize", f.$errorParam = (e ? (e.message ? e.message : e) + ": " : "") + (f && f.name)
                    }
                }, i = 0; i < files.length; i++) {
                var f = files[i];
                0 === f.type.indexOf("image") ? upload.resize(f, param.width, param.height, param.quality).then(success(i), error(f)) : checkCallback()
            }
        }

        function handleKeep(files, prevFiles, attr, scope) {
            var dupFiles = [],
                keep = upload.attrGetter("ngfKeep", attr, scope);
            if (keep) {
                var hasNew = !1;
                if ("distinct" === keep || upload.attrGetter("ngfKeepDistinct", attr, scope) === !0) {
                    var len = prevFiles.length;
                    if (files)
                        for (var i = 0; i < files.length; i++) {
                            for (var j = 0; len > j; j++)
                                if (files[i].name === prevFiles[j].name) {
                                    dupFiles.push(files[i]);
                                    break
                                }
                            j === len && (prevFiles.push(files[i]), hasNew = !0)
                        }
                    files = prevFiles
                } else files = prevFiles.concat(files || [])
            }
            return {
                files: files,
                dupFiles: dupFiles,
                keep: keep
            }
        }
        var upload = UploadResize;
        return upload.getAttrWithDefaults = function(attr, name) {
            if (null != attr[name]) return attr[name];
            var def = upload.defaults[name];
            return null == def ? def : angular.isString(def) ? def : JSON.stringify(def)
        }, upload.attrGetter = function(name, attr, scope, params) {
            var attrVal = this.getAttrWithDefaults(attr, name);
            if (!scope) return attrVal;
            try {
                return params ? $parse(attrVal)(scope, params) : $parse(attrVal)(scope)
            } catch (e) {
                if (name.search(/min|max|pattern/i)) return attrVal;
                throw e
            }
        }, upload.shouldUpdateOn = function(type, attr, scope) {
            var modelOptions = upload.attrGetter("ngModelOptions", attr, scope);
            return modelOptions && modelOptions.updateOn ? modelOptions.updateOn.split(" ").indexOf(type) > -1 : !0
        }, upload.updateModel = function(ngModel, attr, scope, fileChange, files, evt, noDelay) {
            function update(files, invalidFiles, newFiles, dupFiles, isSingleModel) {
                var file = files && files.length ? files[0] : null;
                ngModel && (upload.applyModelValidation(ngModel, files), ngModel.$ngfModelChange = !0, ngModel.$setViewValue(isSingleModel ? file : files)), fileChange && $parse(fileChange)(scope, {
                    $files: files,
                    $file: file,
                    $newFiles: newFiles,
                    $duplicateFiles: dupFiles,
                    $invalidFiles: invalidFiles,
                    $event: evt
                });
                var invalidModel = upload.attrGetter("ngfModelInvalid", attr);
                invalidModel && $timeout(function() {
                    $parse(invalidModel).assign(scope, invalidFiles)
                }), $timeout(function() {})
            }
            var newFiles = files,
                prevFiles = (ngModel && ngModel.$modelValue || attr.$$ngfPrevFiles || []).slice(0),
                keepResult = handleKeep(files, prevFiles, attr, scope);
            files = keepResult.files;
            var dupFiles = keepResult.dupFiles,
                isSingleModel = !upload.attrGetter("ngfMultiple", attr, scope) && !upload.attrGetter("multiple", attr) && !keepResult.keep;
            if (attr.$$ngfPrevFiles = files, !keepResult.keep || newFiles && newFiles.length) {
                upload.validate(newFiles, ngModel, attr, scope, function() {
                    if (noDelay) update(files, [], newFiles, dupFiles, isSingleModel);
                    else {
                        var options = upload.attrGetter("ngModelOptions", attr, scope);
                        if (!options || !options.allowInvalid) {
                            var valids = [],
                                invalids = [];
                            angular.forEach(files, function(file) {
                                file.$error ? invalids.push(file) : valids.push(file)
                            }), files = valids
                        }
                        resize(files, attr, scope, function() {
                            $timeout(function() {
                                update(files, invalids, newFiles, dupFiles, isSingleModel)
                            }, options && options.debounce ? options.debounce.change || options.debounce : 0)
                        })
                    }
                });
                for (var l = prevFiles.length; l--;) {
                    var prevFile = prevFiles[l];
                    window.URL && prevFile.blobUrl && (URL.revokeObjectURL(prevFile.blobUrl), delete prevFile.blobUrl)
                }
            }
        }, upload
    }]), ngFileUpload.directive("ngfSelect", ["$parse", "$timeout", "$compile", "Upload", function($parse, $timeout, $compile, Upload) {
        function isDelayedClickSupported(ua) {
            var m = ua.match(/Android[^\d]*(\d+)\.(\d+)/);
            if (m && m.length > 2) {
                var v = Upload.defaults.androidFixMinorVersion || 4;
                return parseInt(m[1]) < 4 || parseInt(m[1]) === v && parseInt(m[2]) < v
            }
            return -1 === ua.indexOf("Chrome") && /.*Windows.*Safari.*/.test(ua)
        }

        function linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, upload) {
            function isInputTypeFile() {
                return "input" === elem[0].tagName.toLowerCase() && attr.type && "file" === attr.type.toLowerCase()
            }

            function fileChangeAttr() {
                return attrGetter("ngfChange") || attrGetter("ngfSelect")
            }

            function changeFn(evt) {
                if (upload.shouldUpdateOn("change", attr, scope)) {
                    for (var fileList = evt.__files_ || evt.target && evt.target.files, files = [], i = 0; i < fileList.length; i++) files.push(fileList[i]);
                    upload.updateModel(ngModel, attr, scope, fileChangeAttr(), files.length ? files : null, evt)
                }
            }

            function bindAttrToFileInput(fileElem) {
                if (elem !== fileElem)
                    for (var i = 0; i < elem[0].attributes.length; i++) {
                        var attribute = elem[0].attributes[i];
                        "type" !== attribute.name && "class" !== attribute.name && "id" !== attribute.name && "style" !== attribute.name && (null != attribute.value && "" !== attribute.value || ("required" === attribute.name && (attribute.value = "required"), "multiple" === attribute.name && (attribute.value = "multiple")), fileElem.attr(attribute.name, attribute.value))
                    }
            }

            function createFileInput() {
                if (isInputTypeFile()) return elem;
                var fileElem = angular.element('<input type="file">');
                return bindAttrToFileInput(fileElem), fileElem.css("visibility", "hidden").css("position", "absolute").css("overflow", "hidden").css("width", "0px").css("height", "0px").css("border", "none").css("margin", "0px").css("padding", "0px").attr("tabindex", "-1"), generatedElems.push({
                    el: elem,
                    ref: fileElem
                }), document.body.appendChild(fileElem[0]), fileElem
            }

            function clickHandler(evt) {
                if (elem.attr("disabled") || attrGetter("ngfSelectDisabled", scope)) return !1;
                var r = handleTouch(evt);
                if (null != r) return r;
                resetModel(evt);
                try {
                    isInputTypeFile() || document.body.contains(fileElem[0]) || (generatedElems.push({
                        el: elem,
                        ref: fileElem
                    }), document.body.appendChild(fileElem[0]), fileElem.bind("change", changeFn))
                } catch (e) {}
                return isDelayedClickSupported(navigator.userAgent) ? setTimeout(function() {
                    fileElem[0].click()
                }, 0) : fileElem[0].click(), !1
            }

            function handleTouch(evt) {
                var touches = evt.changedTouches || evt.originalEvent && evt.originalEvent.changedTouches;
                if ("touchstart" === evt.type) return initialTouchStartY = touches ? touches[0].clientY : 0, !0;
                if (evt.stopPropagation(), evt.preventDefault(), "touchend" === evt.type) {
                    var currentLocation = touches ? touches[0].clientY : 0;
                    if (Math.abs(currentLocation - initialTouchStartY) > 20) return !1
                }
            }

            function resetModel(evt) {
                upload.shouldUpdateOn("click", attr, scope) && fileElem.val() && (fileElem.val(null), upload.updateModel(ngModel, attr, scope, fileChangeAttr(), null, evt, !0))
            }

            function ie10SameFileSelectFix(evt) {
                if (fileElem && !fileElem.attr("__ngf_ie10_Fix_")) {
                    if (!fileElem[0].parentNode) return void(fileElem = null);
                    evt.preventDefault(), evt.stopPropagation(), fileElem.unbind("click");
                    var clone = fileElem.clone();
                    return fileElem.replaceWith(clone), fileElem = clone, fileElem.attr("__ngf_ie10_Fix_", "true"), fileElem.bind("change", changeFn), fileElem.bind("click", ie10SameFileSelectFix), fileElem[0].click(), !1
                }
                fileElem.removeAttr("__ngf_ie10_Fix_")
            }
            var attrGetter = function(name, scope) {
                return upload.attrGetter(name, attr, scope)
            };
            upload.registerModelChangeValidator(ngModel, attr, scope);
            var unwatches = [];
            unwatches.push(scope.$watch(attrGetter("ngfMultiple"), function() {
                fileElem.attr("multiple", attrGetter("ngfMultiple", scope))
            })), unwatches.push(scope.$watch(attrGetter("ngfCapture"), function() {
                fileElem.attr("capture", attrGetter("ngfCapture", scope))
            })), attr.$observe("accept", function() {
                fileElem.attr("accept", attrGetter("accept"))
            }), unwatches.push(function() {
                attr.$$observers && delete attr.$$observers.accept
            });
            var initialTouchStartY = 0,
                fileElem = elem;
            isInputTypeFile() || (fileElem = createFileInput()), fileElem.bind("change", changeFn), isInputTypeFile() ? elem.bind("click", resetModel) : elem.bind("click touchstart touchend", clickHandler), -1 !== navigator.appVersion.indexOf("MSIE 10") && fileElem.bind("click", ie10SameFileSelectFix), ngModel && ngModel.$formatters.push(function(val) {
                return null != val && 0 !== val.length || fileElem.val() && fileElem.val(null), val
            }), scope.$on("$destroy", function() {
                isInputTypeFile() || fileElem.remove(), angular.forEach(unwatches, function(unwatch) {
                    unwatch()
                })
            }), $timeout(function() {
                for (var i = 0; i < generatedElems.length; i++) {
                    var g = generatedElems[i];
                    document.body.contains(g.el[0]) || (generatedElems.splice(i, 1), g.ref.remove())
                }
            }), window.FileAPI && window.FileAPI.ngfFixIE && window.FileAPI.ngfFixIE(elem, fileElem, changeFn)
        }
        var generatedElems = [];
        return {
            restrict: "AEC",
            require: "?ngModel",
            link: function(scope, elem, attr, ngModel) {
                linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, Upload)
            }
        }
    }]),
    function() {
        function getTagType(el) {
            return "img" === el.tagName.toLowerCase() ? "image" : "audio" === el.tagName.toLowerCase() ? "audio" : "video" === el.tagName.toLowerCase() ? "video" : /./
        }

        function linkFileDirective(Upload, $timeout, scope, elem, attr, directiveName, resizeParams, isBackground) {
            function constructDataUrl(file) {
                var disallowObjectUrl = Upload.attrGetter("ngfNoObjectUrl", attr, scope);
                Upload.dataUrl(file, disallowObjectUrl)["finally"](function() {
                    $timeout(function() {
                        var src = (disallowObjectUrl ? file.$ngfDataUrl : file.$ngfBlobUrl) || file.$ngfDataUrl;
                        isBackground ? elem.css("background-image", "url('" + (src || "") + "')") : elem.attr("src", src), src ? elem.removeClass("ngf-hide") : elem.addClass("ngf-hide")
                    })
                })
            }
            $timeout(function() {
                var unwatch = scope.$watch(attr[directiveName], function(file) {
                    var size = resizeParams;
                    if ("ngfThumbnail" === directiveName && (size || (size = {
                            width: elem[0].clientWidth,
                            height: elem[0].clientHeight
                        }), 0 === size.width && window.getComputedStyle)) {
                        var style = getComputedStyle(elem[0]);
                        size = {
                            width: parseInt(style.width.slice(0, -2)),
                            height: parseInt(style.height.slice(0, -2))
                        }
                    }
                    return angular.isString(file) ? (elem.removeClass("ngf-hide"), isBackground ? elem.css("background-image", "url('" + file + "')") : elem.attr("src", file)) : void(!file || !file.type || 0 !== file.type.search(getTagType(elem[0])) || isBackground && 0 !== file.type.indexOf("image") ? elem.addClass("ngf-hide") : size && Upload.isResizeSupported() ? Upload.resize(file, size.width, size.height, size.quality).then(function(f) {
                        constructDataUrl(f)
                    }, function(e) {
                        throw e
                    }) : constructDataUrl(file))
                });
                scope.$on("$destroy", function() {
                    unwatch()
                })
            })
        }
        ngFileUpload.service("UploadDataUrl", ["UploadBase", "$timeout", "$q", function(UploadBase, $timeout, $q) {
            var upload = UploadBase;
            return upload.base64DataUrl = function(file) {
                if (angular.isArray(file)) {
                    var d = $q.defer(),
                        count = 0;
                    return angular.forEach(file, function(f) {
                        upload.dataUrl(f, !0)["finally"](function() {
                            if (count++, count === file.length) {
                                var urls = [];
                                angular.forEach(file, function(ff) {
                                    urls.push(ff.$ngfDataUrl)
                                }), d.resolve(urls, file)
                            }
                        })
                    }), d.promise
                }
                return upload.dataUrl(file, !0)
            }, upload.dataUrl = function(file, disallowObjectUrl) {
                if (disallowObjectUrl && null != file.$ngfDataUrl || !disallowObjectUrl && null != file.$ngfBlobUrl) {
                    var d = $q.defer();
                    return $timeout(function() {
                        d.resolve(disallowObjectUrl ? file.$ngfDataUrl : file.$ngfBlobUrl, file)
                    }), d.promise
                }
                var p = disallowObjectUrl ? file.$$ngfDataUrlPromise : file.$$ngfBlobUrlPromise;
                if (p) return p;
                var deferred = $q.defer();
                return $timeout(function() {
                    if (window.FileReader && file && (!window.FileAPI || -1 === navigator.userAgent.indexOf("MSIE 8") || file.size < 2e4) && (!window.FileAPI || -1 === navigator.userAgent.indexOf("MSIE 9") || file.size < 4e6)) {
                        var URL = window.URL || window.webkitURL;
                        if (URL && URL.createObjectURL && !disallowObjectUrl) {
                            var url;
                            try {
                                url = URL.createObjectURL(file)
                            } catch (e) {
                                return void $timeout(function() {
                                    file.$ngfBlobUrl = "", deferred.reject()
                                })
                            }
                            $timeout(function() {
                                file.$ngfBlobUrl = url, url && deferred.resolve(url, file)
                            })
                        } else {
                            var fileReader = new FileReader;
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.$ngfDataUrl = e.target.result, deferred.resolve(e.target.result, file)
                                })
                            }, fileReader.onerror = function() {
                                $timeout(function() {
                                    file.$ngfDataUrl = "", deferred.reject()
                                })
                            }, fileReader.readAsDataURL(file)
                        }
                    } else $timeout(function() {
                        file[disallowObjectUrl ? "dataUrl" : "blobUrl"] = "", deferred.reject()
                    })
                }), p = disallowObjectUrl ? file.$$ngfDataUrlPromise = deferred.promise : file.$$ngfBlobUrlPromise = deferred.promise, p["finally"](function() {
                    delete file[disallowObjectUrl ? "$$ngfDataUrlPromise" : "$$ngfBlobUrlPromise"]
                }), p
            }, upload
        }]);
        var style = angular.element("<style>.ngf-hide{display:none !important}</style>");
        document.getElementsByTagName("head")[0].appendChild(style[0]), 
        ngFileUpload.directive("ngfSrc", ["Upload", "$timeout", function(Upload, $timeout) {
            return {
                restrict: "AE",
                link: function(scope, elem, attr) {
                    linkFileDirective(Upload, $timeout, scope, elem, attr, "ngfSrc", Upload.attrGetter("ngfResize", attr, scope), !1)
                }
            }
        }]), 
        ngFileUpload.directive("ngfBackground", ["Upload", "$timeout", function(Upload, $timeout) {
            return {
                restrict: "AE",
                link: function(scope, elem, attr) {
                    linkFileDirective(Upload, $timeout, scope, elem, attr, "ngfBackground", Upload.attrGetter("ngfResize", attr, scope), !0)
                }
            }
        }]), 
        ngFileUpload.directive("ngfThumbnail", ["Upload", "$timeout", function(Upload, $timeout) {
            return {
                restrict: "AE",
                link: function(scope, elem, attr) {
                    var size = Upload.attrGetter("ngfSize", attr, scope);
                    linkFileDirective(Upload, $timeout, scope, elem, attr, "ngfThumbnail", size, Upload.attrGetter("ngfAsBackground", attr, scope))
                }
            }
        }]), 
        ngFileUpload.config(["$compileProvider", function($compileProvider) {
            $compileProvider.imgSrcSanitizationWhitelist && $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/), $compileProvider.aHrefSanitizationWhitelist && $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/)
        }]),
        ngFileUpload.filter("ngfDataUrl", ["UploadDataUrl", "$sce", function(UploadDataUrl, $sce) {
            return function(file, disallowObjectUrl, trustedUrl) {
                if (angular.isString(file)) return $sce.trustAsResourceUrl(file);
                var src = file && ((disallowObjectUrl ? file.$ngfDataUrl : file.$ngfBlobUrl) || file.$ngfDataUrl);
                return file && !src ? (!file.$ngfDataUrlFilterInProgress && angular.isObject(file) && (file.$ngfDataUrlFilterInProgress = !0, UploadDataUrl.dataUrl(file, disallowObjectUrl)), "") : (file && delete file.$ngfDataUrlFilterInProgress, (file && src ? trustedUrl ? $sce.trustAsResourceUrl(src) : src : file) || "")
            }
        }])
    }(), 
    ngFileUpload.service("UploadValidate", ["UploadDataUrl", "$q", "$timeout", function(UploadDataUrl, $q, $timeout) {
        function globStringToRegex(str) {
            var regexp = "",
                excludes = [];
            if (str.length > 2 && "/" === str[0] && "/" === str[str.length - 1]) regexp = str.substring(1, str.length - 1);
            else {
                var split = str.split(",");
                if (split.length > 1)
                    for (var i = 0; i < split.length; i++) {
                        var r = globStringToRegex(split[i]);
                        r.regexp ? (regexp += "(" + r.regexp + ")", i < split.length - 1 && (regexp += "|")) : excludes = excludes.concat(r.excludes)
                    } else 0 === str.indexOf("!") ? excludes.push("^((?!" + globStringToRegex(str.substring(1)).regexp + ").)*$") : (0 === str.indexOf(".") && (str = "*" + str), regexp = "^" + str.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]", "g"), "\\$&") + "$", regexp = regexp.replace(/\\\*/g, ".*").replace(/\\\?/g, "."))
            }
            return {
                regexp: regexp,
                excludes: excludes
            }
        }

        function markModelAsDirty(ngModel, files) {
            null == files || ngModel.$dirty || (ngModel.$setDirty ? ngModel.$setDirty() : ngModel.$dirty = !0)
        }
        var upload = UploadDataUrl;
        return upload.validatePattern = function(file, val) {
            if (!val) return !0;
            var pattern = globStringToRegex(val),
                valid = !0;
            if (pattern.regexp && pattern.regexp.length) {
                var regexp = new RegExp(pattern.regexp, "i");
                valid = null != file.type && regexp.test(file.type) || null != file.name && regexp.test(file.name)
            }
            for (var len = pattern.excludes.length; len--;) {
                var exclude = new RegExp(pattern.excludes[len], "i");
                valid = valid && (null == file.type || exclude.test(file.type)) && (null == file.name || exclude.test(file.name))
            }
            return valid
        }, upload.registerModelChangeValidator = function(ngModel, attr, scope) {
            ngModel && ngModel.$formatters.push(function(files) {
                ngModel.$ngfModelChange ? ngModel.$ngfModelChange = !1 : upload.validate(files, ngModel, attr, scope, function() {
                    upload.applyModelValidation(ngModel, files)
                })
            })
        }, upload.applyModelValidation = function(ngModel, files) {
            markModelAsDirty(ngModel, files), angular.forEach(ngModel.$ngfValidations, function(validation) {
                ngModel.$setValidity(validation.name, validation.valid)
            })
        }, upload.validate = function(files, ngModel, attr, scope, callback) {
            function validateSync(name, validatorVal, fn) {
                if (files) {
                    for (var dName = "ngf" + name[0].toUpperCase() + name.substr(1), i = files.length, valid = null; i--;) {
                        var file = files[i],
                            val = attrGetter(dName, {
                                $file: file
                            });
                        null == val && (val = validatorVal(attrGetter("ngfValidate") || {}), valid = null == valid ? !0 : valid), null != val && (fn(file, val) || (file.$error = name, file.$errorParam = val, files.splice(i, 1), valid = !1))
                    }
                    null !== valid && ngModel.$ngfValidations.push({
                        name: name,
                        valid: valid
                    })
                }
            }

            function validateAsync(name, validatorVal, type, asyncFn, fn) {
                if (files) {
                    var thisPendings = 0,
                        hasError = !1,
                        dName = "ngf" + name[0].toUpperCase() + name.substr(1);
                    files = void 0 === files.length ? [files] : files, angular.forEach(files, function(file) {
                        if (type && (null == file.type || 0 !== file.type.search(type))) return !0;
                        var val = attrGetter(dName, {
                            $file: file
                        }) || validatorVal(attrGetter("ngfValidate", {
                            $file: file
                        }) || {});
                        val && (pendings++, thisPendings++, asyncFn(file, val).then(function(d) {
                            fn(d, val) || (file.$error = name, file.$errorParam = val, hasError = !0)
                        }, function() {
                            attrGetter("ngfValidateForce", {
                                $file: file
                            }) && (file.$error = name, file.$errorParam = val, hasError = !0)
                        })["finally"](function() {
                            pendings--, thisPendings--, thisPendings || ngModel.$ngfValidations.push({
                                name: name,
                                valid: !hasError
                            }), pendings || callback.call(ngModel, ngModel.$ngfValidations)
                        }))
                    })
                }
            }
            ngModel = ngModel || {}, ngModel.$ngfValidations = ngModel.$ngfValidations || [], angular.forEach(ngModel.$ngfValidations, function(v) {
                v.valid = !0
            });
            var attrGetter = function(name, params) {
                return upload.attrGetter(name, attr, scope, params)
            };
            if (null == files || 0 === files.length) return void callback.call(ngModel);
            if (files = void 0 === files.length ? [files] : files.slice(0), validateSync("pattern", function(cons) {
                    return cons.pattern
                }, upload.validatePattern), validateSync("minSize", function(cons) {
                    return cons.size && cons.size.min
                }, function(file, val) {
                    return file.size >= upload.translateScalars(val)
                }), validateSync("maxSize", function(cons) {
                    return cons.size && cons.size.max
                }, function(file, val) {
                    return file.size <= upload.translateScalars(val)
                }), validateSync("validateFn", function() {
                    return null
                }, function(file, r) {
                    return r === !0 || null === r || "" === r
                }), !files.length) return void callback.call(ngModel, ngModel.$ngfValidations);
            var pendings = 0;
            validateAsync("maxHeight", function(cons) {
                return cons.height && cons.height.max
            }, /image/, this.imageDimensions, function(d, val) {
                return d.height <= val
            }), validateAsync("minHeight", function(cons) {
                return cons.height && cons.height.min
            }, /image/, this.imageDimensions, function(d, val) {
                return d.height >= val
            }), validateAsync("maxWidth", function(cons) {
                return cons.width && cons.width.max
            }, /image/, this.imageDimensions, function(d, val) {
                return d.width <= val
            }), validateAsync("minWidth", function(cons) {
                return cons.width && cons.width.min
            }, /image/, this.imageDimensions, function(d, val) {
                return d.width >= val
            }), validateAsync("ratio", function(cons) {
                return cons.ratio
            }, /image/, this.imageDimensions, function(d, val) {
                for (var split = val.toString().split(","), valid = !1, i = 0; i < split.length; i++) {
                    var r = split[i],
                        xIndex = r.search(/x/i);
                    r = xIndex > -1 ? parseFloat(r.substring(0, xIndex)) / parseFloat(r.substring(xIndex + 1)) : parseFloat(r), Math.abs(d.width / d.height - r) < 1e-4 && (valid = !0)
                }
                return valid
            }), validateAsync("maxDuration", function(cons) {
                return cons.duration && cons.duration.max
            }, /audio|video/, this.mediaDuration, function(d, val) {
                return d <= upload.translateScalars(val)
            }), validateAsync("minDuration", function(cons) {
                return cons.duration && cons.duration.min
            }, /audio|video/, this.mediaDuration, function(d, val) {
                return d >= upload.translateScalars(val)
            }), validateAsync("validateAsyncFn", function() {
                return null
            }, null, function(file, val) {
                return val
            }, function(r) {
                return r === !0 || null === r || "" === r
            }), pendings || callback.call(ngModel, ngModel.$ngfValidations)
        }, upload.imageDimensions = function(file) {
            if (file.$ngfWidth && file.$ngfHeight) {
                var d = $q.defer();
                return $timeout(function() {
                    d.resolve({
                        width: file.$ngfWidth,
                        height: file.$ngfHeight
                    })
                }), d.promise
            }
            if (file.$ngfDimensionPromise) return file.$ngfDimensionPromise;
            var deferred = $q.defer();
            return $timeout(function() {
                return 0 !== file.type.indexOf("image") ? void deferred.reject("not image") : void upload.dataUrl(file).then(function(dataUrl) {
                    function success() {
                        var width = img[0].clientWidth,
                            height = img[0].clientHeight;
                        img.remove(), file.$ngfWidth = width, file.$ngfHeight = height, deferred.resolve({
                            width: width,
                            height: height
                        })
                    }

                    function error() {
                        img.remove(), deferred.reject("load error")
                    }

                    function checkLoadError() {
                        $timeout(function() {
                            img[0].parentNode && (img[0].clientWidth ? success() : count > 10 ? error() : checkLoadError())
                        }, 1e3)
                    }
                    var img = angular.element("<img>").attr("src", dataUrl).css("visibility", "hidden").css("position", "fixed");
                    img.on("load", success), img.on("error", error);
                    var count = 0;
                    checkLoadError(), angular.element(document.getElementsByTagName("body")[0]).append(img)
                }, function() {
                    deferred.reject("load error")
                })
            }), file.$ngfDimensionPromise = deferred.promise, file.$ngfDimensionPromise["finally"](function() {
                delete file.$ngfDimensionPromise
            }), file.$ngfDimensionPromise
        }, upload.mediaDuration = function(file) {
            if (file.$ngfDuration) {
                var d = $q.defer();
                return $timeout(function() {
                    d.resolve(file.$ngfDuration)
                }), d.promise
            }
            if (file.$ngfDurationPromise) return file.$ngfDurationPromise;
            var deferred = $q.defer();
            return $timeout(function() {
                return 0 !== file.type.indexOf("audio") && 0 !== file.type.indexOf("video") ? void deferred.reject("not media") : void upload.dataUrl(file).then(function(dataUrl) {
                    function success() {
                        var duration = el[0].duration;
                        file.$ngfDuration = duration, el.remove(), deferred.resolve(duration)
                    }

                    function error() {
                        el.remove(), deferred.reject("load error")
                    }

                    function checkLoadError() {
                        $timeout(function() {
                            el[0].parentNode && (el[0].duration ? success() : count > 10 ? error() : checkLoadError())
                        }, 1e3)
                    }
                    var el = angular.element(0 === file.type.indexOf("audio") ? "<audio>" : "<video>").attr("src", dataUrl).css("visibility", "none").css("position", "fixed");
                    el.on("loadedmetadata", success), el.on("error", error);
                    var count = 0;
                    checkLoadError(), angular.element(document.body).append(el)
                }, function() {
                    deferred.reject("load error")
                })
            }), file.$ngfDurationPromise = deferred.promise, file.$ngfDurationPromise["finally"](function() {
                delete file.$ngfDurationPromise
            }), file.$ngfDurationPromise
        }, upload
    }]),
    ngFileUpload.service("UploadResize", ["UploadValidate", "$q", "$timeout", function(UploadValidate, $q, $timeout) {
        var upload = UploadValidate,
            calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {
                var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                return {
                    width: srcWidth * ratio,
                    height: srcHeight * ratio
                }
            },
            resize = function(imagen, width, height, quality, type) {
                var deferred = $q.defer(),
                    canvasElement = document.createElement("canvas"),
                    imagenElement = document.createElement("img");
                return imagenElement.onload = function() {
                    try {
                        width || (width = imagenElement.width, height = imagenElement.height);
                        var dimensions = calculateAspectRatioFit(imagenElement.width, imagenElement.height, width, height);
                        canvasElement.width = dimensions.width, canvasElement.height = dimensions.height;
                        var context = canvasElement.getContext("2d");
                        context.drawImage(imagenElement, 0, 0, dimensions.width, dimensions.height), deferred.resolve(canvasElement.toDataURL(type || "image/WebP", quality || 1))
                    } catch (e) {
                        deferred.reject(e)
                    }
                }, imagenElement.onerror = function() {
                    deferred.reject()
                }, imagenElement.src = imagen, deferred.promise
            };
        return upload.dataUrltoBlob = function(dataurl) {
            for (var arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n); n--;) u8arr[n] = bstr.charCodeAt(n);
            return new Blob([u8arr], {
                type: mime
            })
        }, upload.isResizeSupported = function() {
            var elem = document.createElement("canvas");
            return window.atob && elem.getContext && elem.getContext("2d")
        }, upload.isResizeSupported() && Object.defineProperty(Blob.prototype, "name", {
            get: function() {
                return this.$ngfName
            },
            set: function(v) {
                this.$ngfName = v
            },
            configurable: !0
        }), upload.resize = function(file, width, height, quality) {
            var deferred = $q.defer();
            return 0 !== file.type.indexOf("image") ? ($timeout(function() {
                deferred.resolve("Only images are allowed for resizing!")
            }), deferred.promise) : (upload.dataUrl(file, !0).then(function(url) {
                resize(url, width, height, quality, file.type).then(function(dataUrl) {
                    var blob = upload.dataUrltoBlob(dataUrl);
                    blob.name = file.name, deferred.resolve(blob)
                }, function() {
                    deferred.reject()
                })
            }, function() {
                deferred.reject()
            }), deferred.promise)
        }, upload
    }]),
    function() {
        function linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, upload, $http) {
            function isDisabled() {
                return elem.attr("disabled") || attrGetter("ngfDropDisabled", scope)
            }

            function calculateDragOverClass(scope, attr, evt, callback) {
                var obj = attrGetter("ngfDragOverClass", scope, {
                        $event: evt
                    }),
                    dClass = "dragover";
                if (angular.isString(obj)) dClass = obj;
                else if (obj && (obj.delay && (dragOverDelay = obj.delay), obj.accept || obj.reject)) {
                    var items = evt.dataTransfer.items;
                    if (null != items && items.length)
                        for (var pattern = obj.pattern || attrGetter("ngfPattern", scope, {
                                $event: evt
                            }), len = items.length; len--;) {
                            if (!upload.validatePattern(items[len], pattern)) {
                                dClass = obj.reject;
                                break
                            }
                            dClass = obj.accept
                        } else dClass = obj.accept
                }
                callback(dClass)
            }

            function extractFiles(evt, callback, allowDir, multiple) {
                function traverseFileTree(files, entry, path) {
                    if (null != entry)
                        if (entry.isDirectory) {
                            var filePath = (path || "") + entry.name;
                            files.push({
                                name: entry.name,
                                type: "directory",
                                path: filePath
                            });
                            var dirReader = entry.createReader(),
                                entries = [];
                            processing++;
                            var readEntries = function() {
                                dirReader.readEntries(function(results) {
                                    try {
                                        if (results.length) entries = entries.concat(Array.prototype.slice.call(results || [], 0)), readEntries();
                                        else {
                                            for (var i = 0; i < entries.length; i++) traverseFileTree(files, entries[i], (path ? path : "") + entry.name + "/");
                                            processing--
                                        }
                                    } catch (e) {
                                        processing--, console.error(e)
                                    }
                                }, function() {
                                    processing--
                                })
                            };
                            readEntries()
                        } else processing++, entry.file(function(file) {
                            try {
                                processing--, file.path = (path ? path : "") + file.name, files.push(file)
                            } catch (e) {
                                processing--, console.error(e)
                            }
                        }, function() {
                            processing--
                        })
                }
                var files = [],
                    processing = 0,
                    items = evt.dataTransfer.items;
                if (items && items.length > 0 && "file" !== $location.protocol())
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].webkitGetAsEntry && items[i].webkitGetAsEntry() && items[i].webkitGetAsEntry().isDirectory) {
                            var entry = items[i].webkitGetAsEntry();
                            if (entry.isDirectory && !allowDir) continue;
                            null != entry && traverseFileTree(files, entry)
                        } else {
                            var f = items[i].getAsFile();
                            null != f && files.push(f)
                        }
                        if (!multiple && files.length > 0) break
                    } else {
                        var fileList = evt.dataTransfer.files;
                        if (null != fileList)
                            for (var j = 0; j < fileList.length && (files.push(fileList.item(j)), multiple || !(files.length > 0)); j++);
                    }
                var delays = 0;
                ! function waitForProcess(delay) {
                    $timeout(function() {
                        if (processing) 10 * delays++ < 2e4 && waitForProcess(10);
                        else {
                            if (!multiple && files.length > 1) {
                                for (i = 0;
                                    "directory" === files[i].type;) i++;
                                files = [files[i]]
                            }
                            callback(files)
                        }
                    }, delay || 0)
                }()
            }
            var available = dropAvailable(),
                attrGetter = function(name, scope, params) {
                    return upload.attrGetter(name, attr, scope, params)
                };
            if (attrGetter("dropAvailable") && $timeout(function() {
                    scope[attrGetter("dropAvailable")] ? scope[attrGetter("dropAvailable")].value = available : scope[attrGetter("dropAvailable")] = available
                }), !available) return void(attrGetter("ngfHideOnDropNotAvailable", scope) === !0 && elem.css("display", "none"));
            null == attrGetter("ngfSelect") && upload.registerModelChangeValidator(ngModel, attr, scope);
            var actualDragOverClass, leaveTimeout = null,
                stopPropagation = $parse(attrGetter("ngfStopPropagation")),
                dragOverDelay = 1;
            elem[0].addEventListener("dragover", function(evt) {
                if (!isDisabled()) {
                    if (evt.preventDefault(), stopPropagation(scope) && evt.stopPropagation(), navigator.userAgent.indexOf("Chrome") > -1) {
                        var b = evt.dataTransfer.effectAllowed;
                        evt.dataTransfer.dropEffect = "move" === b || "linkMove" === b ? "move" : "copy"
                    }
                    $timeout.cancel(leaveTimeout), actualDragOverClass || (actualDragOverClass = "C", calculateDragOverClass(scope, attr, evt, function(clazz) {
                        actualDragOverClass = clazz, elem.addClass(actualDragOverClass), attrGetter("ngfDrag", scope, {
                            $isDragging: !0,
                            $class: actualDragOverClass,
                            $event: evt
                        })
                    }))
                }
            }, !1), elem[0].addEventListener("dragenter", function(evt) {
                isDisabled() || (evt.preventDefault(), stopPropagation(scope) && evt.stopPropagation())
            }, !1), elem[0].addEventListener("dragleave", function(evt) {
                isDisabled() || (evt.preventDefault(), stopPropagation(scope) && evt.stopPropagation(), leaveTimeout = $timeout(function() {
                    actualDragOverClass && elem.removeClass(actualDragOverClass), actualDragOverClass = null, attrGetter("ngfDrag", scope, {
                        $isDragging: !1,
                        $event: evt
                    })
                }, dragOverDelay || 100))
            }, !1), elem[0].addEventListener("drop", function(evt) {
                if (!isDisabled() && upload.shouldUpdateOn("drop", attr, scope)) {
                    evt.preventDefault(), stopPropagation(scope) && evt.stopPropagation(), actualDragOverClass && elem.removeClass(actualDragOverClass), actualDragOverClass = null;
                    var html;
                    try {
                        html = evt.dataTransfer && evt.dataTransfer.getData && evt.dataTransfer.getData("text/html")
                    } catch (e) {}
                    if (html) {
                        var url;
                        html.replace(/<img .*src *=\"([^\"]*)\"/, function(m, src) {
                            url = src
                        }), url && $http({
                            url: url,
                            method: "get",
                            responseType: "arraybuffer"
                        }).then(function(resp) {
                            var arrayBufferView = new Uint8Array(resp.data),
                                type = resp.headers("content-type") || "image/jpg",
                                blob = new Blob([arrayBufferView], {
                                    type: type
                                });
                            upload.updateModel(ngModel, attr, scope, attrGetter("ngfChange") || attrGetter("ngfDrop"), [blob], evt)
                        })
                    } else extractFiles(evt, function(files) {
                        upload.updateModel(ngModel, attr, scope, attrGetter("ngfChange") || attrGetter("ngfDrop"), files, evt)
                    }, attrGetter("ngfAllowDir", scope) !== !1, attrGetter("multiple") || attrGetter("ngfMultiple", scope))
                }
            }, !1), elem[0].addEventListener("paste", function(evt) {
                if (!isDisabled() && upload.shouldUpdateOn("paste", attr, scope)) {
                    var files = [],
                        clipboard = evt.clipboardData || evt.originalEvent.clipboardData;
                    if (clipboard && clipboard.items) {
                        for (var k = 0; k < clipboard.items.length; k++) - 1 !== clipboard.items[k].type.indexOf("image") && files.push(clipboard.items[k].getAsFile());
                        upload.updateModel(ngModel, attr, scope, attrGetter("ngfChange") || attrGetter("ngfDrop"), files, evt)
                    }
                }
            }, !1)
        }

        function dropAvailable() {
            var div = document.createElement("div");
            return "draggable" in div && "ondrop" in div && !/Edge\/12./i.test(navigator.userAgent)
        }
        ngFileUpload.directive("ngfDrop", ["$parse", "$timeout", "$location", "Upload", "$http", function($parse, $timeout, $location, Upload, $http) {
            return {
                restrict: "AEC",
                require: "?ngModel",
                link: function(scope, elem, attr, ngModel) {
                    linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, Upload, $http)
                }
            }
        }]), 
        ngFileUpload.directive("ngfNoFileDrop", function() {
            return function(scope, elem) {
                dropAvailable() && elem.css("display", "none")
            }
        }),
        ngFileUpload.directive("ngfDropAvailable", ["$parse", "$timeout", "Upload", function($parse, $timeout, Upload) {
            return function(scope, elem, attr) {
                if (dropAvailable()) {
                    var model = $parse(Upload.attrGetter("ngfDropAvailable", attr));
                    $timeout(function() {
                        model(scope), model.assign && model.assign(scope, !0)
                    })
                }
            }
        }])
    }(),