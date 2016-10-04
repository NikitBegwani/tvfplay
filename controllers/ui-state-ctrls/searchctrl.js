angular.module("tvfPlayApp")
.controller("SearchController", function($scope, $http, $location, $modalInstance, $stateParams, $window, $timeout, telemetryService) {
    var timeout;
    $scope.session_start_time = (new Date).getTime(); 
    $timeout.cancel(timeout); 
    "error" == $stateParams.type && (timeout = $timeout(function() {
        $window.location.assign("/")
    }, 6e3));
    var queryResult = {};
    $scope.suggestions = [];
    var searchMap = {};
    $scope.errorForm = !1; 
    $scope.cancel = function() {
        void 0 == $modalInstance.length && $modalInstance.dismiss("cancel")
    }; 
    $scope.search = function() {
        void 0 == $modalInstance && $modalInstance.dismiss("cancel"); 
        $location.path("/search/" + $scope.user.search)
    }; 
    $scope.updateQuery = function(typed) {
        typed.length > 2 
        ? ($scope.errorForm = !1, $scope.searcherror = "", 
        	$http.get(root_url + "api/search/autocomplete/" + typed).then(function(response) {
            var searchData = [];
            queryResult = response.data.result;
            for (var data in queryResult) 
            	searchData.push(queryResult[data].name), 
            	searchMap[queryResult[data].name] = queryResult[data];
            $scope.suggestions = searchData;
        }, function(response) {})) 
        : ($scope.errorForm = !0, $scope.searcherror = "Please enter atleast 3 characters", $scope.suggestions = [])
    }; 
    $scope.callQuery = function(suggestion) {
        telemetryService.eventTrigger({
            event_label: "SEARCH",
            event_name: "AUTOCOMPLETE"
        }, "success", void 0, {
            search_text: $scope.searchQuery,
            suggestion: suggestion
        }); 
        $scope.searchQuery = ""; 
        $location.path("/category/" + searchMap[suggestion].category_id + "/series/" + searchMap[suggestion].series_id); 
        $scope.cancel();
    }; 
    $scope.callSearch = function() {
        $scope.searchQuery ? $scope.searchQuery.length < 3 ? ($scope.errorForm = !0, $scope.searcherror = "Please enter atleast 3 characters") : ($location.path("/search/" + $scope.searchQuery), $scope.cancel()) : ($scope.errorForm = !0, $scope.searcherror = "Please enter a keyword")
    }; 
    $scope.$on("$destroy", function() {
        $timeout.cancel(timeout), time_spent_by_user = (new Date).getTime() - $scope.session_start_time, telemetryService.eventTrigger({
            event_label: "SEARCH_PAGE",
            event_name: "SEARCH_PAGE",
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), referred_meta_data = "", referred_event_label = "SEARCH_PAGE", referred_event_name = "SEARCH_PAGE", session_start_time = (new Date).getTime()
    })
}),