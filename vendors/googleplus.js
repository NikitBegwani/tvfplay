angular.module("googleplus", [])
    .provider("GooglePlus", [function() {
        var options = {};
        options.clientId = null, this.setClientId = function(clientId) {
            return options.clientId = clientId, this
        }, this.getClientId = function() {
            return options.clientId
        }, options.apiKey = null, this.setApiKey = function(apiKey) {
            return options.apiKey = apiKey, this
        }, this.getApiKey = function() {
            return options.apiKey
        }, options.scopes = "https://www.googleapis.com/auth/plus.login", this.setScopes = function(scopes) {
            return options.scopes = scopes, this
        }, this.getScopes = function() {
            return options.scopes
        }, this.init = function(customOptions) {
            angular.extend(options, customOptions)
        }, this.enableServerSide = function() {
            options.accessType = "offline", options.responseType = "code token id_token gsession"
        }, this.disableServerSide = function() {
            delete options.accessType, delete options.responseType
        }, this.$get = ["$q", "$rootScope", "$timeout", function($q, $rootScope, $timeout) {
            var deferred, NgGooglePlus = function() {};
            return NgGooglePlus.prototype.login = function() {
                deferred = $q.defer();
                var authOptions = {
                    client_id: options.clientId,
                    scope: options.scopes,
                    immediate: !1
                };
                return options.accessType && options.responseType && (authOptions.access_type = options.accessType, authOptions.response_type = options.responseType), gapi.auth.authorize(authOptions, this.handleAuthResult), deferred.promise
            }, NgGooglePlus.prototype.checkAuth = function() {
                gapi.auth.authorize({
                    client_id: options.clientId,
                    scope: options.scopes,
                    immediate: !0
                }, this.handleAuthResult)
            }, NgGooglePlus.prototype.handleClientLoad = function() {
                gapi.client.setApiKey(options.apiKey), gapi.auth.init(function() {}), $timeout(this.checkAuth, 1)
            }, NgGooglePlus.prototype.handleAuthResult = function(authResult) {
                authResult && !authResult.error ? (deferred.resolve(authResult), $rootScope.$apply()) : deferred.reject("error")
            }, NgGooglePlus.prototype.getUser = function() {
                var deferred = $q.defer();
                return gapi.client.load("oauth2", "v2", function() {
                    gapi.client.oauth2.userinfo.get().execute(function(resp) {
                        deferred.resolve(resp), $rootScope.$apply()
                    })
                }), deferred.promise
            }, NgGooglePlus.prototype.getToken = function() {
                return gapi.auth.getToken()
            }, NgGooglePlus.prototype.setToken = function(token) {
                return gapi.auth.setToken(token)
            }, NgGooglePlus.prototype.logout = function() {
                gapi.auth.signOut()
            }, new NgGooglePlus
        }]
    }])
    .run([function() {
        var po = document.createElement("script");
        po.type = "text/javascript", po.async = !0, po.src = "https://apis.google.com/js/client.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(po, s)
    }]);