angular.module("tvfPlayApp")
.controller("StaticController", function($scope, $http, $stateParams, $location, $rootScope, $modalInstance, $httpParamSerializer, $modal, $filter, Upload, telemetryService) {
    $scope.feedback_email = $rootScope.user_email; 
    void 0 != $scope.feedback_email && ($scope.disabled_mail = !0); 
    $scope.session_start_time = (new Date).getTime(); 
    $scope.wrong_browser = wrong_browser; 
    $scope.submitted = !1;
    var params = "";

    $scope.couponHeight = window.innerHeight - 200 + "px"; 

    $stateParams.from_upgrade_browser && (wrong_browser ? ($location.path("/upgrade-browser"); ga("send", "event", "Upgrade Browser", "Upgrade your Browser"); ga("send", "event", "Upgrade Browser", browser.name + " " + browser.version); telemetryService.eventTrigger({
        event_label: "UPGRADE_BROWSER",
        event_name: "UPGRADE_BROWSER"
    }, "success")) : (ga("send", "event", "Upgrade Browser", "Upgraded my Browser"), $location.path("/")));

    switch ($stateParams.type) 
    {
        case "about":
            $rootScope.current_pg_label = "ABOUT_PAGE", params = "api/static/about", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "ABOUT"
            }, "success");
            break;
        case "contact":
            $rootScope.current_pg_label = "CONTACT_PAGE", params = "api/static/contact", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "CONTACT"
            }, "success");
            break;
        case "privacy":
            $rootScope.current_pg_label = "PRIVACY_PAGE", params = "api/static/privacy", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "PRIVACY_POLICY"
            }, "success");
            break;
        case "terms":
            $rootScope.current_pg_label = "TERMS_PAGE", params = "api/static/terms", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "TERMS_AND_CONDITIONS"
            }, "success");
            break;
        case "refund":
            $rootScope.current_pg_label = "REFUND_PAGE", params = "api/static/refund-cancellation", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "REFUND_AND_CANCELLATION_POLICY"
            }, "success");
            break;
        case "faq":
            $rootScope.current_pg_label = "FAQ_PAGE", params = "api/static/faq", telemetryService.eventTrigger({
                event_label: "STATIC_PAGE",
                event_name: "FAQ"
            }, "success");
            break;
        case "coupons":
            params = "api/offers/series/" + $stateParams.category_id + "/" + $stateParams.series_id
    }

    1 != $scope.from_retrieve_email && $http.get(root_url + params).then(function(response) {
        if ("coupons" == $stateParams.type) {
            ga("send", "pageview"); 
            fbq("track", "ViewContent"); 
            "function" == typeof window.google_trackConversion && window.google_trackConversion({
                google_conversion_id: 960345609,
                google_custom_params: {
                    page: "Coupon Page"
                },
                google_remarketing_only: !0
            }); 
            $scope.coupon_list = []; 
            $scope.offers = response.data.offers; 
            $scope.skip_enabled = response.data.skip_enabled; 
            $scope.series_name = response.data.series_name; 
            $scope.details = response.data; 
            $rootScope.offers_help_url = response.data.offers_help_url; 
            0 == response.data.offers.length && $scope.paymentAction();
            for (var i = 0; i <= response.data.offers.length; i += 2) 
            	$scope.coupon_list.push($scope.offers.slice(i, i + 2));
        } else {
        	$scope.name = response.data.name; $scope.content = response.data.content;
        }
    }, function(response) {});

    $scope.continue_to_website = function() {
        ga("send", "event", "MobileToAndroidApplication", "Continue to website", "Continue to website"), $location.url("/index"), telemetryService.eventTrigger({
            event_label: "MOBILE_WEB_NAVIGATION",
            event_name: "CONTINUE_TO_WEBSITE"
        }, "success")
    } 
    $scope.continue_to_iphone_website = function() {
        ga("send", "event", "MobileToiPhoneApplication", "Continue to website", "Continue to website"), $location.url("/index"), telemetryService.eventTrigger({
            event_label: "MOBILE_WEB_NAVIGATION",
            event_name: "CONTINUE_TO_WEBSITE"
        }, "success")
    }
    $scope.cancel = function() {
        $rootScope.visibleFeedback = !0, $modalInstance.dismiss("cancel")
    } 
    $scope.setSelectedCoupon = function(coupon_id) {
        $scope.selected_coupon_id = coupon_id, $scope.select_coupon = !1
    } 
    $scope.homePage = function() {
        $location.path("/")
    } 
    $scope.how_to_avail_offer = function() {
        $modal.open({
            templateUrl: "static/client/app/static_pages/how_to_avail_offer.html",
            controller: "StaticController",
            windowClass: "modal-form",
            scope: $scope
        })
    } 
    $scope.know_more = function(coupon) {
        $scope.selected_coupon = coupon;
        $modal.open({
            templateUrl: "static/client/app/static_pages/know_more.html",
            controller: "StaticController",
            windowClass: "modal-form modal-flat",
            scope: $scope
        })
    } 
    $scope.tvffeedback = function() {
        $scope.$broadcast("show-errors-check-validity"), $scope.feedbackForm.$valid && ($(".fgpass_loader").css("display", "inline"), Upload.upload({
            url: root_url + "api/feedback",
            data: {
                image: $scope.file,
                email: $scope.feedback_email,
                comment: $scope.feedback.comment
            },
            method: "POST"
        }).then(function(response) {
            $scope.spstatus = response.data.status, $scope.message = response.data.message, "success" == $scope.spstatus ? ($(".fgpass_loader").hide(), $scope.submitted = !0, telemetryService.eventTrigger({
                event_label: "FEEDBACK",
                event_name: "FEEDBACK"
            }, $scope.spstatus)) : telemetryService.eventTrigger({
                event_label: "FEEDBACK",
                event_name: "FEEDBACK"
            }, "failure", {
                component_name: "FEEDBACK",
                message: $scope.message
            })
        }, function(response) {}, function(evt) {}))
    }
    $scope.uploadFiles = function(file, errFiles) {
        $scope.file = file, $scope.errFile = errFiles && errFiles[0]
    }

    $scope.paymentAction = function() {
        void 0 == $scope.selected_coupon_id && 0 == $scope.skip_enabled 
        ? $scope.select_coupon = !0 
        : (ga("send", "event", "Payment:started:" + $scope.series_name, "Payment:started:" + $scope.series_name); fbq("track", "InitiateCheckout"); 
        	window.location.href = "/api/payment/web/" + $stateParams.category_id + "/" + $stateParams.series_id + "/" + ($scope.selected_coupon_id ? $scope.selected_coupon_id : 0))
    } 
    $scope.skipCoupon = function() {
        $scope.selected_coupon_id = 0; 
        $scope.paymentAction()
    } 
    $scope.notifications = function() {
        $http.get(root_url + "api/pushnotifications").then(function(response) {
            $scope.notifications = response.data.notifications
        }, function(response) {})
    } 
    $scope.navigate_to_episode = function(notification) {
        $modalInstance.dismiss("cancel"), $location.path("/episode/" + notification.category_id + "/" + notification.series_id + "/" + notification.season_id + "/" + notification.episode_id)
    } 
    $scope.sendEmail = function() {
        $scope.$broadcast("show-errors-check-validity"), $scope.fgpassForm.$valid && $scope.triggerCoupon($scope.email)
    } 
    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - $scope.session_start_time; 
        telemetryService.eventTrigger({
            event_label: $rootScope.current_pg_label,
            event_name: $rootScope.current_pg_label,
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"); 
        referred_meta_data = ""; 
        referred_event_label = $rootScope.current_pg_label; 
        referred_event_name = $rootScope.current_pg_label; 
        session_start_time = (new Date).getTime();
    }); 
    $scope.$on("$destroy", function() {
        void 0 != $rootScope.current_pg_label && $scope.$broadcast("telemetryTrigger", {})
    });
});