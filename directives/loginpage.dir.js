.directive("loginPage", function(telemetryService) {
    return {
        link: function(scope, el, attrs) {
            auth_page = "LOGIN_PAGE", telemetryService.eventTrigger({
                event_label: "LOGIN_VIEW",
                event_name: "LOGIN_VIEW"
            }, "success")
        }
    }
})