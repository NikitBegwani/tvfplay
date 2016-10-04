angular.module("tvfPlayApp").directive("input", [function() {
    return {
        restrict: "E",
        link: link
    }
}]).directive("button", [function() {
    return {
        restrict: "E",
        link: link
    }
}]);
function link(scope, elem) {
    $(elem).parents(".modal").length && $(elem).on("touchstart", function(e) {
        "INPUT" == $(this).get(0).tagName ? ($(elem).focus(), e.stopPropagation(), e.preventDefault()) : e.stopPropagation()
    })
}