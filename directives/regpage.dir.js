.directive("registrationPage", function(telemetryService) {
    return {
        link: function(scope, el, attrs) {
            auth_page = "REGISTRATION_PAGE", telemetryService.eventTrigger({
                event_label: "REGISTRATION_VIEW",
                event_name: "REGISTRATION_VIEW"
            }, "success")
        }
    }
})