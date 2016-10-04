angular.module("tvfPlayApp")
.directive("suggestion", function() {
    return {
        restrict: "A",
        require: "^autocomplete",
        link: function(scope, element, attrs, autoCtrl) {
            element.bind("mouseenter", function() {
                autoCtrl.preSelect(attrs.val), autoCtrl.setIndex(attrs.index)
            }), element.bind("mouseleave", function() {
                autoCtrl.preSelectOff()
            })
        }
    }
});