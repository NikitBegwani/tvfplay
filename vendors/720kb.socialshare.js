! function(a) {
        "use strict";
        a.module("720kb.socialshare", [])
        .directive("socialshare", ["$window", "$location", function(a, b) {
            return {
                restrict: "A",
                link: function(c, d, e) {
                    var f, g, h = {},
                        i = {
                            url: "",
                            redirectUri: "",
                            provider: "",
                            type: "",
                            text: "",
                            caption: "",
                            to: "",
                            ref: "",
                            display: "",
                            from: "",
                            media: "",
                            hashtags: "",
                            via: "",
                            description: "",
                            source: "",
                            subreddit: "",
                            follow: "",
                            popupHeight: 500,
                            popupWidth: 500
                        };
                    for (f in i) i.hasOwnProperty(f) && (g = "socialshare" + f.substring(0, 1).toUpperCase() + f.substring(1), function(a) {
                        e.$observe(g, function(b) {
                            b && (h[a] = b)
                        })
                    }(f), void 0 === h[f] && (h[f] = i[f]));
                    h.eventTrigger = e.socialshareTrigger || "click", c.facebookShare = function(c) {
                        if (c.type && "feed" === c.type) {
                            var d = "https://www.facebook.com/dialog/feed?display=popup&app_id=" + encodeURI(c.via) + "&redirect_uri=" + encodeURI(c.redirectUri);
                            c.url && (d += "&link=" + encodeURIComponent(c.url)), c.to && (d += "&to=" + encodeURIComponent(c.to)), c.display && (d += "&display=" + encodeURIComponent(c.display)), c.ref && (d += "&ref=" + encodeURIComponent(c.ref)), c.from && (d += "&from=" + encodeURIComponent(c.from)), c.description && (d += "&description=" + encodeURIComponent(c.description)), c.text && (d += "&name=" + encodeURIComponent(c.text)), c.caption && (d += "&caption=" + encodeURIComponent(c.caption)), c.media && (d += "&picture=" + encodeURIComponent(c.media)), c.source && (d += "&source=" + encodeURIComponent(c.source)), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                        } else a.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(c.url || b.absUrl()), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.twitterShare = function(c) {
                        var d = "https://www.twitter.com/intent/tweet?";
                        c.text && (d += "text=" + encodeURIComponent(c.text)), c.via && (d += "&via=" + encodeURI(c.via)), c.hashtags && (d += "&hashtags=" + encodeURI(c.hashtags)), d += "&url=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.googlePlusShare = function(c) {
                        a.open("https://plus.google.com/share?url=" + encodeURIComponent(c.url || b.absUrl()), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.redditShare = function(c) {
                        var d = "https://www.reddit.com/";
                        d += c.subreddit ? "r/" + c.subreddit + "/submit?url=" : "submit?url=", c.popupWidth < 900 && (c.popupWidth = 900), c.popupHeight < 650 && (c.popupHeight = 650), a.open(d + encodeURIComponent(c.url || b.absUrl()) + "&title=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.stumbleuponShare = function(c) {
                        a.open("https://www.stumbleupon.com/submit?url=" + encodeURIComponent(c.url || b.absUrl()) + "&title=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.linkedinShare = function(c) {
                        a.open("https://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(c.url || b.absUrl()) + "&title=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.pinterestShare = function(c) {
                        a.open("https://www.pinterest.com/pin/create/button/?url=" + encodeURIComponent(c.url || b.absUrl()) + "&media=" + encodeURI(c.media) + "&description=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.diggShare = function(c) {
                        a.open("https://www.digg.com/submit?url=" + encodeURIComponent(c.url || b.absUrl()) + "&title=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.tumblrShare = function(b) {
                        if (b.media) {
                            var c = "https://www.tumblr.com/share/photo?source=" + encodeURIComponent(b.media);
                            b.text && (c += "&caption=" + encodeURIComponent(b.text)), a.open(c, "sharer", "toolbar=0,status=0,width=" + b.popupWidth + ",height=" + b.popupHeight)
                        } else a.open("https://www.tumblr.com/share/link?url=" + encodeURIComponent(b.url) + "&description=" + encodeURIComponent(b.text), "sharer", "toolbar=0,status=0,width=" + b.popupWidth + ",height=" + b.popupHeight)
                    }, c.vkShare = function(c) {
                        a.open("https://www.vk.com/share.php?url=" + encodeURIComponent(c.url || b.absUrl()), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.deliciousShare = function(c) {
                        a.open("https://www.delicious.com/save?v=5&noui&jump=close&url=" + encodeURIComponent(c.url || b.absUrl()) + "&title=" + encodeURIComponent(c.text), "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.bufferShare = function(c) {
                        var d = "https://bufferapp.com/add?";
                        c.text && (d += "text=" + encodeURIComponent(c.text)), c.via && (d += "&via=" + encodeURI(c.via)), d += "&url=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.hackernewsShare = function(c) {
                        var d = "https://news.ycombinator.com/submitlink?";
                        c.text && (d += "t=" + encodeURIComponent(c.text) + "&"), d += "u=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.flipboardShare = function(c) {
                        var d = "https://share.flipboard.com/bookmarklet/popout?v=2&";
                        c.text && (d += "title=" + encodeURIComponent(c.text) + "&"), d += "url=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.pocketShare = function(c) {
                        var d = "https://getpocket.com/save?";
                        c.text && (d += "text=" + encodeURIComponent(c.text) + "&"), d += "url=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight);
                    }, c.wordpressShare = function(c) {
                        var d = "http://wordpress.com/press-this.php?";
                        c.text && (d += "t=" + encodeURIComponent(c.text) + "&"), c.media && (d += "i=" + encodeURIComponent(c.media) + "&"), d += "u=" + encodeURIComponent(c.url || b.absUrl()), a.open(d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, c.xingShare = function(c) {
                        var d = "";
                        c.follow && (d = "&follow_url=" + encodeURIComponent(c.follow)), a.open("https://www.xing.com/spi/shares/new?url=" + encodeURIComponent(c.url || b.absUrl()) + d, "sharer", "toolbar=0,status=0,width=" + c.popupWidth + ",height=" + c.popupHeight)
                    }, d.bind(h.eventTrigger, function() {
                        switch (h.provider) {
                            case "facebook":
                                c.facebookShare(h);
                                break;
                            case "google+":
                                c.googlePlusShare(h);
                                break;
                            case "twitter":
                                c.twitterShare(h);
                                break;
                            case "stumbleupon":
                                c.stumbleuponShare(h);
                                break;
                            case "reddit":
                                c.redditShare(h);
                                break;
                            case "pinterest":
                                c.pinterestShare(h);
                                break;
                            case "linkedin":
                                c.linkedinShare(h);
                                break;
                            case "digg":
                                c.diggShare(h);
                                break;
                            case "tumblr":
                                c.tumblrShare(h);
                                break;
                            case "delicious":
                                c.deliciousShare(h);
                                break;
                            case "vk":
                                c.vkShare(h);
                                break;
                            case "buffer":
                                c.bufferShare(h);
                                break;
                            case "pocket":
                                c.pocketShare(h);
                                break;
                            case "wordpress":
                                c.wordpressShare(h);
                                break;
                            case "flipboard":
                                c.flipboardShare(h);
                                break;
                            case "hackernews":
                                c.hackernewsShare(h);
                                break;
                            case "xing":
                                c.xingShare(h);
                                break;
                            default:
                                return
                        }
                    })
                }
            }
        }])
    }(angular),