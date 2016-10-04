//Ordered by Controller//

//1.StaticController
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("about", {
        url: "/about",
        templateUrl: "static/client/app/static_pages/about.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "about"
        }
    }).state("contact", {
        url: "/contact",
        templateUrl: "static/client/app/static_pages/contact.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "contact"
        }
    }).state("privacy", {
        url: "/privacy-policy",
        templateUrl: "static/client/app/static_pages/privacy_policy.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "privacy"
        }
    }).state("refund", {
        url: "/refund-cancellation",
        templateUrl: "static/client/app/static_pages/refund-cancellation.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "refund"
        }
    }).state("not-available", {
        url: "/not-available-in-your-location",
        templateUrl: "static/client/app/static_pages/not-available-in-your-location.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "not-available"
        }
    }).state("faq", {
        url: "/faq",
        templateUrl: "static/client/app/static_pages/faq.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "faq"
        }
    }).state("coupons", {
        url: "/coupons/:category_id/:series_id",
        templateUrl: "static/client/app/static_pages/coupons.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "coupons"
        }
    }).state("terms", {
        url: "/terms-conditions",
        templateUrl: "static/client/app/static_pages/terms_condition.html",
        controller: "StaticController",
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        },
        params: {
            type: "terms"
        }
    }).state("transaction", {
        url: "/transaction",
        templateUrl: "static/client/app/static_pages/transaction.html",
        controller: "StaticController",
        params: {
            type: "terms"
        }
    }).state("upgrade-browser", {
            url: "/upgrade-browser",
            controller: "StaticController",
            templateUrl: "static/client/app/static_pages/upgrade-browser.html",
            params: {
                from_upgrade_browser: !0
            },
            resolve: {
                $modalInstance: function() {
                    return function() {
                        return modalInstance
                    }
                }
            }
    }).state("install-application", {
            url: "/install-application",
            templateUrl: "static/client/app/static_pages/install-application.html",
            controller: "StaticController",
            resolve: {
                $modalInstance: function() {
                    return function() {
                        return modalInstance
                    }
                }
            }
    })
});

//2.SearchResultsController
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("searchresults", {
        url: "/search/:term",
        templateUrl: "static/client/app/search/search_results.html",
        controller: "SearchResultsController"
    })
});

//3.PaymentController
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("transactionpayment", {
        url: "/transaction",
        templateUrl: "static/client/app/payment/transaction.html",
        controller: "PaymentController",
        params: {
            type: "payment"
        },
        resolve: {
            $modalInstance: function() {
                return function() {
                    return modalInstance
                }
            }
        }
    })
});

//4.SeriesController
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("series", {
        url: "/category/:category_id/series/:series_id",
        templateUrl: "static/client/app/series/series.html",
        controller: "SeriesController"
    }).state("season", {
        url: "/category/:category_id/series/:series_id/season/:season_id",
        templateUrl: "static/client/app/series/series.html",
        controller: "SeriesController"
    })
}); 

//5.EpisodeController
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("seasonepisode", {
        url: "/episode/:category_id/:series_id/:season_id/:episode_id",
        templateUrl: "static/client/app/episode/episode.html",
        controller: "EpisodeController",
        params: {
            type: "series"
        }
    }).state("categoryepisode", {
        url: "/episode/:category_id/:episode_id",
        templateUrl: "static/client/app/episode/episode.html",
        controller: "EpisodeController",
        params: {
            type: "episode"
        }
    }).state("banner", {
        url: "/episode/:category_id/:series_id/:season_id",
        templateUrl: "static/client/app/episode/episode.html",
        controller: "EpisodeController",
        params: {
            type: "series"
        }
    })
});

//6.Category Controller
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("category", {
        url: "/category/:id",
        templateUrl: "static/client/app/categories/category.html",
        controller: "CategoryController"
    })
});

//7.HOMEPAGE-Main Ctrl
angular.module("tvfPlayApp").config(function($stateProvider) {
    $stateProvider.state("main", {
        url: "/",
        templateUrl: "static/client/app/main/main.html",
        controller: "MainCtrl"
    })
});

//8.Search Controller
.state("404", {
            url: "/404",
            controller: "SearchController",
            templateUrl: "static/client/app/static_pages/404.html",
            params: {
                type: "error"
            },
            resolve: {
                $modalInstance: function() {
                    return function() {
                        return modalInstance
                    }
                }
            }
        })

//9.Verification Ctrl//
angular.module("tvfPlayApp").config(function($stateProvider, $urlRouterProvider, $locationProvider, $animateProvider, $httpProvider, $compileProvider) {
        $stateProvider.state("signupverification", {
            url: "/user/emailverification/:token",
            templateUrl: "static/client/app/authentication/signup_verification.html",
            controller: "VerificationController",
            params: {
                type: "signupVerification"
            }
        }).state("resetPassword", {
            url: "/reset/:token",
            templateUrl: "static/client/app/authentication/reset_password.html",
            controller: "VerificationController",
            params: {
                type: "resetPassword"
            }
        }).state("emailSubscription", {
            url: "/subscribe/emailverification/:token",
            templateUrl: "static/client/app/authentication/subscribe_verification.html",
            controller: "VerificationController",
            params: {
                type: "subscribe"
            }
        }).state("invite", {
            url: "/user/invite/emailverification/:token/:episode_id",
            templateUrl: "static/client/app/invite/invite_verification.html",
            controller: "VerificationController",
            params: {
                type: "invite"
            }
        })
        .state("under-maintenance", {
            url: "/under-maintenance",
            templateUrl: "static/client/app/static_pages/under-maintenance.html"
        })
//10.Authentication Controller//
// /login, /signup
        .state("login", {
            url: "/login",
            templateUrl: "static/client/app/authentication/login-separate.html",
            controller: "AuthenticationController",
            params: {
                from_login: !0
            },
            resolve: {
                $modalInstance: function() {
                    return function() {
                        return modalInstance
                    }
                }
            }           
        }).state("signup", {
            url: "/signup",
            templateUrl: "static/client/app/authentication/registration-separate.html",
            controller: "AuthenticationController",
            params: {
                from_signup: !0
            },
            resolve: {
                $modalInstance: function() {
                    return function() {
                        return modalInstance
                    }
                }
            }
        }); 
        $urlRouterProvider.otherwise("/"); 
        $locationProvider.html5Mode(!0); 
        $animateProvider.classNameFilter(/sb-social/); 
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|coui|intent):/); 
        $httpProvider.interceptors.push(function($q, $location, $rootScope) {
            return {
                response: function(response) {
                    return 1 == wrong_browser && "/terms-conditions" != $location.path() && "/privacy-policy" != $location.path() && $location.path("/upgrade-browser"), response
                },
                responseError: function(rejection) {
                    return 500 == rejection.status && $location.path("/404"), $q.reject(rejection)
                }
            }
        })
    }); 