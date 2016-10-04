angular.module("tvfPlayApp").controller("NavbarCtrl", function($scope, $location, $http, $stateParams, $modal, $rootScope, $filter, $cookies, $window, $timeout, telemetryService) {
    $scope.$on("Authenticated", function() {
        $scope.getHeader(!0)
    }); 
    $scope.getHeader = function(reloadEpisode) {
        $http.get(root_url + "api/getheader").success(function(response) {
            "failure" == response.status && telemetryService.eventTrigger({
                event_label: "HEADER_INFO",
                event_name: "HEADER_INFO"
            }, "failure", {
                component_name: "HEADER_INFO",
                message: response.message
            }), 
            $scope.fixed = !!$location.path().match(/series/i), 
            $rootScope.menu = response.categories;
            var temp_array = $rootScope.menu.slice();
            for ($scope.menuwidth = 225 * Math.ceil($rootScope.menu.length / 3) + "px", $scope.menu_hash = {
                    1: "col-md-12",
                    2: "col-md-6",
                    3: "col-md-4",
                    4: "col-md-3",
                    5: "col-md-2"
                }, $scope.menu_class = $scope.menu_hash[Math.ceil($rootScope.menu.length / 3)], $scope.music = response.musics[0], $rootScope.menu_arrays = []; temp_array.length > 0;) 
                $rootScope.menu_arrays.push(temp_array.splice(0, 3));
            $rootScope.isLoggedIn = response.loggedin, 
            $http.defaults.headers.post["X-CSRFToken"] = $cookies.get("tvf_api_token"), 
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded", 
            $http.defaults.headers.put["X-CSRFToken"] = $cookies.get("tvf_api_token"), 
            $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded", 
            $rootScope.referrer_url = $location.absUrl(), 
            $rootScope.isLoggedIn && (is_logged_in = "True", reloadEpisode && $rootScope.$broadcast("getLoggedInEpisode", {}), $rootScope.profile = response.profile, $rootScope.user_email = response.profile.email, $rootScope.dob = "0000-00-00" == response.profile.dob || "" == response.profile.dob ? "" : $filter("date")(new Date(response.profile.dob), "dd MMMM yyyy"))
        })
    }; 
    void 0 == $rootScope.profile && $scope.getHeader(!1), 
    $scope.$watch(function() {
        return $window.innerWidth
    }, function(value) {
        $scope.windowWidth = value, 
        $scope.windowWidth < 768 ? $scope.is_mobile = !0 : $scope.is_mobile = !1
    }); 
    $scope.isCollapsed = !0, 
    $scope.isActive = function(route) {
        return route === $stateParams.id
    }; 
    $scope.profileModal = function() {
        $rootScope.$broadcast("telemetryTrigger", {});
        var modalInstance = $modal.open({
            templateUrl: "static/client/app/profile/profile.html",
            controller: "ProfileController",
            windowClass: "modal-form modal-profile"
        });
        modalInstance.result.then(function() {
            $rootScope.$broadcast("profileTelemetry", {
                event: "PROFILE_PAGE"
            })
        }, function() {
            $rootScope.$broadcast("profileTelemetry", {
                event: "PROFILE_PAGE"
            })
        })
    }; 
    $scope.search = function() {
        $rootScope.$broadcast("telemetryTrigger", {});
        $modal.open({
            templateUrl: "static/client/app/search/search.html",
            controller: "SearchController",
            windowClass: "modal-form"
        })
    }; 
    $scope.login = function() {
        $rootScope.$broadcast("telemetryTrigger", {});
        $modal.open({
            templateUrl: "static/client/app/authentication/intro-authentication.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        })
    }; 
    $scope.signup = function() {
        $rootScope.$broadcast("telemetryTrigger", {});
        $modal.open({
            templateUrl: "static/client/app/authentication/intro-authentication.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        })
    }; 
    $scope.feedback = function() {
        $modal.open({
            templateUrl: "static/client/app/static_pages/feedback.html",
            controller: "StaticController",
            windowClass: "modal-form"
        })
    }; 
    $scope.logout = function() {
        telemetryService.eventTrigger({
            event_label: "LOGOUT",
            event_name: "LOGOUT"
        }, "success"); 
        $http.get(root_url + "api/logout").then(function(response) {
            $timeout(function() {
                "success" == response.data.status 
                ? ($location.path("/"), 
                    $rootScope.$broadcast("Authenticated", {}),
                     is_logged_in = "False") 
                : telemetryService.eventTrigger({
                    event_label: "LOGOUT",
                    event_name: "LOGOUT"
                }, $scope.spstatus, {
                    component_name: "LOGOUT",
                    message: response.data.message
                })
            })
        }, function(response) {})
    }; 
    $scope.logo_click = function() {
        $location.path("/"), 
        telemetryService.eventTrigger({
            event_label: "LOGO_CLICK",
            event_name: "LOGO_CLICK"
        }, "success")
    }; 
    $scope.voucherModal = function() {
        $modal.open({
            templateUrl: "static/client/app/profile/voucher.html",
            controller: "VouchersController",
            windowClass: "modal-form modal-profile"
        })
    }; 
    $scope.openMusic = function() {
        ga("send", "event", window.location.hostname + ":music:clicked" + $scope.music.episode_id, "clicked", "clicked"); 
        $location.path("/episode/" + $scope.music.category_id + "/" + $scope.music.series_id + "/" + $scope.music.season_id + "/" + $scope.music.episode_id)
    }; 
    $scope.notificationModal = function() {
        if ("True" == is_logged_in) {
            $modal.open({
                templateUrl: "static/client/app/static_pages/notifications.html",
                controller: "StaticController",
                windowClass: "modal-form modal-flat"
            })
        } else $scope.login()
    }; 
    $scope.clickedProfile = function() {
        telemetryService.eventTrigger({
            event_label: "USERNAME_CLICK",
            event_name: "USERNAME_CLICK"
        }, "success")
    }
});