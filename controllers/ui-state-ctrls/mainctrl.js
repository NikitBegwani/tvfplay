angular.module("tvfPlayApp").controller("MainCtrl", 
    function($scope, $http, $modal, $window, $rootScope, $compile, $location, telemetryService) {

    session_start_time = (new Date).getTime();

    $scope.categories = [];

    $scope.page = "main";

    $scope.category_page_no = 1;

    $scope.seriesArray = {};

    $scope.category_page_number_slider = {};

    $scope.group_page_number_slider = {};

    $scope.max = 5;

    var w = angular.element($window);

    w.bind("resize", function() {
        $scope.$apply()
    });

    $http.get(root_url + "api/gethomebanners").success(function(sliders) {
        $scope.sliders = [], 
        $rootScope.vouchers = sliders.vouchers, 
        $scope.temporary_slider = [], 
        $scope.main_sliders = sliders.seasons.length, 
        $rootScope.isMobile.any() || ($scope.temporary_slider = []), 
        $scope.sliders = sliders.seasons.concat($scope.temporary_slider), 
        $scope.myInterval = 2e4
    });

    $scope.generateHighlightRedirectURL = function(series, category) {
        var url = "";
        return url = 
        1 == series.number_of_episodes 
            ? "/episode/" + category.category_id + "/" + series.series_id + "/" + series.season_id 
            : 
                "series" == series.type 
                    ? "/category/" + category.category_id + "/series/" + series.series_id 
                    : "/#/episode/" + category.category_id + "/" + series.episode_id
    }; 

    $scope.watchEpisode = function(details) {
        $location.url("/episode/" + details.category_id + "/" + details.series_id + "/" + details.season_id)
    };

    var retrieveCategories = function() {
        $http.get(root_url + "api/home/" + parseInt($scope.category_page_no) + "/" + $scope.category_per_page)
        .then(function(response) {
            $scope.categories = response.data.categories, 
            $scope.inboxes = response.data.inboxes, 
            $scope.series_array = [], 
            angular.forEach($scope.categories, function(item) {
                "category" == item.type || "inbox" == item.type 
                    ? ($scope.seriesArray[item.category_id] = void 0 == $scope.seriesArray[item.category_id] 
                                                                ? [] 
                                                                : $scope.seriesArray[item.category_id], 
                        $scope.category_page_number_slider[item.category_id] = item.page, 
                        $scope.seriesArray[item.category_id] = $scope.seriesArray[item.category_id].concat(item.series)) 
                    : ($scope.seriesArray["group_" + item.group_id] = void 0 == $scope.seriesArray["group_" + item.group_id] 
                                                                        ? [] 
                                                                        : $scope.seriesArray["group_" + item.group_id], 
                        $scope.group_page_number_slider[item.group_id] = item.page, 
                        $scope.seriesArray["group_" + item.group_id] = $scope.seriesArray["group_" + item.group_id].concat(item.series))
            }), 
            angular.forEach($scope.inboxes, function(item) {})
        }, function(response) {})
    };

    $scope.latestEpisodeORSignup = function(slide, action) {
        $scope.episode_id = "0" == slide.episode_id 
                            ? "" 
                            : "/" + slide.episode_id, 
        $location.path("/episode/" + slide.category_id + "/" + slide.series_id + "/" + slide.season_id + $scope.episode_id)
    }; 

    $scope.signup = function() {
        $modal.open({
            templateUrl: "static/client/app/authentication/intro-authentication.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form",
            backdrop: "static",
            keyboard: !1
        })
    };

    $scope.navigate_to_custom_url = function(slide) {
        console.log(slide.is_sign_up_banner), 
        1 != slide.is_sign_up_banner ? $location.path(slide.custom_url) : $scope.signup()
    }; 

    $scope.categoryPage = function(category_id) {
        $location.path("/category/" + category_id)
    };

    //WATCH
    $scope.$watch("$viewContentLoaded", function() {
        retrieveCategories()
    });

    //On resize
    $scope.$watch(function() { return $window.innerWidth }, function(value) {
        $scope.windowWidth = value, 
        $scope.category_per_page = 4, 
        $scope.series_per_page = 4, 
        $scope.windowWidth > 1500 
            ? 
                ($scope.number_of_series_per_category = 12, $scope.category_per_page = 24, $scope.series_per_page = 24) 
            : $scope.windowWidth > 992 
                ? ($scope.number_of_series_per_category = 7, $scope.category_per_page = 14, $scope.series_per_page = 14) 
                : $scope.windowWidth <= 992 && $scope.windowWidth > 768 
                    ? $scope.number_of_series_per_category = 12 
                    : $scope.number_of_series_per_category = 12
    });

    //On Events
    $scope.$on("event:next:owl", function(event, category) {
        if (void 0 != category) 
        {
            var total_pages = parseInt(category.total_pages),
                current_page = "category" == category.type || "inbox" == category.type 
                                ? parseInt($scope.category_page_number_slider[category.category_id]) 
                                : parseInt($scope.group_page_number_slider[category.group_id]);
            if (total_pages > current_page) {
                var api_url, owl_carousel_id;

                "category" == category.type || "inbox" == category.type

                    ? ($scope.category_page_number_slider[category.category_id] = parseInt(current_page + 1), 
                        api_url = root_url + "api/series/" + category.category_id + "/" + parseInt(current_page + 1) + "/" + $scope.series_per_page, 
                        owl_carousel_id = "#owl-category-" + category.category_id) 

                    : ($scope.group_page_number_slider[category.group_id] = parseInt(current_page + 1), 
                        api_url = root_url + "api/series/group/" + category.group_id + "/" + parseInt(current_page + 1) + "/" + $scope.series_per_page, 
                        owl_carousel_id = "#owl-group-" + category.group_id), 

                $http.get(api_url).then(function(response) {

                    angular.forEach(response.data.category.series, function(value, key) {
                        image = "portrait" == response.data.category.orientation 
                                ? value.a4_series_image_url 
                                : value.thumbnail_image_url, 
                        class_name = "portrait" == response.data.category.orientation 
                                        ? "cat-carousel-image" 
                                        : "";
                        var random_temp = $rootScope.generate_string();
                        $(owl_carousel_id).trigger("add.owl.carousel", [$compile('<div class="owl-item"> <a class="series-link-wrapper" href=' + $rootScope.generateSeriesRedirectURL(value, response.data.category) + ">                                      <img imageonload class = " + class_name + ' class="img-responsive" src=' + image + ' alt="" id=' + random_temp + '>                                      <span class="series-link-overlay"><i class="nc-icon-glyph media-1_button-play text-primary"></i></span>                                      <span class="loading-icon" id=loader_' + random_temp + '></span>                                    </a>                                    <h4 class="text-left hidden">' + value.name + '<br><span ng-show="show_air_date()==1" class="text-muted">' + value.created_at + "</span></h4>                                    </div>")($scope)]).trigger("refresh.owl.carousel")
                    })
                    }, function(response) {})
            }
        }
    }); 

    $scope.$on("$destroy", function() {
        $rootScope.activeseries = "0", 
        $scope.$broadcast("telemetryTrigger", {})
    }); 

    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - session_start_time, 
        telemetryService.eventTrigger({
            event_label: "HOME_PAGE",
            event_name: "HOME_PAGE",
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), 
        referred_meta_data = "", 
        referred_event_label = "HOME_PAGE", 
        referred_event_name = "HOME_PAGE"
    });

    telemetryService.eventTrigger( { event_label: "HOME", event_name: "HOME" } , "success");
});