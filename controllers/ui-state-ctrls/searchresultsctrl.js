angular.module("tvfPlayApp")
.controller("SearchResultsController", function($scope, $http, $location, $stateParams, telemetryService) {

    $scope.search_text = $stateParams.term; 
    $scope.searchResult = !0; 
    $scope.seriesGroup = {}; 
    $scope.max = 5;
    var perPage = 4;
    $scope.session_start_time = (new Date).getTime(); 

    $scope.generateHighlightRedirectURL = function(series, category) {
        var url = "";
        return url = 1 == series.number_of_episodes ? "/#/episode/" + category.category_id + "/" + series.series_id + "/" + series.season_id 
        : "series" == series.type 
        	? "/#/category/" + category.category_id + "/series/" + series.series_id 
        	: "/#/episode/" + category.category_id + "/" + series.episode_id
    };

    $http.get(root_url + "api/search/" + $scope.search_text).then(function(response) {
        if ($scope.categories = response.data.categories.concat(response.data.inboxes), $scope.categories.length > 0) {
            for (var category in $scope.categories) {
                for (var seriesList = [], seriesLength = $scope.categories[category].series.length, i = 0; seriesLength >= i; i += perPage) seriesList.push($scope.categories[category].series.slice(i, i + perPage));
                $scope.seriesGroup[$scope.categories[category].category_id] = seriesList
            }
            $scope.searchResult = !0, telemetryService.eventTrigger({
                event_label: "SEARCH",
                event_name: "MANUAL"
            }, "success", void 0, {
                search_text: $scope.search_text
            })
        } else $scope.searchResult = !1, $scope.error_message = "Sorry!!! No results found", telemetryService.eventTrigger({
            event_label: "SEARCH",
            event_name: "MANUAL"
        }, "failure", {
            component_name: "SEARCH",
            message: $scope.error_message
        }, {
            search_text: $scope.search_text
        })
    });

    $scope.$on("$destroy", function() {
        $scope.$broadcast("telemetryTrigger", {})
    });

    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - $scope.session_start_time, telemetryService.eventTrigger({
            event_label: "SEARCH_RESULTS_PAGE",
            event_name: "SEARCH_RESULTS_PAGE",
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), referred_meta_data = "", referred_event_label = "SEARCH_RESULTS_PAGE", referred_event_name = "SEARCH_RESULTS_PAGE", session_start_time = (new Date).getTime()
    });
});