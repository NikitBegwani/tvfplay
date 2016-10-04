angular.module("tvfPlayApp").config(function(ezfbProvider) {
    ezfbProvider.setInitParams({
        appId: fb_id
    })
}).directive("facebookSignin", function($rootScope, ezfb) {
    return {
        replace: !0,
        restrict: "E",
        link: function(scope, element) {
            element.on("click", function() {
                ezfb.login(function(res) {
                    res.authResponse && $rootScope.$broadcast("event:facebook-signin-success", res.authResponse)
                }, {
                    scope: "email"
                }).then(function(res) {})
            })
        }
    }
});