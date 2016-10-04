angular.module("tvfPlayApp")
.controller("PaymentController", function($scope, $http, $stateParams, $location, $rootScope, $httpParamSerializer, $modal, $modalInstance, telemetryService) {
    
    console.log($stateParams.type); 
    $scope.coupon_status = !1;
    var modalInstance;

    $http.get(root_url + "api/payment/recent/order").then(function(response) {
        $scope.status = response.data.status; 
        $scope.message = response.data.message; 
        $scope.category_id = response.data.category_id; 
        $scope.series_id = response.data.series_id; 
        $scope.season_id = response.data.season_id; 
        $scope.episode_id = response.data.episode_id; 
        $scope.series_name = response.data.series_name; 
        $scope.amount = response.data.txn_amount; 
        $scope.order_id = response.data.order_id; 

        "success" == $scope.status 
	        ? ($scope.load_coupon(); 
	        	fbq("track", "Purchase", {
	            value: response.data.txn_amount,
	            currency: "INR"
	        }); 
	        	"function" == typeof window.google_trackConversion && window.google_trackConversion({
	            google_conversion_id: 960345609,
	            google_custom_params: {
	                page: "Transaction Page",
	                status: "success"
	            },
	            google_remarketing_only: !0
	        }); 
	        	telemetryService.eventTrigger({
	            event_label: "PAYMENT",
	            event_name: "COMPLETED",
	            meta_data: $scope.series_id
	        }, "success", void 0, {
	            series_name: $scope.series_name
	        });) 
	        : (fbq("track", "Purchase", {
	            value: "0",
	            currency: "INR"
	        }); 
	        "function" == typeof window.google_trackConversion && window.google_trackConversion({
	            google_conversion_id: 960345609,
	            google_custom_params: {
	                page: "Transaction Page",
	                status: "failure"
	            },
	            google_remarketing_only: !0
	        }); 
	        telemetryService.eventTrigger({
	            event_label: "PAYMENT",
	            event_name: "COMPLETED",
	            meta_data: $scope.series_id
	        }, "failure", {
	            component_name: "PAYMENT",
	            message: $scope.message
	        }, {
	            series_name: $scope.series_name,
	            order_id: $scope.order_id
	        });); 
        ga("send", "event", "Payment:completed:" + $scope.status + "-" + $scope.series_name, "Payment:completed:" + $scope.status + "-" + $scope.series_name)
    }, function(response) {}); 

    $scope.playEpisode = function() {
        $location.path("episode/" + $scope.category_id + "/" + $scope.series_id + "/" + $scope.season_id + "/" + $scope.episode_id); 
        telemetryService.eventTrigger({
            event_label: "COUPON",
            event_name: "SKIPPED",
            meta_data: $scope.series_id
        }, "success");
    }

    $scope.homePage = function() {
        $location.path("/")
    }

    $scope.know_more = function(coupon) {
        $scope.selected_coupon = coupon, modalInstance = $modal.open({
            templateUrl: "static/client/app/static_pages/know_more.html",
            controller: "StaticController",
            windowClass: "modal-form modal-flat",
            scope: $scope
        })
    }

    $scope.cancel = function() {
        $modalInstance.dismiss("cancel")
    }

    $scope.setSelectedCoupon = function(coupon_id) {
        $scope.selected_coupon_id = coupon_id, $scope.select_coupon = !1
    }

    $scope.load_coupon = function() {
        $http.get(root_url + "api/offers/series/" + $scope.category_id + "/" + $scope.series_id).then(function(response) {
            if ("success" == response.data.status) {
                $scope.coupon_list = [], $scope.offers = response.data.offers, $scope.skip_enabled = response.data.skip_enabled, $scope.series_name = response.data.series_name, $scope.details = response.data, $rootScope.offers_help_url = response.data.offers_help_url;
                for (var i = 0; i <= response.data.offers.length; i += 2) $scope.coupon_list.push($scope.offers.slice(i, i + 2))
            }
        }, function(response) {})
    }

    $scope.get_email = function() {
        $scope.from_retrieve_email = !0, modalInstance = $modal.open({
            templateUrl: "static/client/app/static_pages/retrieve_email.html",
            controller: "StaticController",
            windowClass: "modal-form modal-profile",
            scope: $scope
        })
    }

    $scope.triggerCoupon = function(email) {
        if (void 0 == $scope.selected_coupon_id) 
        	$scope.select_coupon = !0, $scope.error_message = "Please select a coupon";
        else {
            var data = {
                order_id: $scope.order_id,
                coupon_id: $scope.selected_coupon_id,
                email: email
            };
            $http.post(root_url + "api/payment/coupon", $httpParamSerializer(data)).then(function(response) {
                $scope.message = response.data.message; 
                "success" == response.data.status 
                ? ($scope.coupon_status = !0; 
                	telemetryService.eventTrigger({
                    event_label: "COUPON",
                    event_name: "SELECTED",
                    meta_data: $scope.series_id
                }, "success", void 0, {
                    order_id: $scope.order_id,
                    selected_coupon_id: $scope.selected_coupon_id,
                    series_id: $scope.series_id
                }); 
                	void 0 != modalInstance && modalInstance.dismiss("cancel")) 
                : ($scope.select_coupon = !0; 
                	$scope.error_message = response.data.message; 
                	400 == response.data.resp_code && $scope.get_email(); 
                	telemetryService.eventTrigger({
                    event_label: "COUPON",
                    event_name: "SELECTED",
                    meta_data: $scope.series_id
                }, "failure", {
                    component_name: "COUPON",
                    message: $scope.message
                }, {
                    order_id: $scope.order_id,
                    selected_coupon_id: $scope.selected_coupon_id,
                    series_id: $scope.series_id
                }))
            }, function(response) {})
        }
    }
});