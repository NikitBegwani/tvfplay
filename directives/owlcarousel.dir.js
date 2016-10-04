.directive("owlCarouselItem", [function() {
    return {
        restrict: "A",
        transclude: !1,
        link: function(scope, element) {
            scope.$last && scope.initCarousel(element.parent())
        }
    }
}])

.directive("owlCarouselSlider", function($rootScope) {
    return {
        restrict: "AE",
        transclude: !1,
        link: function(scope) {
            scope.initCarousel = function(element) {
                document.getElementById("luis");
                element.on("load", function() {
                    var hola = document.getElementById("luis");
                    console.log($(hola).width()), console.log(hola)
                });
                var defaultOptions = {},
                    customOptions = scope.$eval($(element).attr("data-options"));
                for (var key in customOptions) defaultOptions[key] = customOptions[key];
                var dots_slider = !0;
                $(element).owlCarousel({
                    margin: 0,
                    dots: !0,
                    navText: ['<i class="nc-icon-glyph arrows-1_minimal-left x3"></i>', 
                    			'<i class="nc-icon-glyph arrows-1_minimal-right x3"></i>'],
                    animateOut: "fadeOut",
                    slideSpeed: 1300,
                    dotsSpeed: 1e3,
                    items: 1,
                    responsive: {
                        0: {
                            dots: !0,
                            nav: !1
                        },
                        600: {
                            nav: !0
                        },
                        1e3: {
                            nav: !0,
                            dots: dots_slider,
                            navSpeed: 1e3,
                            dotsSpeed: 1e3
                        }
                    }
                }), window.innerWidth > 768
            }
        }
    }
})

.directive("owlCarousel", function($rootScope) {
    return {
        restrict: "AE",
        transclude: !1,
        link: function(scope) {
            scope.initCarousel = function(element) {
                var defaultOptions = {},
                    customOptions = scope.$eval($(element).attr("data-options"));
                for (var key in customOptions) defaultOptions[key] = customOptions[key];
                var slide_count;
                switch (!0) {
                    case "category" == scope.page && void 0 != scope.category:
                        slide_count = "portrait" == scope.category.orientation ? 7 : 4;
                        break;
                    case "main" == scope.page && scope.categories.length > 0:
                        category = scope.categories[scope.$index], void 0 != category && (slide_count = "portrait" == category.orientation ? 7 : 4);
                        break;
                    default:
                        slide_count = 5
                }
                $(element).owlCarousel({
                    margin: 10,
                    dots: !1,
                    navText: ['<i class="nc-icon-glyph arrows-1_minimal-left x2"></i>', '<i class="nc-icon-glyph arrows-1_minimal-right x2"></i>'],
                    slide_by: 4,
                    navigation: !1,
                    responsive: {
                        0: {
                            items: 3,
                            dots: !0,
                            margin: 5,
                            slide_by: 3
                        },
                        600: {
                            items: 3,
                            slide_by: 3
                        },
                        1e3: {
                            items: 5,
                            nav: !0,
                            dots: !1,
                            slideBy: 6
                        },
                        1250: {
                            items: slide_count,
                            nav: !0,
                            dots: !1,
                            slideBy: 6
                        },
                        1500: {
                            items: 9,
                            nav: !0,
                            dots: !1,
                            slideBy: 6
                        }
                    }
                }), $(element).on("changed.owl.carousel", function(event) {
                    console.log(event), void 0 == scope.categories ? $rootScope.$broadcast("event:next:owl", {}) : $rootScope.$broadcast("event:next:owl", scope.categories[scope.$index])
                })
            }
        }
    }
})