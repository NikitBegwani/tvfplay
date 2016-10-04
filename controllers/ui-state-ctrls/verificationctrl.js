angular.module("tvfPlayApp").controller("VerificationController",
    function($scope, $window, $http, $httpParamSerializer, $stateParams, $timeout, $location, $modal, $rootScope, telemetryService) {
        $scope.token = $stateParams.token;
        $scope.show_loader = !0;
////////////SIGNUP VERIFICATIONS////////
        "signupVerification" == $stateParams.type && $http.get(root_url + "api/user/emailverification/" + $scope.token)
        .then(function(response) {
            $scope.signup_status = response.data.status;
            $scope.message = response.data.message;
            $scope.show_loader = !1;
            /**"failure" == $scope.signup_status ? telemetryService.eventTrigger({
                event_label: "EMAIL_VERIFICATION",
                event_name: "EMAIL_VERIFICATION"
            }, $scope.signup_status, {
                component_name: "EMAIL_VERIFICATION",
                message: $scope.message
            });: telemetryService.eventTrigger({
                event_label: "EMAIL_VERIFICATION",
                event_name: "EMAIL_VERIFICATION"
            }, $scope.signup_status);**/
        }, function(response) {});

        $scope.login = function() {
            $modal.open({
                templateUrl: "static/client/app/authentication/intro-authentication.html",
                controller: "AuthenticationController",
                windowClass: "renewed-modal-form"
            })
        };
////////////RESETPASSWORD/////////////
        "resetPassword" == $stateParams.type && $http.get(root_url + "api/resetpassword/" + $scope.token).then(function(response) {
            $scope.rpstatus = response.data.status;
            $scope.show_loader = !1;
           /** "success" != response.data.status ? ($scope.message = response.data.message; telemetryService.eventTrigger({
                event_label: "RESET_PASSWORD_TOKEN",
                event_name: "RESET_PASSWORD_TOKEN"
            }, $scope.rpstatus, {
                component_name: "RESET_PASSWORD_TOKEN",
                message: $scope.message
            })) : telemetryService.eventTrigger({
                event_label: "RESET_PASSWORD_TOKEN",
                event_name: "RESET_PASSWORD_TOKEN"
            }, $scope.rpstatus)**/
        }, function(response) {});

        $scope.resetPassword = function() {
            $scope.$broadcast("show-errors-check-validity");
            $scope.passwordForm.$valid 
            ?
                ($scope.start_event = (new Date).getTime(); 
                $scope.user.new_password.trim() == $scope.user.confirm_password.trim() 
                ? $http.put(root_url + "api/resetpassword/" + $scope.token,
                        $httpParamSerializer({
                            password: $scope.user.new_password
                        }))
                    .then(function(response) {
                        $scope.show_loader = !1;
                        $scope.rppoststatus = response.data.status;
                        $scope.rpmessage = response.data.message;
                        $scope.show_login = !0;
                        $scope.processed_time = (new Date).getTime() - $scope.start_event;
                        "success" == $scope.rppoststatus ? ($("#resetPasswordForm").hide())
                        /**    telemetryService.eventTrigger({
                            event_label: "RESET_PASSWORD",
                            event_name: "RESET_PASSWORD",
                            load_duration: $scope.processed_time
                        }, $scope.rppoststatus);) **/
                        : 
                       /** telemetryService.eventTrigger({
                            event_label: "RESET_PASSWORD",
                            event_name: "RESET_PASSWORD",
                            load_duration: $scope.processed_time
                        }, $scope.rppoststatus, {
                            component_name: "RESET_PASSWORD",
                            message: $scope.rpmessage
                        }) **/
                    }, function(response) {});

                    : ($scope.rppoststatus = "failure"; 
                        $scope.rpmessage = $rootScope.passwordMatch; 
                       /** telemetryService.eventTrigger({
                            event_label: "RESET_PASSWORD",
                            event_name: "RESET_PASSWORD"
                        },
                        $scope.rppoststatus, {
                            component_name: "RESET_PASSWORD",
                            message: $rootScope.passwordMatch
                        })**/)) 
            :   /**    ($scope.passwordForm.newPassword.$error.required && telemetryService.eventTrigger({
                    event_label: "RESET_PASSWORD",
                    event_name: "RESET_PASSWORD"
                }, "failure", {
                    component_name: "RESET_PASSWORD",
                    message: $rootScope.emptyPassword
                }); $scope.passwordForm.newPassword.$error.minlength && telemetryService.eventTrigger({
                    event_label: "RESET_PASSWORD",
                    event_name: "RESET_PASSWORD"
                }, "failure", {
                    component_name: "RESET_PASSWORD",
                    message: $rootScope.validPassword
                }); $scope.passwordForm.confirmPassword.$error.required && telemetryService.eventTrigger({
                    event_label: "RESET_PASSWORD",
                    event_name: "RESET_PASSWORD"
                }, "failure", {
                    component_name: "RESET_PASSWORD",
                    message: $rootScope.emptyConfirmPassword
                })) **/
        };
////////////SUBSCRIBE///////
        "subscribe" == $stateParams.type && $http.get(root_url + "api/subscribe/emailverification/" + $scope.token)
            .then(function(response) {
                $scope.show_loader = !1;
                $scope.sbstatus = response.data.status;
                $scope.sbmessage = response.data.message;
            }, function(response) {});
///////////INVITE///////////
        if ("invite" == $stateParams.type) {
            var userAgent = $window.navigator.userAgent; - 1 !== userAgent.search(/iPhone/i) ? window.location.href = "tvfplay://api/invite/emailverification/" + $scope.token + "/" + $stateParams.episode_id : $http.get(root_url + "api/invite/emailverification/" + $scope.token + "/" + $stateParams.episode_id).then(function(response) {
                $scope.show_loader = !1;
                if ("success" == response.data.status) {
                    $scope.info = response.data.info;
                    if ("series" == $scope.info.type) {
                        $rootScope.source = "general";
                        $rootScope.from_invite = !0;
                        $rootScope.expire_time_from_invite = $scope.info.expiry_time;
                        var url = "/episode/" + $scope.info.category_id + "/" + $scope.info.series_id + "/" + $scope.info.season_id + "/" + $scope.info.episode_id;
                        $location.url(url);
                    }
                } else {
                    $scope.login();
                    $rootScope.source = "invite";
                    $rootScope.i_token = $scope.token;
                    $rootScope.i_e_id = $stateParams.episode_id;
                }
            }, function(response) {});
        }
    });