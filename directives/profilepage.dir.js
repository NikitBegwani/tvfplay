.directive("profilePage", function(telemetryService) {
    return {
        link: function(scope, el, attrs) {
            telemetryService.eventTrigger({
                event_label: "PROFILE_VIEW",
                event_name: "PROFILE_VIEW"
            }, "success")
        }
    }
})