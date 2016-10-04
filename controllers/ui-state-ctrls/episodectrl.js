angular.module("tvfPlayApp").controller("EpisodeController", function($scope, $timeout, $sce, $http, $modal, $stateParams,
    $httpParamSerializer, $rootScope, $interval, $location, ezfb, $modalStack, $window, $compile, $cookies, $filter, telemetryService) {

    session_start_time = (new Date).getTime();
    $(".navbar").addClass("navbar-fixed-top");
        //episode/:category_id/:series_id/:season_id/:episode_id 
        //episode/:category_id/:series_id/:season_id
        //episode/:category_id/:episode_id
    $scope.category_id = $stateParams.category_id;
    $scope.series_id = $stateParams.series_id;
    $scope.season_id = $stateParams.season_id;
    $scope.episode_id = $stateParams.episode_id;

    $scope.currentUrl = $location.absUrl();

    $scope.max = 100;
    $scope.episode_page_no = 1;
    $scope.episode_per_page = 8;
    $scope.end_of_page;
    $scope.fbcomments_url = root_url + window.location.hash;
    $scope.seeking = !1;
    $scope.extras_selected = !1;
    var parameters;
    var timeout = null;
    var interval;

    $scope.forceSSL();

    if ("series" == $stateParams.type) {
        var episode_id = void 0 == $scope.episode_id ? "" : "/" + $scope.episode_id;
        parameters = "api/episode/" + $scope.category_id + "/" + $scope.series_id + "/" + $scope.season_id + episode_id;
        $scope.getEpisodes($scope.season_id);
        $scope.showSeasons = !0
    } else parameters = "api/episode/" + $scope.category_id + "/" + $scope.episode_id;

    $scope.showSeasons = !1;

    $scope.getEpisodeDetails();

    ezfb.Event.subscribe("comment.create", $scope.fbcreateCallback);
    ezfb.Event.subscribe("comment.remove", $scope.fbremoveCallback);

    $(".togglebtn").click(function() {
        $(this).next().toggle()
    });

    $(".season-menu").toggle();

    if (1 == $rootScope.from_invite) {
        var now = new Date,
            utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1e3;
        if ($rootScope.expire_time_from_invite - utc_timestamp > 0) {
            $scope.root_seconds = $rootScope.expire_time_from_invite - utc_timestamp;
            var interval = $interval(function() {
                if ($scope.root_seconds <= 1) $interval.cancel(interval), $scope.skipInvite();
                else {
                    var now = new Date;
                    $scope.time_value = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1e3, $scope.root_seconds = $rootScope.expire_time_from_invite - $scope.time_value
                }
            }, 1e3)
        } else {
            $rootScope.from_invite = !1, $scope.dont_show_timer = !0;
            var inviteinterval = $interval(function() {
                $scope.brightcovePlayer && ($interval.cancel(inviteinterval), $scope.brightcovePlayer.play())
            }, 100)
        }
    };

    $scope.watched = 100;

    $scope.$on("getLoggedInEpisode", function() {
        $scope.getEpisodeDetails()
    });

    $scope.$on("$destroy", function() {
        $timeout.cancel(),
            $interval.cancel(interval), $interval.cancel(inviteinterval), $interval.cancel($scope.YTinterval), void 0 != $scope.brightcovePlayer && ($scope.watched_duration = parseInt(1e3 * $scope.brightcovePlayer.currentTime()), $scope.brightcovePlayer.dispose()), void 0 != player && ($scope.watched_duration = parseInt(1e3 * player.getCurrentTime())), ezfb.Event.unsubscribe("comment.create", $scope.fbcreateCallback), ezfb.Event.unsubscribe("comment.remove", $scope.fbremoveCallback), $rootScope.isLoggedIn && telemetryService.eventTrigger({
                event_label: "WATCHED_DURATION",
                event_name: $scope.episode.name,
                meta_data: $scope.episode.episode_id,
                load_duration: $scope.watched_duration
            }, "success", void 0, {
                type: $scope.provider
            }), $rootScope.$broadcast("telemetryTrigger", {})
    });

    $scope.$on("telemetryTrigger", function() {
        time_spent_by_user = (new Date).getTime() - session_start_time, telemetryService.eventTrigger({
            event_label: "EPISODE_PAGE",
            event_name: $scope.episode.name,
            meta_data: $scope.episode.episode_id,
            referred_meta_data: referred_meta_data,
            referred_event_name: referred_event_name,
            referred_event_label: referred_event_label,
            time_spent_by_user: time_spent_by_user
        }, "success"), referred_meta_data = $scope.episode.episode_id, referred_event_label = "EPISODE_PAGE", referred_event_name = $scope.episode.name
    });

    $scope.$on("brightcove:initialized", function(event, authResult) {
        $scope.video_loaded = !1, interval = $interval(function() {
            if ($scope.episode && 0 == $scope.video_loaded) {
                $interval.cancel(interval);
                try {
                    brightcovePlayer.setAttribute("data-account", $scope.account_id), brightcovePlayer.setAttribute("data-player", $scope.player_id), brightcovePlayer.setAttribute("data-video-id", $scope.video_id), brightcovePlayer.style.width = "100%", brightcovePlayer.style.height = "100%", bc(document.getElementById("brightcovePlayer")), $scope.brightcovePlayer = videojs("brightcovePlayer"), $scope.loadedmetadata = !0, $scope.video_loaded = !0, $scope.brightcovePlayer.one("loadstart", function(evt) {
                        $scope.media_sources = $scope.brightcovePlayer.mediainfo.sources, $scope.video_list = []
                    }), $scope.brightcovePlayer.on("resolutionchange", function() {
                        0 == $scope.brightcovePlayer.src().indexOf("m3u8") && "IE" == browser.name && $scope.brightcovePlayer.currentTime($scope.episode.watched_duration), $scope.brightcovePlayer.play(), telemetryService.eventTrigger({
                            event_label: "VIDEO_ACTION",
                            event_name: "RESOLUTION_TOGGLE",
                            meta_data: $scope.episode.episode_id
                        }, "success", void 0, {
                            res: $scope.brightcovePlayer.currentResolution().label,
                            episode_name: $scope.episode.name,
                            type: "brightcove"
                        })
                    }), $scope.brightcovePlayer.on("error", function(e) {
                        var error = $scope.brightcovePlayer.player().error();
                        console.log("error!", error.code, error.type, error.message), telemetryService.eventTrigger({
                            event_label: "PLAYER_EXCEPTION",
                            event_name: $scope.episode.name,
                            meta_data: $scope.episode.episode_id
                        }, "failure", {
                            component_name: "brightcove",
                            message: "code: " + error.code + " type: " + error.type
                        }, {
                            episode_name: $scope.episode.name,
                            type: "brightcove_v1.0"
                        })
                    }), $scope.brightcovePlayer.on("loadedmetadata", function() {
                        if ($scope.loadedmetaData(), $scope.video_loaded) {
                            var playInterval = null;
                            playInterval = $scope.brightcovePlayer.setInterval($scope.onPlay, 8e3), $scope.brightcovePlayer.on("fullscreenchange", $scope.fullscreenchange), $scope.brightcovePlayer.on("ended", $scope.ended), $scope.brightcovePlayer.on("pause", $scope.paused), $scope.brightcovePlayer.on("seeking", $scope.seekable), $scope.brightcovePlayer.on("play", $scope.play), $scope.video_loaded = !1, $(".vjs-dock-text").hide(), $(".hero-video-embed").bind("contextmenu", function() {
                                return !1
                            }), $scope.brightcovePlayer.currentTime($scope.episode.watched_duration), $scope.brightcovePlayer.play()
                        }
                        var options = {
                            title: $scope.episode.name,
                            description: $scope.episode.description,
                            url: $scope.shorten_url_domain_name + $scope.episode.shorten_token,
                            services: {
                                facebook: !0,
                                google: !0,
                                twitter: !0,
                                tumblr: !0,
                                pinterest: !0,
                                linkedin: !0
                            }
                        };
                        $scope.brightcovePlayer.social(options), $(".vjs-social-embed-container").hide();
                        var html = '<div class="content-heading-social" ><button class="btn btn-social btn-twitter btn-social-player" socialshare socialshare-provider="twitter" socialshare-text={{episode.name}} socialshare-url="{{shorten_url_domain_name+episode.shorten_token}}"><i class="nc-icon-glyph socials-1_logo-twitter"></i></button><button class="btn btn-social btn-facebook btn-social-player" socialshare socialshare-provider="facebook"socialshare-text={{episode.name}} socialshare-url="{{shorten_url_domain_name+episode.shorten_token}}"><i class="nc-icon-glyph socials-1_logo-fb-simple"></i></button></div>',
                            right = window.innerWidth / 2 - 100,
                            play_style = "width:200px;height:200px;position:absolute;z-index:-1;right:" + right + "px;",
                            pauseHtml = '<div class="pause_snippet" style=' + play_style + '><div style="height:160px;"><button class="btn btn-default btn-play" onclick="playVideo()" style="width:100px !important;height:100px !important;border-radius:60px;"> <i class="nc-icon-glyph media-1_button-play x3"></i></button></div><div class="content-heading-social" ><button class="btn btn-social btn-twitter btn-social-player" socialshare socialshare-provider="twitter" socialshare-text={{episode.name}} socialshare-url="{{shorten_url_domain_name+episode.shorten_token}}"><i class="nc-icon-glyph socials-1_logo-twitter"></i></button><button class="btn btn-social btn-facebook btn-social-player" socialshare socialshare-provider="facebook"socialshare-text={{episode.name}} socialshare-url="{{shorten_url_domain_name+episode.shorten_token}}"><i class="nc-icon-glyph socials-1_logo-fb-simple"></i></button></div></div>';
                        window.innerWidth < 600 && (pauseHtml = ""), $scope.brightcovePlayer.overlay({
                            content: "",
                            overlays: [{
                                align: "top-left",
                                start: "fullscreenchange",
                                end: "fullscreenchange",
                                content: "<span onclick='backScreen()' class='back_button_in_player'><p class='back_button'>Back to Browse</p></span>"
                            }, {
                                align: "top-right",
                                start: "fullscreenchange",
                                end: "fullscreenchange",
                                content: $compile(html)($scope)[0]
                            }, {
                                align: "right",
                                start: 0,
                                end: 1e6,
                                content: $compile(pauseHtml)($scope)[0]
                            }]
                        })
                    })
                } catch (err) {
                    console.log(err.name + ': "' + err.message + '" occurred when assigning x.')
                }
            }
        }, 100)
    });

    $scope.loadMore = function() {
        0 == $scope.end_of_page && ($scope.submitted = !0, $scope.episode_page_no++, $scope.getEpisodes($scope.season_id, !0), telemetryService.eventTrigger({
            event_label: "LOAD_MORE",
            event_name: $scope.season_name,
            meta_data: $scope.season_id
        }, "success"))
    };

    $scope.login = function(type) {
        "offer" == type && ($cookies.put("avail_offer_path", "/coupons/" + $scope.category_id + "/" + $scope.series_id), $rootScope.avail_offer_path = "/coupons/" + $scope.category_id + "/" + $scope.series_id), "download" == type && $cookies.put("download_file", !0), $rootScope.$broadcast("telemetryTrigger", {});
        $modal.open({
            templateUrl: "static/client/app/authentication/intro-authentication.html",
            controller: "AuthenticationController",
            windowClass: "renewed-modal-form"
        })
    };

    $scope.inviteModal = function(type) {
        $scope.brightcovePlayer, $scope.invite_type = type;
        $modal.open({
            templateUrl: "static/client/app/invite/invite.html",
            controller: "InviteController",
            windowClass: "modal-form",
            scope: $scope,
            backdrop: "static",
            keyboard: !1
        })
    };

    $scope.emailModal = function() {
        $modal.open({
            templateUrl: "static/client/app/invite/invite_by_emails.html",
            controller: "InviteController",
            windowClass: "modal-form",
            scope: $scope
        })
    };

    $scope.skipInvite = function() {
        $rootScope.from_invite = !1, $scope.brightcovePlayer.play(), $window.scrollTo(0, 0), $modalStack.dismissAll()
    };

    $scope.set_message = function(message) {
        $scope.tooltip_message = message, $scope.showSocial = !1
    };

    $scope.show_tooltip = function() {
        $scope.tooltip = !0, $rootScope.isLoggedIn & 1 == $scope.like ? $scope.set_message("Click to Unlike") : $rootScope.isLoggedIn & 0 == $scope.like ? $scope.set_message("Click to Like") : $scope.set_message("")
    };

    $scope.hide_tooltip = function() {
        $scope.set_message("")
    };

    $scope.exitFullscreen = function() {
        $scope.playerInstance.setFullscreen(!1)
    };

    $scope.populate_data = function(response) {
        1 == $scope.episode_page_no

            ? ($scope.episodes = response.data.episodes,
            $scope.seasons = response.data.seasons,
            $scope.season_id = response.data.season_id,
            $scope.season_name = response.data.name,
            $scope.category = response.data)

        : angular.forEach(response.data.episodes, function(item) {
                $scope.episodes.push(item)
            });
        $scope.end_of_page = response.data.end_of_page; 
        $scope.loadmore = "1" != $scope.end_of_page; 
        $scope.submitted = !1
    };

    $scope.getEpisodes = function(season_id, load_more) {
        $scope.extras_selected = !1; $(".season-menu").toggle(); 
        $scope.episode_page_no = load_more ? $scope.episode_page_no : 1; 
        //api/season/category_id/series_id/season_id/episode_page_no/episode_per_page/
        $http.get(root_url + "api/season/" + parseInt($scope.category_id) + "/" + parseInt($scope.series_id) + "/" + parseInt(season_id) + "/" + parseInt($scope.episode_page_no) + "/" + $scope.episode_per_page)
        .then(function(response) {
            $scope.populate_data(response)
        }, function(response) {})
    };

    $scope.extras_series = function() {
        $scope.extras_selected = !0, $(".season-menu").toggle(), $scope.episode_page_no = 1, $http.get(root_url + "api/extras/" + $scope.category_id + "/" + $scope.series_id + "/1/50").then(function(response) {
            $scope.populate_data(response)
        }, function(response) {})
    };

    $scope.forceSSL = function() {
        "https" === $location.protocol() && ($window.location.href = $location.absUrl().replace("https", "http"))
    };

    $scope.likeEpisode = function() {
    	$scope.set_message("");
        if ($rootScope.isLoggedIn) {
            $scope.like = 1 == $scope.like ? 0 : 1;
            var parameters = {
                category_id: $scope.category_id,
                series_id: $scope.series_id,
                season_id: $scope.season_id,
                episode_id: $scope.episode_id,
                like: $scope.like
            };
            $http.put(root_url + "api/like/episode/" + $scope.episode.type, $httpParamSerializer(parameters)).then(function(response) {
                "success" == response.data.status ? 1 == $scope.like && telemetryService.eventTrigger({
                    event_label: "LIKE",
                    event_name: $scope.episode.name,
                    meta_data: $scope.episode.episode_id
                }, "success") : telemetryService.eventTrigger({
                    event_label: "LIKE",
                    event_name: $scope.episode.name,
                    meta_data: $scope.episode.episode_id
                }, "failure", {
                    component_name: "LIKE",
                    message: "EPISODE_NOT_FOUND"
                })
            }, function(response) {})
        } else $scope.login("like")
    };

    $scope.getEpisodeDetails = function() {
        $http.get(root_url + parameters).then(function(response) {
                if (0 !== Object.getOwnPropertyNames(response.data.episode).length) {
                    $scope.episode = response.data.episode;
                    $scope.episode_id = $scope.episode.episode_id;
                    $rootScope.offers_help_url = $scope.episode.offers_help_url;
                    $scope.casting_fields = JSON.parse($scope.episode.casting_fields);

                    "inbox" == $scope.episode.c_type && 1 == $scope.episode.is_extras 
                    ? $scope.partialSrcHtml = "static/client/app/episode/inbox.html" 
                    : $scope.partialSrcHtml = "static/client/app/episode/player.html";

                    if (void 0 != $cookies.get("avail_offer_path")) {
                        if (0 == $scope.episode.purchased) {
                                telemetryService.eventTrigger({
                                        event_label: "PAYMENT",
                                        event_name: "STARTED",
                                        meta_data: $stateParams.series_id
                                    },
                                    "success",
                                    void 0, {
                                        series_name: $scope.series_name
                                    }),
                                ga("send", "event", "Payment:started:" + $scope.series_name, "Payment:started:" + $scope.series_name),
                               	fbq("track", "InitiateCheckout"),
                                $window.location.href = "/api/payment/web/" +
                                    $stateParams.category_id +
                                    "/" + $stateParams.series_id +
                                    "/" + ($scope.selected_coupon_id ? $scope.selected_coupon_id : 0)
                            },
                            $cookies.remove("avail_offer_path")
                        };

                    if ("True" == is_logged_in) {
                        if ("" != $scope.episode.akamai_video_id && null != $scope.episode.akamai_video_id) {
                            $scope.account_id = 4780398800001,
                                $scope.player_id = "VyzVYQq2x",
                                $scope.video_id = $scope.episode.akamai_video_id
                        } else {
                            $scope.account_id = 4512983226001,
                                $scope.player_id = "4kjc44rjg",
                                $scope.video_id = $scope.episode.brightcove_video_id
                        },

                        if (void 0 != $scope.episode.video_tag && 0 == $scope.episode.third_party) {
                            $scope.addBrightcovePlayer(),
                                telemetryService.eventTrigger({
                                    event_label: "VIDEO_VIEWS",
                                    event_name: $scope.episode.name,
                                    meta_data: $scope.episode.episode_id
                                }, "success", void 0, {
                                    type: "brightcove_v1.0"
                                }),
                                $scope.provider = "brightcove"
                        } else {
                            console.log("youtube"),
                                ga("send", "event", "Youtube Video Watched", $scope.episode.name + ":" + $scope.episode.episode_id),
                                $scope.addYoutubePlayer(),
                                telemetryService.eventTrigger({
                                    event_label: "VIDEO_VIEWS",
                                    event_name: $scope.episode.name,
                                    meta_data: $scope.episode.episode_id
                                }, "success", void 0, {
                                    type: "youtube"
                                }),
                                $scope.provider = "youtube"
                        },

                        ga("send", "event", "Watched Video", $scope.episode.name + ":" + $scope.episode.episode_id, $scope.episode.name + ":" + $scope.episode.episode_id)
                    },

                    if ("function" == typeof window.google_trackConversion) {
                        window.google_trackConversion({
                            google_conversion_id: 960345609,
                            google_custom_params: {
                                page: "Episode Page",
                                episode_name: $scope.episode.name
                            },
                            google_remarketing_only: !0
                        })
                    },

                    $scope.video_tag = $sce.trustAsHtml($scope.episode.video_tag),
                        $scope.like = response.data.episode.is_liked,
                        $scope.invite_type = "player",
                        $scope.autoplay_notifier = 1 != $scope.episode.invite_required,
                        void 0 != $rootScope.isMobile.Android(),
                        void 0 != $cookies.get("download_file") && "Chrome" == browser.name && ($scope.download_music(), $cookies.remove("download_file"))

                } else {
                    if ("02" == response.data.resp_code) {
                        $location.path("/not-available-in-your-location"); 
                        telemetryService.eventTrigger({
                            event_label: "EPISODE",
                            event_name: $scope.episode.name,
                            meta_data: $scope.episode.episode_id
                        }, "failure", {
                            component_name: "EPISODE",
                            message: "REGION_RESTRICT"
                        }, {
                            episode_name: $scope.episode.name
                        })
                    } else {
                        $location.path("/404"),
                            telemetryService.eventTrigger({
                                    event_label: "EPISODE",
                                    event_name: $scope.episode.name,
                                    meta_data: $scope.episode.episode_id
                                },
                                "   failure", {
                                    component_name: "EPISODE",
                                    message: "EPISODE_NOT_FOUND"
                                })
                    }
                }
            }, //success http promise ends
            function(error) {});
    };

    $scope.download_music = function() {
        if ("True" == is_logged_in || 1 == $rootScope.isLoggedIn) {
            $http.get(root_url + "api/music/download/" + $scope.category_id + "/" + $scope.series_id + "/" + $scope.season_id + "/" + $scope.episode_id)
                .then(function(response) {
                    if ("success" == response.data.status) {
                        $timeout(function() {
                                $(".downloadable-music").attr("href", response.data.url),
                                    document.querySelector(".downloadable-music").click(),
                                    telemetryService.eventTrigger({
                                        event_label: "MUSIC_DOWNLOAD",
                                        event_name: $scope.episode.name,
                                        meta_data: $scope.episode.episode_id
                                    }, "success")
                            }) //timeout ends
                    } else {
                        telemetryService.eventTrigger({
                            event_label: "MUSIC_DOWNLOAD",
                            event_name: $scope.episode.name,
                            meta_data: $scope.episode.episode_id
                        }, "failure", {
                            component_name: "MUSIC_DOWNLOAD",
                            message: response.data.message
                        })
                    }
                }, function(error) {})
        } else $scope.login("download")
    };

    $scope.avail_offers = function() {
        telemetryService.eventTrigger({
                event_label: "PAYMENT",
                event_name: "STARTED",
                meta_data: $stateParams.series_id
            }, "success", void 0, {
                series_name: $scope.series_name
            }), //eventtrigger ends
            ga("send", "event", "Payment:started:" + $scope.series_name, "Payment:started:" + $scope.series_name),
            fbq("track", "InitiateCheckout"),
            window.location.href = "/api/payment/web/" + $stateParams.category_id + "/" + $stateParams.series_id + "/" + ($scope.selected_coupon_id ? $scope.selected_coupon_id : 0)
    };

    $scope.how_to_avail_offer = function() {
        $modal.open({
            templateUrl: "static/client/app/static_pages/how_to_avail_offer.html",
            controller: "StaticController",
            windowClass: "modal-form",
            scope: $scope
        })
    };

    $scope.email_missing = function() {
        $modal.open({
            templateUrl: "static/client/app/static_pages/email_missing.html",
            controller: "StaticController",
            windowClass: "modal-form",
            scope: $scope
        })
    };

    $scope.fbcreateCallback = function() {
        var parameters = {
            category_id: $scope.category_id,
            series_id: $scope.series_id,
            season_id: $scope.season_id,
            episode_id: $scope.episode_id,
            comment: 1
        };
        $http.put(root_url + "api/comment/episode/" + $scope.episode.type, $httpParamSerializer(parameters))
            .then(function(response) {
                    $scope.episode.comments = parseInt($scope.episode.comments) + 1,
                        "success" == response.data.status ? telemetryService.eventTrigger({
                            event_label: "COMMENT",
                            event_name: $scope.episode.name,
                            meta_data: $scope.episode.episode_id
                        }, "success")

                    : telemetryService.eventTrigger({
                        event_label: "COMMENT",
                        event_name: $scope.episode.name,
                        meta_data: $scope.episode.episode_id
                    }, "failure", {
                        component_name: "COMMENT",
                        message: response.data.message
                    })
                },
                function(error) {})
    };

    $scope.fbremoveCallback = function() {
        var parameters = {
            category_id: $scope.category_id,
            series_id: $scope.series_id,
            season_id: $scope.season_id,
            episode_id: $scope.episode_id,
            comment: 0
        };
        $http.put(root_url + "api/comment/episode/" + $scope.episode.type, $httpParamSerializer(parameters))
            .then(function(response) {
                $scope.episode.comments = parseInt($scope.episode.comments) - 1
            }, function(response) {})
    };

    $scope.onPlay = function() {
        $rootScope.isLoggedIn && !$scope.brightcovePlayer.paused() && (0 == $scope.seeking, $scope.episode.watched_duration = $scope.brightcovePlayer.currentTime(), $http.put(root_url + "api/episode/duration", $httpParamSerializer({
            episode_id: $scope.episode_id,
            watched_duration: $scope.brightcovePlayer.currentTime()
        })).then(function(response) {
            "failure" == response.data.status && telemetryService.eventTrigger({
                event_label: "EPISODE_DURATION",
                event_name: $scope.episode.name,
                meta_data: $scope.episode.episode_id
            }, "failure", {
                component_name: "EPISODE_DURATION",
                message: response.data.message
            }, {
                type: "brightcove"
            })
        }, function(response) {}))
    };

    $scope.fullscreenchange = function() {
        $scope.brightcovePlayer.isFullscreen() ? ($(".fullscreen").show(), $("#hero-unit").height(900), $("#main, #navbar, #footer").hide(), $(".vjs-overlay-top-left").show(), $(".vjs-overlay-top-right").show(), telemetryService.eventTrigger({
            event_label: "VIDEO_ACTION",
            event_name: "FULLSCREEN",
            meta_data: $scope.episode.episode_id
        }, "success", void 0, {
            episode_name: $scope.episode.name,
            type: "brightcove"
        })) : ($(".fullscreen").hide(), $("#hero-unit").css({
            height: "auto"
        }), $("#main, #navbar, #footer").show(), $(".vjs-overlay-top-left").hide(), $(".vjs-overlay-top-right").hide(), $scope.back_to_browse_clicked || telemetryService.eventTrigger({
            event_label: "VIDEO_ACTION",
            event_name: "EXIT_FULLSCREEN",
            meta_data: $scope.episode.episode_id
        }, "success", void 0, {
            episode_name: $scope.episode.name,
            type: "brightcove"
        }), $scope.back_to_browse_clicked = !1), $(".vjs-overlay-right").hide()
    };

    $scope.changeScreen = function() {
        $scope.brightcovePlayer.exitFullscreen()
    };

    $scope.loadedmetaData = function() {
        $scope.loadedmetadata && ($scope.loadedmetadata = !1, 1 != $scope.dont_show_timer && 1 != $scope.autoplay_notifier && $scope.inviteModal("player"))
    };

    $scope.mousemovePlayer = function() {
        $scope.brightcovePlayer && $scope.brightcovePlayer.isFullscreen() && (null !== timeout && (clearTimeout(timeout), $(".vjs-overlay-top-left").show(), $(".vjs-overlay-top-right").show()), timeout = setTimeout(function() {
            $(".vjs-overlay-top-left").hide(), $(".vjs-overlay-top-right").hide()
        }, 5e3))
    };

    $scope.ended = function() {
        $scope.episode.watched_duration = 0, $(".vjs-overlay-right").hide(), $(".vjs-trigger-social-control").hide(), $(".pause_snippet").css("z-index", "-1")
    };

    $scope.play = function() {
        $(".vjs-overlay-right").hide()
    };

    $scope.paused = function() {
        $(".vjs-overlay-right").hide(), "Hls" != brightcovePlayer.player.techName ? $scope.brightcovePlayer.isFullscreen() && ($(".vjs-overlay-right").show(), $(".pause_snippet").css("z-index", "1")) : 0 == $scope.seeking && $scope.brightcovePlayer.isFullscreen() && ($(".vjs-overlay-right").show(), $(".pause_snippet").css("z-index", "1")), $scope.seeking = !1
    };

    $scope.seekable = function() {
        $scope.seeking = !0, $(".vjs-overlay-right").hide(), $(".pause_snippet").css("z-index", "-1")
    };

    $scope.back_to_browse = function() {
        telemetryService.eventTrigger({
            event_label: "VIDEO_ACTION",
            event_name: "BACK_TO_BROWSE",
            meta_data: $scope.episode.episode_id
        }, "success", void 0, {
            episode_name: $scope.episode.name,
            type: "brightcove"
        })
    };

    $scope.formjs = function(account_id, b_player_id) {
        return $sce.trustAsResourceUrl("//players.brightcove.net/" + account_id + "/" + b_player_id + "_default/index.min.js")
    };

    $scope.addBrightcovePlayer = function() {
        try {
            var playerHTML = '<video id="brightcovePlayer" data-embed="default" class="video-js" controls style="width: 100%; height: 100%; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;"></video>';
            $scope.playerHtmlBrightcove = playerHTML, $.getScript("//players.brightcove.net/" + $scope.account_id + "/" + $scope.player_id + "_default/index.min.js", function() {
                $rootScope.$broadcast("brightcove:initialized", {})
            })
        } catch (err) {
            console.log(err)
        }
    };

    $scope.addYoutubePlayer = function() {
        $.getScript("//www.youtube.com/iframe_api", function() {
            loadedYTScript()
        })
    };

    $scope.onPlayerReady = function(event) {};

    $scope.onPlayerStateChange = function(event) {
        event.data == YT.PlayerState.PLAYING ? (void 0 != $cookies.get("download_file") && ($scope.download_music(),
            $cookies.remove("download_file")), $scope.YTtrigger()) : $interval.cancel($scope.YTinterval)
    };

    $scope.onPlayerQuaityChange = function(event) {};

    $scope.YTtrigger = function() {
        $scope.YTinterval = $interval(function() {
            try {
                $http.put(root_url + "api/episode/duration", $httpParamSerializer({
                    episode_id: $scope.episode_id,
                    watched_duration: player.getCurrentTime()
                })).then(function(response) {}, function(response) {
                    "failure" == response.data.status && telemetryService.eventTrigger({
                        event_label: "EPISODE_DURATION",
                        event_name: $scope.episode.name,
                        meta_data: $scope.episode.episode_id
                    }, "failure", {
                        component_name: "EPISODE_DURATION",
                        message: response.data.message
                    }, {
                        type: "youtube"
                    })
                })
            } catch (err) {
                console.log(err.name + ': "' + err.message)
            }
        }, 1e4)
    };
});