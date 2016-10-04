angular.module("tvfPlayApp")
.controller("CategoryController", function($scope, $http, $modal, $stateParams, $window, $location, $rootScope, $compile, telemetryService) {

	session_start_time = (new Date).getTime();
    $scope.category_id = $stateParams.id; 
    $scope.category_page_no = 1; 
    $scope.seriesArray = []; 
    $scope.series_page_number = 1; 
    $scope.current_page = 1; 
    $scope.series_array = [], 
    void 0 != $rootScope.isMobile.Android();
    var w = angular.element($window);

    w.bind("resize", function() {
        $scope.$apply()
    }); 

    $scope.$watch(function() { return $window.innerWidth }, function(value) {
        switch ($scope.windowWidth = value, !0) {
            case $scope.windowWidth > 992:
                $scope.view_series_per_load = 6, $scope.series_per_page = 12, $scope.col_class = "col-md-2";
                break;
            case $scope.windowWidth <= 992 && $scope.windowWidth > 500:
                $scope.view_series_per_load = 3, $scope.series_per_page = 6, $scope.col_class = "col-sm-4";
                break;
            default:
                $scope.view_series_per_load = 2, $scope.series_per_page = 4, $scope.col_class = "col-xs-6"
        }
    });

    $scope.$watch("$viewContentLoaded", function() {
        retrieveCategories()
    });

    $scope.$on("$destroy", function() {
        $scope.$broadcast("telemetryTrigger", {})
    });

    $scope.parseSeriesArray = function(series) {
        for (var i = 0; i <= series.length; i += $scope.view_series_per_load) 
        	i != series.length && $scope.seriesArray.push(series.slice(i, i + $scope.view_series_per_load))
    };

    $scope.watchEpisode = function(details) {
        $location.url("/episode/" + details.category_id + "/" + details.series_id + "/" + details.season_id)
    };  

    $scope.loadmore = function() {
        var total_pages = parseInt($scope.category.total_pages);
        $scope.submitted = !0, parseInt($scope.current_page) < total_pages && ($scope.current_page = $scope.current_page + 1, $http.get(root_url + "api/series/" + $scope.category.category_id + "/" + parseInt($scope.current_page) + "/" + $scope.series_per_page).then(function(response) {
            $scope.parseSeriesArray(response.data.category.series), $scope.end_of_page = response.data.category.end_of_page, $scope.submitted = !1, telemetryService.eventTrigger({
                event_label: "LOAD_MORE",
                event_name: $scope.category.name,
                meta_data: $scope.category.category_id
            }, "success")
        }, function(response) {}))
    }; 

    var retrieveCategories = function() {
        $http.get(root_url + "api/category/" + parseInt($scope.category_id) + "/" + parseInt($scope.category_page_no) + "/" + $scope.series_per_page)
        .then(function(response) {
            0 !== Object.getOwnPropertyNames(response.data.category).length 
            ? ($scope.category = response.data.category; 
            	$scope.slide = $scope.category.banner; 
            	$scope.parseSeriesArray($scope.category.series); 
            	$scope.series_array = $scope.series_array.concat(response.data.category.series); 
            	$scope.end_of_page = response.data.category.end_of_page; 
            	telemetryService.eventTrigger({
	                event_label: "CATEGORY",
	                event_name: $scope.category.name,
	                meta_data: $scope.category.category_id
	            	}, "success"); 
            	$scope.generateHighlightRedirectURL = function(series, category) {
                var url = "";
                return url = 1 == series.number_of_episodes ? "/episode/" + category.category_id + "/" + series.series_id + "/" + series.season_id : "series" == series.type ? "/category/" + category.category_id + "/series/" + series.series_id : "/#/episode/" + category.category_id + "/" + series.episode_id
            }) 
            : "02" == response.data.resp_code 
            	? ($location.path("/not-available-in-your-location"); telemetryService.eventTrigger({
                event_label: "CATEGORY",
                event_name: $scope.category.name,
                meta_data: $scope.category.category_id
            }, "failure", {
                component_name: "CATEGORY",
                message: "REGION_RESTRICT"
            }, {
                category_name: $scope.category.name
            });): ($location.path("/404"); telemetryService.eventTrigger({
                event_label: "CATEGORY",
                event_name: $scope.category.name
            }, "failure", {}
                component_name: "CATEGORY",
                message: "CATEGORY_NOT_FOUND"
            }, {
                category_name: $scope.category.name
            });)
        }, function(response) {})
    };

    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - session_start_time, telemetryService.eventTrigger({
            event_label: "CATEGORY_PAGE",
            event_name: $scope.category.name,
            meta_data: $scope.category_id,
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), referred_meta_data = $scope.category_id, referred_event_label = "CATEGORY_PAGE", referred_event_name = $scope.category.name
    }); 
});