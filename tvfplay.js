 angular.module("tvfPlayApp", 
    	["ngCookies", "ngResource", "ngSanitize", 
    	"ngAnimate", "ui.router", "ui.bootstrap", 
    	"ezfb", "googleplus", "vcRecaptcha", 
    	"ngTouch", "ui.bootstrap.transition", "ngFileUpload", 
    	"720kb.socialshare", "templates"])
    .run(function($http, $cookies, $rootScope, $window, $location, telemetryService) {
        $rootScope.$on("$stateChangeSuccess", function(event, currentState, previousState) {
            $window.scrollTo(0, 0)
        }); 
        $rootScope.setActive = function(id) {
            $rootScope.activeseries == id ? $rootScope.activeseries = !1 : $rootScope.activeseries = id
        }; 
        $rootScope.source = "general"; 
        $rootScope.domainUrl = function() {
            var port = 80 != $location.port() ? ":8000" : "";
            return $location.protocol() + "://" + $location.host() + port
        }; 
        $rootScope.form_season_text = function(count, text) {
            return text = "" == text ? "Season" : text
        }; 
        $rootScope.generate_shorten_url = function(params) {
            return shorten_url_domain_name + params.shorten_token
        }; 
        isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i)
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i)
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i)
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i)
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)
            },
            any: function() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()
            }
        }; 
        $rootScope.OS = {
            Windows: function() {
                return navigator.userAgent.match(/Win/i)
            }
        }; 
        $rootScope.isMobile = isMobile; 
        $cookies.remove("fresh_mobile_application"); 
        $rootScope.check_other_than_safari = function() {
            return void 0 == navigator.userAgent.match(/Version/)
        };
        var mobileOS = !1;
        if (1 == mobileOS) {
            if (isMobile.Android() && void 0 == $cookies.get("fresh_android_mobile_application")) {
                var expireDate = new Date;
                expireDate.setDate(expireDate.getDate() + 1); 
                $cookies.put("fresh_android_mobile_application", "yes", {
                    expires: expireDate
                }); 
                void 0 == ($location.path().match(/terms/i) || $location.path().match(/privacy/i)) && $location.path("/install-application")
            }
            if ("iPhone" == isMobile.iOS() && void 0 == $cookies.get("fresh_iphone_mobile_application")) {
                var expireDate = new Date;
                expireDate.setDate(expireDate.getDate() + 1); 
                $cookies.put("fresh_iphone_mobile_application", "yes", {
                    expires: expireDate
                }); 
                void 0 == ($location.path().match(/terms/i) || $location.path().match(/privacy/i)) && $location.path("/install-application")
            }
        }
        $rootScope.go_to_android_app = function() {
            void 0 == $rootScope.isMobile.Android() 
            ? window.open("https://play.google.com/store/apps/details?id=com.tvf.tvfplay", "_blank") 
            : (ga("send", "event", "MobileToAndroidApplication", "Download Android Application", "Download Android Application"), window.open("//tvf.onelink.me/3513592838?pid=AndroidBrowser&af_dp=tvf%3A%2F%2Fplay%2Fhome&af_web_dp=http%3A%2F%2Ftvfplay.com&af_force_dp=true")); 
            telemetryService.eventTrigger({
                event_label: "MOBILE_WEB_NAVIGATION",
                event_name: "GOOGLE_PLAY_STORE"
            }, "success")
        }; 
        $rootScope.go_to_ios_app = function() {
            window.open("https://itunes.apple.com/us/app/tvfplay/id1067732674?mt=8", "_blank"), telemetryService.eventTrigger({
                event_label: "MOBILE_WEB_NAVIGATION",
                event_name: "APPLE_APP_STORE"
            }, "success")
        }; 
        $rootScope.getTimeInfo = function(video_duration, watched_duration) {
            var duration = {};
            watched_duration = void 0 == watched_duration ? "00:00:00" : watched_duration; 
            video_duration = void 0 == video_duration ? "00:00:00" : video_duration;
            var split_time = video_duration.split(":"),
                seconds = 60 * +split_time[0] * 60 + 60 * +split_time[1] + +split_time[2];
            "00" != split_time[0] 
            ? duration.video_duration = 60 * parseInt(split_time[0]) + parseInt(split_time[1]) + " Mins" 
            : "00" != split_time[1] ? duration.video_duration = split_time[1] + " Mins" : duration.video_duration = split_time[2] + " secs";
            duration.watched_duration = Math.round(watched_duration / seconds * 100);
            return   duration
        }; 
        $rootScope.watchedInfo = function(video_duration, watched_duration) {
            watched_duration = void 0 == watched_duration ? "00:00:00" : watched_duration; 
            video_duration = void 0 == video_duration ? "00:00:00" : video_duration;
            var split_time = video_duration.split(":"),
                seconds = 60 * +split_time[0] * 60 + 60 * +split_time[1] + +split_time[2];
            return parseInt(watched_duration) > parseInt(seconds) - 60
        }, $rootScope.shorten_url_domain_name = shorten_url_domain_name, $rootScope.generateSeriesRedirectURL = function(series, category) {
            var url = "",
                category_id = void 0 == category.category_id ? series.category_id : category.category_id;
            return url = 1 == series.number_of_episodes ? "" != series.episode_id ? "/episode/" + category_id + "/" + series.series_id + "/" + series.season_id + "/" + series.episode_id : "/episode/" + category_id + "/" + series.series_id + "/" + series.season_id : "series" == series.type ? "/category/" + category_id + "/series/" + series.series_id : "/episode/" + category_id + "/" + series.episode_id
        }, $rootScope.encodeImage = function(image) {
            return image
        }, $rootScope.generate_string = function() {
            return Math.random().toString(18).substring(6)
        }, $rootScope.get_ratings = function() {
            return show_ratings
        }, $rootScope.show_air_date = function() {
            return show_air_date
        }, $rootScope.share_google_analytics = function(network, name, type, id) {
            ga("send", "event", "Share", network, name), telemetryService.eventTrigger({
                event_label: type,
                event_name: name,
                meta_data: id
            }, "success", void 0, {
                episode_id: id,
                type: network
            })
        }, $rootScope.margin_height = window.innerWidth < 500 ? 0 : 60, $rootScope.emptyEmail = " Please enter a valid email", $rootScope.emptyPassword = "Please enter a password", $rootScope.validPassword = "Your password must be at least 6 characters", $rootScope.emptyConfirmPassword = "Please confirm your password", $rootScope.passwordMatch = "Passwords don’t match", $rootScope.confirmOldPassword = "Please confirm your old password", $rootScope.emptyFirstname = "Please enter your first name", $rootScope.emptyLastname = "Please enter your last name", $rootScope.emptyname = " Please enter your name", $rootScope.emptyDob = "Please enter your full birthday", $rootScope.emptyfeedback = " Please enter your comment/feedback", $rootScope.maxsize = " File size should be lest than 2 MB", $rootScope.fileformat = " File format should be jpg or png"
    });
  
