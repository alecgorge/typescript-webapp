System.register(['./QueryString', './View', './ViewController', './Router', 'snabbdom-jsx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var QueryString_1, View_1, ViewController_1, Router_1, snabbdom_jsx_1;
    return {
        setters:[
            function (QueryString_1_1) {
                QueryString_1 = QueryString_1_1;
            },
            function (View_1_1) {
                View_1 = View_1_1;
            },
            function (ViewController_1_1) {
                ViewController_1 = ViewController_1_1;
            },
            function (Router_1_1) {
                Router_1 = Router_1_1;
            },
            function (snabbdom_jsx_1_1) {
                snabbdom_jsx_1 = snabbdom_jsx_1_1;
            }],
        execute: function() {
            window.SnabbdomShim = {
                createElement: snabbdom_jsx_1.html
            };
            exports_1("QueryString", QueryString_1.QueryString);
            exports_1("View", View_1.View);
            exports_1("ViewController", ViewController_1.ViewController);
            exports_1("Router", Router_1.Router);
            exports_1("RouterNavigationType", Router_1.RouterNavigationType);
        }
    }
});
//# sourceMappingURL=index.js.map