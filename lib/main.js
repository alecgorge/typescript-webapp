System.register(['./index'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var UI;
    var HomeViewController, Routes, router;
    return {
        setters:[
            function (UI_1) {
                UI = UI_1;
            }],
        execute: function() {
            HomeViewController = (function (_super) {
                __extends(HomeViewController, _super);
                function HomeViewController(params) {
                    _super.call(this, params);
                    this.night = true;
                    this.view = this;
                    this.title = "Home";
                }
                HomeViewController.prototype.alert = function () {
                    alert("omg");
                };
                HomeViewController.prototype.getVirtualNode = function () {
                    var p = SnabbdomShim.createElement("p", null, this.night);
                    if (this.params.verbose == "1") {
                        p = SnabbdomShim.createElement("p", {"on-click": this.alert}, "This current setting of night is ", this.night);
                    }
                    return SnabbdomShim.createElement("div", null, p, SnabbdomShim.createElement("p", null, SnabbdomShim.createElement("a", {href: router.makeLink(Routes.Test, { "name": "alec" })}, "go to test?")));
                };
                return HomeViewController;
            }(UI.ViewController));
            exports_1("HomeViewController", HomeViewController);
            (function (Routes) {
                Routes[Routes["Index"] = 0] = "Index";
                Routes[Routes["Home"] = 1] = "Home";
                Routes[Routes["Test"] = 2] = "Test";
            })(Routes || (Routes = {}));
            router = new UI.Router(document.getElementById('content'), {
                navigationType: UI.RouterNavigationType.LocationHash
            });
            router.titleFormatter = function (router, vc) { return vc.title + " – Test Site"; };
            router.map(Routes.Index, "/", function (p) {
                router.navigateTo('/home', {}, true);
            });
            router.map(Routes.Home, "/home", function (routeParams) {
                router.replaceCurrentViewController(new HomeViewController(routeParams));
            });
            router.map(Routes.Test, "/test/:name", function (p) {
                var vc = new UI.ViewController(p);
                vc.view = new UI.View(function () { return SnabbdomShim.createElement("p", null, SnabbdomShim.createElement("a", {href: router.makeLink(Routes.Index, {})}, "go home ", vc.params.name)); });
                router.replaceCurrentViewController(vc);
            });
            router.mapDefault(function (params) {
                var vc = new UI.ViewController(params);
                vc.view = new UI.View(function () { return SnabbdomShim.createElement("p", null, "Not Found"); });
                router.replaceCurrentViewController(vc);
            });
            router.start();
        }
    }
});
//# sourceMappingURL=main.js.map