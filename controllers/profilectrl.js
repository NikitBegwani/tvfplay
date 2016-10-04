angular.module("tvfPlayApp").controller("ProfileController", function($scope, $modalInstance, $modal, $httpParamSerializer, $http, Upload, $timeout, $rootScope, $filter, telemetryService) {
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate()
    }
    $scope.session_start_time = (new Date).getTime(); 
    $scope.time_spent_by_user = 0; 
    $scope.range = function(a, b, c) {
        for (c = []; a--;) c[a] = 9 > a && 1e3 > b ? "0" + (a + b).toString() : a + b;
        return c
    }; 
    $scope.process_date = function(dateValue) {
        if ("" == dateValue) $scope.day = "", $scope.month = "", $scope.year = "";
        else {
            var date = dateValue.split(" ");
            $scope.day = date[0], $scope.month = date[1], $scope.year = date[2]
        }
    }; 
    $scope.process_date($rootScope.dob); 
    $scope.dayRange = $scope.range(31, 1);
    var number_of_years = 90,
        initial_year = (new Date).getFullYear() - (18 + number_of_years);
    $scope.yearRange = $scope.range(number_of_years + 1, initial_year).reverse(); 
    $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 
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
    $scope.updateProfile = function() {
        $scope.show_profile_errors = !1; 
        $scope.$broadcast("show-errors-check-validity"); 
        $scope.updateProfileForm.$valid 
        && ("" == $scope.day && "" == $scope.month && "" == $scope.year 
        	|| "" != $scope.day && "" != $scope.month && "" != $scope.year 
        	? ($scope.form_date(), 
        		$http.put(root_url + "api/profile", $httpParamSerializer({
            first_name: $scope.profile.first_name,
            last_name: $scope.profile.last_name,
            dob: $scope.date
        })).then(function(response) {
            $scope.profilestatus = response.data.status; 
            $scope.profilemessage = response.data.message; 
            "success" == response.data.status 
            ? ($rootScope.dob = "0000-00-00" == response.data.profile.dob || "" == response.data.profile.dob ? "" : $filter("date")(new Date(response.data.profile.dob), "dd MMMM yyyy"), 
            	telemetryService.eventTrigger({
                event_label: "PROFILE",
                event_name: "PROFILE_UPDATE"
            }, "success")) 
            : telemetryService.eventTrigger({
                event_label: "PROFILE",
                event_name: "PROFILE_UPDATE"
            }, $scope.profilestatus, {
                component_name: "PROFILE",
                message: $scope.profilemessage
            })
        }, function(response) {})) 
        	: $scope.show_profile_errors = !0)
    }; 
    $scope.form_date = function() {
        $scope.date = ("" == $scope.year ? "0000-" : $scope.year + "-") 
        				+ ("" == $scope.month ? "00-" : $scope.months.indexOf($scope.month) + 1 + "-") 
        				+ ("" == $scope.day ? "00" : $scope.day)
    }; 
    $scope.ok = function() {}; 
    $scope.cancel = function() {
        $modalInstance.dismiss("cancel")
    }; 
    $scope.showImage = !0; 
    $scope.changePasswordModal = function() {
        $modalInstance.dismiss("cancel");
        var modalInstance = $modal.open({
            templateUrl: "static/client/app/profile/change_password.html",
            controller: "ProfileController",
            windowClass: "modal-form modal-profile"
        });
        modalInstance.result.then(function() {
            $rootScope.$broadcast("profileTelemetry", {
                event: "CHANGE_PASSWORD_PAGE"
            })
        }, function() {
            $rootScope.$broadcast("profileTelemetry", {
                event: "CHANGE_PASSWORD_PAGE"
            })
        })
    }; $scope.changePassword = function() {
        $scope.$broadcast("show-errors-check-validity"); 
        $scope.passwordForm.$valid ? $scope.user.new_password.trim() != $scope.user.confirm_password.trim() ? ($scope.cpstatus = "failure", $scope.passwordmessage = "Password & Confirm Password are not same", telemetryService.eventTrigger({
            event_label: "CHANGE_PASSWORD",
            event_name: "CHANGE_PASSWORD"
        }, $scope.cpstatus, {
            component_name: "CHANGE_PASSWORD",
            message: $rootScope.passwordMatch
        })) : $http.put(root_url + "api/changepassword", $httpParamSerializer({
            old_password: $scope.user.current_password,
            password: $scope.user.new_password
        })).then(function(response) {
            $scope.profilemessage = ""; 
            $scope.cpstatus = response.data.status; 
            $scope.passwordmessage = response.data.message; 
            "failure" == response.data.status ? telemetryService.eventTrigger({
                event_label: "CHANGE_PASSWORD",
                event_name: "CHANGE_PASSWORD"
            }, "failure", {
                component_name: "CHANGE_PASSWORD",
                message: $scope.passwordmessage
            }) : telemetryService.eventTrigger({
                event_label: "CHANGE_PASSWORD",
                event_name: "CHANGE_PASSWORD"
            }, "success")
        }, function(response) {}) : ($scope.passwordForm.currentPassword.$error.required && telemetryService.eventTrigger({
            event_label: "RESET_PASSWORD",
            event_name: "RESET_PASSWORD"
        }, "failure", {
            component_name: "RESET_PASSWORD",
            message: $rootScope.emptyPassword
        }), $scope.passwordForm.newPassword.$error.required && telemetryService.eventTrigger({
            event_label: "RESET_PASSWORD",
            event_name: "RESET_PASSWORD"
        }, "failure", {
            component_name: "RESET_PASSWORD",
            message: $rootScope.emptyPassword
        }), $scope.passwordForm.newPassword.$error.minlength && telemetryService.eventTrigger({
            event_label: "RESET_PASSWORD",
            event_name: "RESET_PASSWORD"
        }, "failure", {
            component_name: "RESET_PASSWORD",
            message: $rootScope.validPassword
        }), $scope.passwordForm.confirmPassword.$error.required && telemetryService.eventTrigger({
            event_label: "RESET_PASSWORD",
            event_name: "RESET_PASSWORD"
        }, "failure", {
            component_name: "RESET_PASSWORD",
            message: $rootScope.emptyConfirmPassword
        }))
    }; 
    $scope.uploadFiles = function(file, errFiles) {
        $scope.showImage = !1; 
        $scope.profile.picture_url = "/static/client/assets/images/load.GIF"; 
        $scope.f = file; 
        $scope.errFile = errFiles && errFiles[0]; 
        file && (file.upload = Upload.upload({
            url: root_url + "api/profile",
            data: {
                picture_data: file
            }
        }), file.upload.then(function(response) {
            $timeout(function() {
                $scope.showImage = !0, $scope.profile.picture_url = response.data.profile.picture_url
            })
        }, function(response) {
            response.status > 0 && ($scope.errorMsg = response.status + ": " + response.data)
        }, function(evt) {
            file.progress = Math.min(100, parseInt(100 * evt.loaded / evt.total))
        }))
    }; 
    $scope.$on("profileTelemetry", function(e, args) {
        time_spent_by_user = (new Date).getTime() - $scope.session_start_time, telemetryService.eventTrigger({
            event_label: args.event,
            event_name: args.event,
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), referred_meta_data = "", referred_event_label = args.event, referred_event_name = args.event, session_start_time = (new Date).getTime()
    })
});