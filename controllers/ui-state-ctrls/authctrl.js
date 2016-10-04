//login -> login-separate.html
angular.module("tvfPlayApp").controller("AuthenticationController", function($scope, $modalInstance, $http, $httpParamSerializer, $window, ezfb, $modal, $rootScope, $location, $modalStack, $cookies, vcRecaptchaService, $sce, $stateParams, telemetryService) {
    function daysInMonth(month, year) { return new Date(year, month, 0).getDate() }

    $scope.remember_me = !1;
    $scope.session_start_time = (new Date).getTime();
    $scope.start_event = 0;
    $scope.processed_time = 0;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src)
    };
    $scope.csrf_token = $cookies.get("tvf_api_token");
    $scope.model = {
        key: captcha_client_key
    };
    $scope.secure_root_url = secure_root_url;
    $scope.root_url = root_url;

    "True" == is_logged_in && ($stateParams.from_login || $stateParams.from_signup) && $location.path("/");

    $scope.check_availabilty_email = function() {
        $scope.$broadcast("show-errors-check-validity");
        $rootScope.email = $scope.email;
        $scope.introForm.$valid ? $http.post(root_url + "api/email/availability", $httpParamSerializer({
            email: $scope.email
        })).then(function(response) {
            $scope.send_time_spent_telemetry(), 
            "success" == response.data.status ? $scope.signupModal() : $scope.loginModal()
        }, function(response) {}) : /**telemetryService.eventTrigger({
            event_label: "INTRO_LOGIN_PAGE",
            event_name: "INTRO_LOGIN_PAGE"
        }, "failure", {
            component_name: "INTRO_LOGIN",
            message: $rootScope.emptyEmail
        })**/
    };
    $scope.facebookLogin = function() {
        $scope.start_event = (new Date).getTime();
        OpenPopupCenter("https://www.facebook.com/dialog/oauth/?client_id=" 
            + fb_id 
            + "&redirect_uri=" 
            + root_url 
            + "api/facebook/callback&response_type=code&scope=public_profile,email&display=popup&state=" 
            + $rootScope.source + "|" + protocol + "|" + $rootScope.referrer_url, "TVFPlay Facebook Login");
        setTimeout(CheckLoginStatus, 2e3);
        return !1
    };
    $scope.googleLogin = function() {
        $scope.start_event = (new Date).getTime();
        OpenPopupCenter("https://accounts.google.com/o/oauth2/v2/auth?state=" + $rootScope.source + "|" + protocol + "|" + $rootScope.referrer_url + "&redirect_uri=" + root_url + "api/google/callback&response_type=code&scope=email https://www.googleapis.com/auth/plus.login&include_granted_scopes=true&client_id=" + google_id, "TVFPlay Google Login");
        setTimeout(CheckLoginStatus, 2e3);
        return !1
    };
    $scope.cancel = function() {
        $cookies.remove("avail_offer_path");
        $cookies.remove("download_file");
        $modalInstance.dismiss("cancel")
    };
    $scope.process_login_response = function(data) {
        $scope.spstatus = data.status;
        $scope.message = void 0;
        $scope.registermessage = void 0;
        $scope.processed_time = (new Date).getTime() - $scope.start_event;
        /**
        if ("success" == data.status) {
            telemetryService.eventTrigger(map_keys(data, $scope.processed_time), data.status);
            $scope.send_time_spent_telemetry();
            switch (!0) {
                case "THEVIRALFEVER" == data.auth_type && "signin" == data.event:
                    ga("send", "event", "Authentication", "Login", "TvfLogin");
                    break;
                case "THEVIRALFEVER" == data.auth_type && "signup" == data.event:
                    ga("send", "event", "Authentication", "Login", "TvfLogin"), fbq("track", "CompleteRegistration"), "function" == typeof window.google_trackConversion && window.google_trackConversion({
                        google_conversion_id: 960345609,
                        google_conversion_language: "en",
                        google_conversion_format: "3",
                        google_conversion_color: "ffffff",
                        google_conversion_label: "IBM9CK-75WQQiez2yQM",
                        google_remarketing_only: !1
                    });
                    break;
                case "GOOGLE" == data.auth_type && "signin" == data.event:
                    ga("send", "event", "Authentication", "Login", "GoogleLogin");
                    break;
                case "FACEBOOK" == data.auth_type && "signin" == data.event:
                    ga("send", "event", "Authentication", "Login", "FacebookLogin");
                    break;
                case "GOOGLE" == data.auth_type && "signup" == data.event:
                    ga("send", "event", "Registration", "Registration", "GoogleRegistration");
                    break;
                case "FACEBOOK" == data.auth_type && "signup" == data.event:
                    ga("send", "event", "Registration", "Registration", "FacebookRegistration")
            }
            "THEVIRALFEVER" == data.auth_type && "signup" == data.event || ($location.path().match(/(reset|emailverification|login|signup)/g) && $location.path("/"), $scope.dismissModal(), $rootScope.$broadcast("Authenticated", {}))
        } else {
            var event = map_keys(data, $scope.processed_time);
            telemetryService.eventTrigger(event, data.status, {
                component_name: event.event_label,
                message: data.message
            });
        } **/
        try {
            $scope.message = data.message;
            $scope.registermessage = data.message;
            $scope.show_reg_loader = !1;
            $scope.$apply();
            grecaptcha.reset();
            void 0 == $scope.capcha
        } catch (err) {
            console.log("exception" + err.message)
        }
    };
    $scope.tvfLogin = function() {
        $scope.start_event = (new Date).getTime();
        $scope.$broadcast("show-errors-check-validity");
        if ($scope.loginForm.$valid) {
            var iframe_form = $(".tvf-loginform");
            iframe_form.attr("action", secure_root_url + "api/web/signin");
            iframe_form.attr("method", "post");
            iframe_form.submit()
        } else /** $scope.loginForm.password.$error.required && telemetryService.eventTrigger({
            event_label: "LOGIN",
            event_name: "LOGIN"
        }, "failure", {
            component_name: "LOGIN",
            message: $rootScope.emptyPassword
        });
        $scope.loginForm.password.$error.minlength && telemetryService.eventTrigger({
            event_label: "LOGIN",
            event_name: "LOGIN"
        }, "failure", {
            component_name: "LOGIN",
            message: $rootScope.validPassword
        }) **/
    };
    $scope.tvfRegistration = function() {
            $scope.start_event = (new Date).getTime();
            $scope.$broadcast("show-errors-check-validity");
            $scope.confirmationError = !1;
            $scope.show_profile_errors = !0;
            $scope.show_reg_loader = !0;
            if ($scope.signupForm.$valid)
                if ($scope.register.password != $scope.register.confirm_password) {

                   /** $scope.register.password != $scope.register.confirm_password && ( telemetryService.eventTrigger({
                        event_label: "REGISTRATION",
                        event_name: "REGISTRATION"
                    }, "failure", {
                        component_name: "REGISTRATION",
                        message: $rootScope.passwordMatch
                    })); **/
                    $scope.confirmationError = !0,
                    grecaptcha.reset(), 
                    $scope.show_reg_loader = !1;
                } else {
                    $scope.registermessage = "";
                    $scope.captcha_value = $(".g-recaptcha-response").val();
                    var iframe_form = $(".tvf-signupform");
                    iframe_form.attr("action", secure_root_url + "api/signup");
                    iframe_form.attr("method", "post");
                    iframe_form.submit()
                } 
            else /**$scope.signupForm.password.$error.required && telemetryService.eventTrigger({
                    event_label: "REGISTRATION",
                    event_name: "REGISTRATION"
                }, "failure", {
                    component_name: "REGISTRATION",
                    message: $rootScope.emptyPassword
                }), $scope.signupForm.password.$error.minlength && telemetryService.eventTrigger({
                    event_label: "REGISTRATION",
                    event_name: "REGISTRATION"
                }, "failure", {
                    component_name: "REGISTRATION",
                    message: $rootScope.validPassword
                }), $scope.signupForm.confirmPassword.$error.required && telemetryService.eventTrigger({
                    event_label: "REGISTRATION",
                    event_name: "REGISTRATION"
                }, "failure", {
                    component_name: "REGISTRATION",
                    message: $rootScope.emptyConfirmPassword
                }),**/ $scope.show_reg_loader = !1,
                void 0 == $scope.capcha ? ($scope.capchaValid = !0/**, telemetryService.eventTrigger({
                    event_label: "REGISTRATION",
                    event_name: "REGISTRATION"
                }, "failure", {
                    component_name: "REGISTRATION",
                    message: "Captcha required"
                })**/) : $scope.capchaValid = !1
        };
    $scope.forgotPassword = function() {
        $scope.start_event = (new Date).getTime();
        $(".fgpass_loader").css("display", "inline"), ;
        $http.post(root_url + "api/forgotpassword", $httpParamSerializer({
            email: $scope.email
        })).then(function(response) {
            $scope.spstatus = response.data.status;
            $scope.message = response.data.message;
            $(".fgpass_loader").hide();
            $scope.processed_time = (new Date).getTime() - $scope.start_event;
            "success" == $scope.spstatus ? ($scope.submitted = !0/**, telemetryService.eventTrigger({
                    event_label: "FORGOT_PASSWORD",
                    event_name: "FORGOT_PASSWORD",
                    load_duration: $scope.processed_time
                }, $scope.spstatus)**/) : /**telemetryService.eventTrigger({
                    event_label: "FORGOT_PASSWORD",
                    event_name: "FORGOT_PASSWORD",
                    load_duration: $scope.processed_time
                }, $scope.spstatus, {
                    component_name: "FORGOT_PASSWORD",
                    message: $scope.message
                })**/
        }, function(response) {})
    },
    $scope.range = function(a, b, c) {
            for (c = []; a--;) c[a] = 9 > a && 1e3 > b ? "0" + (a + b).toString() : a + b;
            return c
    };
    $scope.day = "";
    $scope.month = "";
    $scope.year = "";
    $scope.dayRange = $scope.range(31, 1);
    var number_of_years = 90,
        initial_year = (new Date).getFullYear() - (18 + number_of_years);
    $scope.yearRange = $scope.range(number_of_years + 1, initial_year).reverse();
    $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.setDay = function(day) {
        $scope.day = day
    };
    $scope.setMonth = function(month) {
        $scope.month = month
    };
    $scope.setYear = function(year) {
        $scope.year = year
    };
    $scope.validate_date = function() {
        var no_of_days = daysInMonth($scope.months.indexOf($scope.month) + 1, $scope.year);
        $scope.dayRange = $scope.range(no_of_days, 1);
        parseInt($scope.day) > no_of_days && ($scope.day = no_of_days)
    };
    $scope.$watch("month", function(newValue, oldValue) {
        $scope.validate_date()
    });
    $scope.$watch("year", function(newValue, oldValue) {
        $scope.validate_date()
    });
    $scope.dismissModal = function() {
        $modalInstance.dismiss("cancel")
    };
    $scope.signupModal = function() {
        $modalInstance.dismiss("cancel");
        $scope.session_start_time = (new Date).getTime();
        var modalInstance = $modal.open({
            templateUrl: "static/client/app/authentication/new-registration.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        });
        modalInstance.result.then(function() {
            $scope.send_time_spent_telemetry()
        }, function() {
            $scope.send_time_spent_telemetry()
        })
    };
    $scope.loginModal = function() {
        $modalInstance.dismiss("cancel");
        $scope.session_start_time = (new Date).getTime();
        var modalInstance = $modal.open({
            templateUrl: "static/client/app/authentication/new-login.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        });
        modalInstance.result.then(function() {
            $scope.send_time_spent_telemetry()
        }, function() {
            $scope.send_time_spent_telemetry()
        })
    };
    $scope.introModal = function() {
        $modalInstance.dismiss("cancel");
        $modal.open({
            templateUrl: "static/client/app/authentication/intro-authentication.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        })
    };
    $scope.forgotPasswordModal = function() {
        try {
            $modalInstance && $modalInstance.dismiss("cancel")
        } catch (err) {
            console.log("exception" + err.message)
        }
        $modal.open({
            templateUrl: "static/client/app/authentication/forgot_password.html",
            controller: "AuthenticationController",
            windowClass: "modal-form"
        })
    };
    $scope.signuppage = function() {
        $location.path("/signup")
    };
    $scope.loginpage = function() {
        $location.path("/login")
    };
    $scope.send_time_spent_telemetry = function() {
        time_spent_by_user = (new Date).getTime() - $scope.session_start_time;
        telemetryService.eventTrigger({
            event_label: auth_page,
            event_name: auth_page,
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), 
        referred_meta_data = "", 
        referred_event_label = auth_page, 
        referred_event_name = auth_page, 
        session_start_time = (new Date).getTime()
    };
    $scope.$on("$destroy", function() {
        "INTRO_LOGIN_PAGE" == auth_page && $scope.send_time_spent_telemetry()
    }
});