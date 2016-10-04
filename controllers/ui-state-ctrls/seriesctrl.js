angular.module("tvfPlayApp").controller("SeriesController", function($scope, $http, $stateParams, $location, $rootScope, $document, telemetryService) {
    $scope.initial_load_series = 1;
    session_start_time = (new Date).getTime();
    $scope.checked = !0;
    $scope.series_view = !1;
    $scope.sliders = ["1"];
    $scope.sort_order = "desc";
    $scope.mouseover_id = 0;
    $scope.seasons_sort_order = {};
    $scope.currentUrl = $location.absUrl();
    $scope.category_id = $stateParams.category_id;
    $scope.seriesId = $stateParams.series_id;
    $scope.season_id = $stateParams.season_id;
    $scope.ratings = 1;
    $scope.episode_page_no = 1;
    $scope.episode_per_page = 8;
    $scope.extras_selected = !1;
    void 0 != $rootScope.isMobile.Android();
    $document.bind("scroll", function() {
            void 0 != $scope.series && 1 == $scope.series.show_banner_and_html && ($(this).scrollTop() > $(".series-page").offset().top - 60 ? $(".season-panel").addClass("fixed") : $(".season-panel").removeClass("fixed"))
    });
    $scope.populate_data = function(response) {
        if ("02" == response.data.resp_code) {
            $location.path("/not-available-in-your-location");
        }

        if ("404" == response.data.resp_code) {
            $location.path("/404");
        };

        if (1 == response.data.page) {
            void 0 == $scope.season_id ? (angular.forEach(response.data.seasons, function(item) {
                    $scope.seasons_sort_order[item.season_id] = "desc"
                });) :
                ($scope.initial_load_series = 0; 
                    $scope.series = response.data; 
                    $scope.episodes = response.data.episodes; 
                    $scope.seasons = response.data.seasons; 
                    $scope.season_id = response.data.season_id; 
                    $scope.season_name = $scope.series.name; 
                    $scope.episode_page_no = parseInt(response.data.page); 
                    0 == $scope.series.show_banner_and_html 
                    || void 0 == $scope.series.show_banner_and_html 
                    || null == $scope.series.show_banner_and_html 
                    ? $scope.series.show_banner_and_html = !1 
                    : $scope.series.show_banner_and_html = !0; 
                    $scope.checked = !0; 
                    $scope.initial_load_series = 0)
        } else {
            angular.forEach(response.data.episodes, function(item) {
                $scope.episodes.push(item)
            });
            $scope.end_of_page = response.data.end_of_page;
            $scope.loadmore = "1" != $scope.end_of_page;
            $scope.submitted = !1;
        }
    };
    $scope.retrieveSeries = function(parameters) {
        $scope.extras_selected = !1;
        $(".season-menu").toggle();
        $http.get(root_url + "api/season/" + parameters + "/" + (void 0 == $scope.sort_order ? "desc" : $scope.sort_order))
            .then(function(response) {
                $scope.populate_data(response)
            }, function(response) {})
    };
    $scope.extras_series = function() {
        $scope.checked = !1;
        $scope.extras_selected = !0;
        $(".season-menu").toggle();
        $http.get(root_url + "api/extras/" + $scope.category_id + "/" + $scope.seriesId + "/1/50")
            .then(function(response) {
                $scope.populate_data(response),
                    document.body.scrollTop > $(".series-page").offset().top && $("html, body").animate({
                        scrollTop: $(".series-page").offset().top - 60 + 2
                    }, "slow")
            }, function(response) {})
    };
    $(".season-menu").toggle();
    $(".togglebtn").click(function() {
        $(this).next().toggle()
    });
    $scope.retrieve_series_or_season = function(season_id, sort_order) {
        $scope.season_id != season_id && ($scope.checked = !1);
        $scope.season_id = season_id;
        $scope.sort_order = sort_order;
        $scope.seasons_sort_order[$scope.season_id] = $scope.sort_order;
        "extras" == $scope.season_id ? $scope.extras_series() : 1 == $scope.loadmore_section ? $scope.retrieveSeries($scope.category_id + "/" + $scope.seriesId + "/" + $scope.season_id + "/" + $scope.episode_page_no + "/" + $scope.episode_per_page) : ($scope.retrieveSeries($scope.category_id + "/" + $scope.seriesId + "/" + (void 0 == $scope.season_id ? "" : $scope.season_id + "/") + "1/" + $scope.episode_per_page),
            void 0 != $scope.season_id && document.body.scrollTop > $(".series-page").offset().top && $("html, body").animate({
                scrollTop: $(".series-page").offset().top - 60 + 2
            }, "slow"));
        $scope.loadmore_section = !1;
    };
    $scope.retrieve_series_or_season($scope.season_id);
    $scope.loadMore = function(season_id) {
        $scope.season_id = season_id;
        $scope.loadmore_section = !0;
        0 == $scope.end_of_page && ($scope.submitted = !0; $scope.episode_page_no++; $scope.retrieve_series_or_season($scope.season_id, $scope.seasons_sort_order[$scope.season_id]);
            )
    };
    $scope.max = 100;
    $scope.navigate_to_episode = function() {
        $location.path("/episode/" + $scope.series.category_id + "/" + $scope.series.series_id + "/" + $scope.series.season_id)
    };
    $scope.parseJson = function(casting_fields) {
        return JSON.parse(casting_fields)
    };
    $scope.watchEpisode = function() {
        $location.url("/episode/" + $scope.category_id + "/" + $scope.series.series_id + "/" + $scope.season_id)
    };
    $scope.$on("$destroy", function() {
        $document.unbind("scroll"), $scope.$broadcast("telemetryTrigger", {})
    });
    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - session_start_time,  
        referred_meta_data = $scope.season_id, 
        referred_event_label = "SEASON_PAGE", 
        referred_event_name = $scope.season_name
    });
});