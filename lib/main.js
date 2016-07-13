System.register(['./test'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var test_1;
    var HomeViewController, router;
    return {
        setters:[
            function (test_1_1) {
                test_1 = test_1_1;
            }],
        execute: function() {
            HomeViewController = (function (_super) {
                __extends(HomeViewController, _super);
                function HomeViewController(params) {
                    _super.call(this, params);
                    this.night = true;
                    this.view = this;
                }
                HomeViewController.prototype.alert = function () {
                    alert("omg");
                };
                HomeViewController.prototype.getVirtualNode = function () {
                    var p = test_1.SnabbdomShim.createElement("p", null, this.night);
                    if (this.params.verbose == "1") {
                        p = test_1.SnabbdomShim.createElement("p", {"on-click": this.alert}, "This current setting of night is ", this.night);
                    }
                    return test_1.SnabbdomShim.createElement("div", null, p, test_1.SnabbdomShim.createElement("p", null, test_1.SnabbdomShim.createElement("a", {href: "test/alec"}, "go to test?")));
                };
                return HomeViewController;
            }(test_1.ViewController));
            exports_1("HomeViewController", HomeViewController);
            router = new test_1.Router(document.getElementById('content'));
            router.map("/", function (p) {
                router.navigateTo('/home', {}, true);
            });
            router.map("/home", function (routeParams) {
                router.replaceCurrentViewController(new HomeViewController(routeParams));
            });
            router.map("/test/:name", function (p) {
                var vc = new test_1.ViewController(p);
                vc.view = new test_1.View(function () { return test_1.SnabbdomShim.createElement("p", null, test_1.SnabbdomShim.createElement("a", {href: ""}, "go home ", vc.params.name)); });
                router.replaceCurrentViewController(vc);
            });
            router.mapDefault(function (params) {
                var vc = new test_1.ViewController(params);
                vc.view = new test_1.View(function () { return test_1.SnabbdomShim.createElement("p", null, "Not Found"); });
                router.replaceCurrentViewController(vc);
            });
            router.start(); //location.pathname.substr("/lib".length) + location.search);
        }
    }
});
//# sourceMappingURL=main.js.map