angular.module("tvfPlayApp").controller("VouchersController", function($scope, $modalInstance, $modal, $httpParamSerializer, $http, Upload, $timeout, $rootScope, $filter) {
        ga("set", {
            page: "/voucher",
            title: "Voucher Page"
        }), ga("send", "pageview"), fbq("track", "PageView"), $http.get(root_url + "api/getvouchers").then(function(response) {
            $scope.vouchers = response.data.vouchers
        }, function(response) {}), $scope.cancel = function() {
            $modalInstance.dismiss("cancel")
        }
}), 
angular.module("tvfPlayApp").directive("showErrors", function($timeout, showErrorsConfig) {
    var getShowSuccess, linkFn;
    return getShowSuccess = function(options) {
        var showSuccess;
        return showSuccess = showErrorsConfig.showSuccess, options && null != options.showSuccess && (showSuccess = options.showSuccess), showSuccess
    }, linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
        if (blurred = !1, options = scope.$eval(attrs.showErrors), showSuccess = getShowSuccess(options), inputEl = el[0].querySelector("[name]"), inputNgEl = angular.element(inputEl), inputName = inputNgEl.attr("name"), !inputName) throw "show-errors element has no child input elements with a 'name' attribute";
        return inputNgEl.bind("blur", function() {
            return blurred = !0, toggleClasses(formCtrl[inputName].$invalid)
        }), scope.$watch(function() {
            return formCtrl[inputName] && formCtrl[inputName].$invalid
        }, function(invalid) {
            return blurred ? toggleClasses(invalid) : void 0
        }), scope.$on("show-errors-check-validity", function() {
            return toggleClasses(formCtrl[inputName].$invalid)
        }), scope.$on("show-errors-reset", function() {
            return $timeout(function() {
                return el.removeClass("has-error"), el.removeClass("has-success"), blurred = !1
            }, 0, !1)
        }), toggleClasses = function(invalid) {
            return el.toggleClass("has-error", invalid), showSuccess ? el.toggleClass("has-success", !invalid) : void 0
        }
    }, {
        restrict: "A",
        require: "^form",
        compile: function(elem, attrs) {
            if (!elem.hasClass("form-group")) throw "show-errors element does not have the 'form-group' class";
            return linkFn
        }
    }
}), 
angular.module("tvfPlayApp").service("showErrorsConfig", function() {
    var _showSuccess;
    _showSuccess = !1, this.showSuccess = function(showSuccess) {
        return _showSuccess = showSuccess
    }, this.$get = function() {
        return {
            showSuccess: _showSuccess
        }
    }
}),    
var player;
angular.module("tvfPlayApp").controller("InviteController", function($scope, $http, $modal, $stateParams, $modalStack, $httpParamSerializer, $rootScope, $modalInstance, ezfb, GooglePlus, $window, $interval) {
    $scope.email1 = "", $scope.email2 = "", $scope.email3 = "", $scope.email4 = "", $scope.email5 = "", $http.get(root_url + "api/invite/social/getinvitetoken/" + $scope.episode_id).then(function(response) {
        "success" == response.data.status && ($scope.invite_url = response.data.invite_url, $scope.invite_token = response.data.invite_token)
    }, function(response) {}), $scope.showSeconds = !1, $scope.heading = "Invite by Emails", $scope.emailModal = function() {
        $(".invite_social").hide();
        $modal.open({
            templateUrl: "static/client/app/invite/invite_by_emails.html",
            controller: "InviteController",
            windowClass: "modal-form",
            backdrop: "static",
            keyboard: !1,
            scope: $scope
        })
    }, $scope.skipInvite = function() {
        $(".invite_social").hide(), $rootScope.from_invite = !1, $scope.brightcovePlayer.play(), $window.scrollTo(0, 0), $modalStack.dismissAll()
    }, $scope.skip_invite_api = function(parameters) {
        $scope.skipInvite(), $http.get(root_url + parameters).then(function(response) {}, function(response) {})
    }, $scope.skip_initial_invite = function() {
        $scope.skip_invite_api("api/invite/skip/popup"), ga("send", "event", "SkipInvite", "SkipInvite", "InitialSkip")
    }, $scope.skip_watch_invite = function() {
        $scope.skip_invite_api("api/invite/send/skip/watch"), ga("send", "event", "SkipInvite", "SkipInvite", "InvitationSentAndSkipped")
    }, $scope.accept_invite_skip = function() {
        $scope.skip_invite_api("api/invite/accept/skip/watch"), ga("send", "event", "SkipInvite", "SkipInvite", "AcceptedAndSkip")
    }, $scope.showTimer = function() {
        var now = new Date;
        $scope.showSeconds = !0;
        var utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1e3;
        $scope.seconds = $scope.expiry_time - utc_timestamp, $scope.heading = "You can watch video with your friends in";
        var interval = $interval(function() {
            if ($scope.seconds <= 1) $interval.cancel(interval), $scope.skipInvite();
            else {
                var now = new Date;
                $scope.time_value = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1e3, $scope.seconds = $scope.expiry_time - $scope.time_value
            }
        }, 1e3)
    }, $scope.invite_by_emails = function() {
        $scope.$broadcast("check", {}), $scope.$broadcast("show-errors-check-validity"), $scope.invite_email.$valid && ($(".fgpass_loader").css("display", "inline"), $scope.email1 || $scope.email2 || $scope.email3 || $scope.email4 || $scope.email5 ? $http.post(root_url + "api/invite/email", $httpParamSerializer({
            emails: $scope.email1 + "," + $scope.email2 + "," + $scope.email3 + "," + $scope.email4 + "," + $scope.email5,
            type: $scope.invite_type,
            episode_id: $scope.episode_id
        })).then(function(response) {
            $(".fgpass_loader").hide(), $scope.expiry_time = response.data.expiry_time, ga("send", "event", "SentInvite", "Invite", "viaEmail"), $scope.showTimer()
        }, function(response) {}) : ($(".fgpass_loader").hide(), $scope.inviteStatus = "error", $scope.inviteMessage = "Please enter atleast one email for inviting your friend to watch the video"))
    }, $scope.social_trigger_call = function(social_type) {
        $http.post(root_url + "api/invite/social", $httpParamSerializer({
            source: social_type,
            type: $scope.invite_type,
            episode_id: $scope.episode_id,
            invite_token: $scope.invite_token,
            invite_url: $scope.invite_url
        })).then(function(response) {
            $scope.expiry_time = response.data.expiry_time, $scope.showTimer()
        }, function(response) {})
    }, $scope.invite_by_facebook = function() {
        ezfb.ui({
            method: "send",
            link: $scope.invite_url,
            caption: $scope.episode.name
        }, function(response) {
            response && (ga("send", "event", "SentInvite", "Invite", "viaFacebook"), $scope.social_trigger_call("facebook"))
        })
    }, $scope.onstartGoogle = function() {
        ga("send", "event", "SentInvite", "Invite", "viaGoogle"), $scope.social_trigger_call("google")
    }
}), 
angular.module("tvfPlayApp").controller("FooterController", function($scope, $httpParamSerializer, $http, $modal, $rootScope, telemetryService, $window) {
    $rootScope.visibleFeedback = !0, $scope.wrong_browser = wrong_browser, $scope.twitter_url = twitter_url, $scope.instagram_url = instagram_url, $scope.facebook_url = facebook_url, $scope.rss_url = rss_url, $scope.copyright_text = copyright_text, $scope.email = "", $scope.showSubscibe = !0, $scope.subscribe = function() {
        "" != $scope.email.trim() ? $http.post(root_url + "api/subscribe/email", $httpParamSerializer({
            email: $scope.email
        })).then(function(response) {
            $scope.substatus = response.data.status, $scope.subscibe_message = response.data.message, "success" == $scope.substatus ? ($scope.showSubscibe = !1, telemetryService.eventTrigger({
                event_label: "SUBSCRIBE",
                event_name: "SUBSCRIBE"
            }, "success")) : telemetryService.eventTrigger({
                event_label: "SUBSCRIBE",
                event_name: "SUBSCRIBE"
            }, $scope.substatus, {
                component_name: "SUBSCRIBE",
                message: $scope.subscibe_message
            })
        }, function(response) {}) : ($scope.substatus = "failure", $scope.subscibe_message = "Please enter your email address!")
    }, $scope.showFeedback = function() {
        $rootScope.visibleFeedback = !1, $rootScope.$broadcast("telemetryTrigger", {}), $rootScope.current_pg_label = "FEEDBACK_PAGE";
        $modal.open({
            templateUrl: "static/client/app/static_pages/feedback.html",
            controller: "StaticController",
            windowClass: "modal-form modal-profile",
            backdrop: "static",
            keyboard: !1
        })
    }, $scope.follow = function(network) {
        switch (network) {
            case "facebook":
                $window.open($scope.facebook_url, "_blank"), telemetryService.eventTrigger({
                    event_label: "FOLLOW_SOCIAL",
                    event_name: "FACEBOOK"
                }, "success");
                break;
            case "twitter":
                $window.open($scope.twitter_url, "_blank"), telemetryService.eventTrigger({
                    event_label: "FOLLOW_SOCIAL",
                    event_name: "TWITTER"
                }, "success");
                break;
            case "instagram":
                $window.open($scope.instagram_url, "_blank"), telemetryService.eventTrigger({
                    event_label: "FOLLOW_SOCIAL",
                    event_name: "INSTAGRAM"
                }, "success")
        }
    }
}),  
angular.module("tvfPlayApp").factory("Modal", function($rootScope, $modal) {
    function openModal(scope, modalClass) {
        var modalScope = $rootScope.$new();
        return scope = scope || {}, modalClass = modalClass || "modal-default", angular.extend(modalScope, scope), $modal.open({
            templateUrl: "components/modal/modal.html",
            windowClass: modalClass,
            scope: modalScope
        })
    }
    return {
        confirm: {
            "delete": function(del) {
                return del = del || angular.noop,
                    function() {
                        var deleteModal, args = Array.prototype.slice.call(arguments),
                            name = args.shift();
                        deleteModal = openModal({
                            modal: {
                                dismissable: !0,
                                title: "Confirm Delete",
                                html: "<p>Are you sure you want to delete <strong>" + name + "</strong> ?</p>",
                                buttons: [{
                                    classes: "btn-danger",
                                    text: "Delete",
                                    click: function(e) {
                                        deleteModal.close(e)
                                    }
                                }, {
                                    classes: "btn-default",
                                    text: "Cancel",
                                    click: function(e) {
                                        deleteModal.dismiss(e)
                                    }
                                }]
                            }
                        }, "modal-danger"), deleteModal.result.then(function(event) {
                            del.apply(event, args)
                        })
                    }
            }
        }
    }
}),  
angular.module("tvfPlayApp").directive("categoryDropdown", function() {
    return {
        templateUrl: "/static/client/components/category-dropdown/category-dropdown.html",
        restrict: "A",
        scope: {
            seasons: "="
        },
        replace: !0
    }
}),   
angular.module("tvfPlayApp").directive("carouselControllerProvider", function($timeout) {
    return {
        link: function(scope, elem, attr) {
            $timeout(function() {
                var carousel = elem.find("div")[0],
                    carouselCtrl = angular.element(carousel).isolateScope();
                $(carousel).children(".carousel-control").last().addClass("right-category"), $(carousel).children(".carousel-control").first().addClass("left-category");
                var origNext = carouselCtrl.next;
                carouselCtrl.next = function() {
                    var category_id = parseInt($(carousel).attr("attribute")),
                        index_category = (parseInt($("#myCarousel" + category_id + " .active").index()), parseInt($(carousel).attr("index_category")));
                    elem.scope().next(category_id, index_category) && origNext()
                }
            })
        }
    }
}) 
angular.module("tvfPlayApp").directive("bindHtmlCompile", function($compile) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            scope.$watch(function() {
                return scope.$eval(attrs.bindHtmlCompile)
            }, function(value) {
                element.html(value && value.toString());
                var compileScope = scope;
                attrs.bindHtmlScope && (compileScope = scope.$eval(attrs.bindHtmlScope)), $compile(element.contents())(compileScope)
            })
        }
    }
}),
angular.module("tvfPlayApp").directive("script", function($parse, $rootScope, $compile, $timeout) {
    return {
        restrict: "E",
        terminal: !0,
        link: function(scope, element, attr) {
            attr.ngSrc && $.getScript(attr.ngSrc, function() {
                $rootScope.$broadcast("brightcove:initialized", {}), $.getScript("https://players.brightcove.net/videojs-overlay/lib/videojs-overlay.js", function() {})
            })
        }
    }
})
.directive("script1", function($parse, $rootScope, $compile, $timeout) {
    return {
        restrict: "E",
        terminal: !0,
        link: function(scope, element, attr) {
            attr.ngSrc && angularLoad.loadScript(attr.ngSrc).then(function() {})["catch"](function() {})
        }
    }
}), 
angular.module("tvfPlayApp").directive("shareHideClick", ["$rootScope", function($rootScope, $scope, $compile) {
    return {
        restrict: "AE",
        scope: {
            activeseries: "="
        },
        link: function($scope, element, attrs) {
            element.bind("click", function(e) {
                var element = e.srcElement ? e.srcElement : e.currentTarget;
                $(element).hasClass("share-social") || $(element).parent().hasClass("enabled") || $(element).parent().hasClass("share-social") || ($rootScope.activeseries = !1,
                    $rootScope.$apply())
            })
        }
    }
}])
.directive("imageonload", function() {
    return {
        restrict: "A",
        scope: {},
        link: function(scope, element, attrs) {
            element.on("load", function(scope) {
                var element = scope.srcElement ? scope.srcElement : scope.currentTarget;
                id = element.id, $("#loader_" + id).hide()
            }), element.on("error", function(scope, element, attrs) {
                var element = scope.srcElement ? scope.srcElement : scope.currentTarget;
                id = element.id, $("#loader_" + id).hide()
            }), scope.$watch("ngSrc", function(value) {})
        }
    }
})
.directive("fileDirective", function() {
    return {
        link: function(scope, el, attrs) {
            el.bind("change", function(event) {
                var files = event.target.files,
                    file = files[0];
                scope.feedbackfilename = file ? file.name : void 0, scope.$apply()
            })
        }
    }
})
.directive("introLogin", function(telemetryService) {
    return {
        link: function(scope, el, attrs) {
            auth_page = "INTRO_LOGIN_PAGE", telemetryService.eventTrigger({
                event_label: "INTRO_LOGIN_VIEW",
                event_name: "INTRO_LOGIN_VIEW"
            }, "success")
        }
    }
});