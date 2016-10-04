angular.module("tvfPlayApp").config(["GooglePlusProvider", function(GooglePlusProvider) {
    GooglePlusProvider.init({
        clientId: google_id,
        scopes: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email"
    })
}]).directive("googleSignin", function($rootScope, GooglePlus) {
    return {
        restrict: "E",
        replace: !0,
        link: function(scope, element) {
            element.on("click", function() {
                GooglePlus.login().then(function(authResult) {
                    $rootScope.$broadcast("event:google-plus-signin-success", authResult, GooglePlus)
                }, function(err) {
                    $rootScope.$broadcast("event:google-plus-signin-failure", err)
                })
            })
        }
    }
}).directive("googlePlus", ["$window", function($window) {
    return {
        restrict: "A",
        scope: {
            googlePlus: "=?"
        },
        link: function(scope, element, attrs) {
            function renderPlusButton() {
                if (!attrs.googlePlus || scope.googlePlus || watchAdded) element.html('<div class="g-plus"' + (scope.googlePlus ? ' data-href="' + scope.googlePlus + '"' : "") + '  data-size="medium" data-annotation="none" data-action="share" data-onstartinteraction="onstart" data-onendinteraction="onend"></div>'), $window.gapi.plus.go(element.parent()[0]);
                else {
                    watchAdded = !0;
                    var unbindWatch = scope.$watch("googlePlus", function(newValue, oldValue) {
                        newValue && (renderPlusButton(), unbindWatch())
                    })
                }
            }
            $window.gapi ? renderPlusButton() : $.getScript("//apis.google.com/js/platform.js", function() {
                renderPlusButton()
            });
            var watchAdded = !1
        }
    }
}]);