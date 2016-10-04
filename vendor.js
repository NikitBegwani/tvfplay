function process_response(response) {
    console.log(response);
    var scope_element = $(".auth-form"),
        scope = angular.element(scope_element).scope();
    scope.process_login_response(response), form_telemetry_data()
}

function backScreen() {
    videojs("brightcovePlayer").exitFullscreen();
    var $element = $(".hero-video"),
        scope = angular.element($element).scope();
    scope.back_to_browse(), scope.back_to_browse_clicked = !0
}

function playVideo() {
    videojs("brightcovePlayer").play()
}

function loadedYTScript() {
    var $element = $(".hero-video");
    try {
        var scope = angular.element($element).scope();
        YT && YT.Player && (player = new YT.Player("player", {
            videoId: scope.episode.third_party_id,
            playerVars: {
                autoplay: 1,
                controls: 1,
                enablejsapi: 1,
                origin: root_url,
                start: parseInt(scope.episode.watched_duration),
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                showinfo: 0
            },
            events: {
                onReady: scope.onPlayerReady,
                onStateChange: scope.onPlayerStateChange,
                onPlaybackQualityChange: scope.onPlayerQuaityChange
            }
        }))
    } catch (error) {
        console.log("error: in episode  " + error.message)
    }
}

function onYouTubeIframeAPIReady() {
    loadedYTScript()
}

function onstart(json) {
    var $element = $(".invite_social");
    angular.element($element).scope()
}

function onend(json) {
    var $element = $(".invite_social"),
        scope = angular.element($element).scope();
    scope.onstartGoogle()
}

function link(scope, elem) {
    $(elem).parents(".modal").length && $(elem).on("touchstart", function(e) {
        "INPUT" == $(this).get(0).tagName ? ($(elem).focus(), e.stopPropagation(), e.preventDefault()) : e.stopPropagation()
    })
}

function map_keys(data, loadtime) {
    hash = {};
    try {
        hash.event_label = void 0 == mappings[data.event] ? data.event : mappings[data.event], hash.event_name = void 0 == mappings[data.auth_type] ? data.auth_type : mappings[data.auth_type], hash.load_duration = loadtime
    } catch (error) {
        console.log("error:  " + error.message)
    }
    return hash
}

function generateUUID() {
    var d = (new Date).getTime(),
        uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (d + 16 * Math.random()) % 16 | 0;
            return d = Math.floor(d / 16), ("x" == c ? r : 3 & r | 8).toString(16)
        });
    return uuid
}

function session_cookie() {
    var cookie = getCookie("telemetry-cookie");
    return cookie = 0 == cookie.length ? setCookie("telemetry-cookie", generateUUID()) : setCookie("telemetry-cookie", cookie)
}

function setCookie(cname, cvalue) {
    try {
        var d = new Date;
        d.setTime(d.getTime() + 18e5);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires
    } catch (error) {
        console.log("error:  " + error.message)
    }
    return cvalue
}

function getCookie(name) {
    try {
        var value = "; " + document.cookie,
            token = "",
            parts = value.split("; " + name + "=");
        2 == parts.length && (token = parts.pop().split(";").shift(), token = token.split(":").shift())
    } catch (error) {
        console.log("error:  " + error.message)
    }
    return token
}

function getTimeZone() {
    try {
        var timezone = "";
        timezone = (new Date).toTimeString().split(" ")[1]
    } catch (error) {
        console.log("error:  " + error.message)
    }
    return timezone
}

function get_utc_time() {
    var now = new Date;
    month = now.getUTCMonth() + 1 > 9 ? String(now.getUTCMonth() + 1) : "0" + String(now.getUTCMonth() + 1), day = now.getUTCDate() > 9 ? now.getUTCDate() : "0" + String(now.getUTCDate());
    var utc_timestamp = String(now.getUTCFullYear()) + "-" + String(month) + "-" + String(day) + "T" + String(now.toUTCString().split(" ")[4]);
    return utc_timestamp
}

/////////TVFPLAYAPP////////
    
    
!window.XMLHttpRequest 
|| window.FileAPI && FileAPI.shouldLoad || (window.XMLHttpRequest.prototype.setRequestHeader = function(orig) {
        return function(header, value) {
            if ("__setXHR_" === header) {
                var val = value(this);
                val instanceof Function && val(this)
            } else orig.apply(this, arguments)
        }
    }(window.XMLHttpRequest.prototype.setRequestHeader));

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
    eventer = window[eventMethod],
    messageEvent = "attachEvent" == eventMethod ? "onmessage" : "message";
eventer(messageEvent, function(event) {
    var origin = (event.origin || event.originalEvent.origin) + "/";
    if (origin == secure_root_url || origin == root_url) {
        var response_string = JSON.stringify(eval("(" + event.data + ")")),
            json_response = JSON.parse(response_string);
        process_response(json_response)
    }
}, !1),  
   
var mappings = {
    signin: "LOGIN",
    signup: "REGISTRATION",
    THEVIRALFEVER: "TVF"
};