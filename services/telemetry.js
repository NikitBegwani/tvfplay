 angular.module("tvfPlayApp").service("telemetryService", function($timeout, $q) {
    this.eventTrigger = function(event, status, exception, custom_params) {
        try 
        {
            var defer = $q.defer();
            $timeout(function() {
                if (event.event_name != event.referred_event_name) 
                    {
                        form_telemetry_data(), 
                        $.extend(telemetry_data, { event: event }), 
                        $.extend(telemetry_data, { status: status }), 
                        $.extend(telemetry_data, { exception: exception }), 
                        $.extend(telemetry_data, { custom_params: custom_params }), 
                        if (void 0 == event.time_spent_by_user || event.time_spent_by_user < 36e5) 
                            telemetry_feed(telemetry_data);
                        if (void 0 != event.referred_event_name && "" == event.referred_event_name) 
                         {
                            warm_launch_data = telemetry_data, 
                            $.extend(warm_launch_data, {event: {event_label: "INITIAL_LOAD_WEBSITE",
                                                                event_name: "INITIAL_LOAD_WEBSITE",
                                                                load_duration: warm_launch_time }}), 
                            telemetry_feed(warm_launch_data)
                        }
                    } 
                defer.resolve("data received!")
            })//timeout ends
        } catch (error) {
            console.log("error:  " + error.message)
        }
        return defer.promise
    }
});

function form_telemetry_data() {
    var OSName = "Unknown"; 
    - 1 != navigator.appVersion.indexOf("Win") && (OSName = "Windows"), 
    -1 != navigator.appVersion.indexOf("Mac") && (OSName = "Mac"), 
    -1 != navigator.appVersion.indexOf("X11") && (OSName = "Unix"), 
    -1 != navigator.appVersion.indexOf("Linux") && (OSName = "Linux"), 
    telemetry_data = {
        product_code: "TVFPLAY",
        log_origin: null == isMobile.any() || void 0 == isMobile.any() ? "web_desktop" : "web_mobile",
        client_timestamp: get_utc_time(),
        schema_version: "1.0",
        http_referral: window.location.hostname,
        platform_web: {
            screen_resolution: "{" + screen.width + ", " + screen.height + "}"
        },
        user: {
            user_id: "" == getCookie("auth_token") ? "undefined" : getCookie("auth_token"),
            device_id: "" == device_id ? dynamic_id : device_id,
            session_id: session_cookie(),
            timezone: getTimeZone()
        }
    }
}

function telemetry_feed(telemetry_data) {
    try {
        $.ajax({
            url: telemetry_url + "/telemetry/events",
            type: "POST",
            data: JSON.stringify(telemetry_data),
            contentType: "text/plain",
            success: function(data) {}
        })
    } catch (error) {
        console.log("error:  " + error.message)
    }
}