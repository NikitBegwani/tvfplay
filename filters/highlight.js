angular.module("tvfPlayApp")
.filter("highlight", ["$sce", function($sce) {
    return function(input, searchParam) {
        if ("function" == typeof input) return "";
        if (searchParam) {
            var words = "(" + searchParam.split(/\ /).join(" |") + "|" + searchParam.split(/\ /).join("|") + ")",
                exp = new RegExp(words, "gi");
            words.length && (input = input.replace(exp, '<span class="highlight">$1</span>'))
        }
        return $sce.trustAsHtml(input)
    }
}]);