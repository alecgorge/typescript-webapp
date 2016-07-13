/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />
System.register(['snabbdom-jsx', 'snabbdom', 'route-matcher', 'lodash', 'snabbdom/modules/class', 'snabbdom/modules/props', 'snabbdom/modules/style', 'snabbdom/modules/eventlisteners', 'snabbdom/modules/attributes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var snabbdom_jsx_1, snabbdom, route_matcher_1, _, class_1, props_1, style_1, eventlisteners_1, attributes_1;
    var SnabbdomShim, View, ViewController, RouteHandler, QueryString, Router, TestView;
    return {
        setters:[
            function (snabbdom_jsx_1_1) {
                snabbdom_jsx_1 = snabbdom_jsx_1_1;
            },
            function (snabbdom_1) {
                snabbdom = snabbdom_1;
            },
            function (route_matcher_1_1) {
                route_matcher_1 = route_matcher_1_1;
            },
            function (_1) {
                _ = _1;
            },
            function (class_1_1) {
                class_1 = class_1_1;
            },
            function (props_1_1) {
                props_1 = props_1_1;
            },
            function (style_1_1) {
                style_1 = style_1_1;
            },
            function (eventlisteners_1_1) {
                eventlisteners_1 = eventlisteners_1_1;
            },
            function (attributes_1_1) {
                attributes_1 = attributes_1_1;
            }],
        execute: function() {
            SnabbdomShim = (function () {
                function SnabbdomShim() {
                }
                SnabbdomShim.createElement = snabbdom_jsx_1.html;
                return SnabbdomShim;
            }());
            exports_1("SnabbdomShim", SnabbdomShim);
            View = (function () {
                function View(gen) {
                    this.gen = gen;
                }
                View.prototype.getVirtualNode = function () {
                    return this.gen();
                };
                return View;
            }());
            exports_1("View", View);
            ViewController = (function () {
                function ViewController(params) {
                    this.params = params;
                    this._view = null;
                    this._title = null;
                    this._childViewControllers = [];
                    this.parentViewController = null;
                }
                Object.defineProperty(ViewController.prototype, "view", {
                    get: function () {
                        return this._view;
                    },
                    set: function (newView) {
                        this._view = newView;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewController.prototype, "title", {
                    get: function () {
                        return this._title;
                    },
                    set: function (newTitle) {
                        this._title = newTitle;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewController.prototype, "childViewControllers", {
                    get: function () {
                        return this._childViewControllers;
                    },
                    enumerable: true,
                    configurable: true
                });
                ViewController.prototype.viewDidLoad = function () { };
                ViewController.prototype.viewWillAppear = function () { };
                ViewController.prototype.viewWillDisappear = function () { };
                ViewController.prototype.viewDidAppear = function () { };
                ViewController.prototype.viewDidDisappear = function () { };
                ViewController.prototype.addChildViewController = function (child) {
                    child.willMoveToParentViewController(this);
                    this.childViewControllers.push(child);
                    child.didMoveToParentViewController(this);
                };
                ViewController.prototype.removeFromParentViewController = function () {
                };
                ViewController.prototype.willMoveToParentViewController = function (parent) {
                };
                ViewController.prototype.didMoveToParentViewController = function (parent) {
                    this.parentViewController = parent;
                };
                ViewController.prototype.render = function () {
                    this.parentViewController.render();
                };
                return ViewController;
            }());
            exports_1("ViewController", ViewController);
            RouteHandler = (function () {
                function RouteHandler(route, handler) {
                    this.route = route;
                    this.handler = handler;
                    this.matcher = null;
                    this.matcher = route_matcher_1.routeMatcher(route);
                }
                RouteHandler.prototype.match = function (fullUrl) {
                    return this.matcher.parse(fullUrl);
                };
                return RouteHandler;
            }());
            QueryString = (function () {
                function QueryString() {
                }
                QueryString.parse = function (str) {
                    var q = {};
                    if (str) {
                        str
                            .split('&')
                            .map(function (v) { return v.split('='); })
                            .forEach(function (v) {
                            q[decodeURIComponent(v[0])] = decodeURIComponent(v[1]);
                        });
                    }
                    return q;
                };
                QueryString.stringify = function (obj) {
                    return Object.keys(obj)
                        .map(function (v) { return encodeURIComponent(v) + "=" + encodeURIComponent(obj[v]); })
                        .join("&");
                };
                return QueryString;
            }());
            Router = (function (_super) {
                __extends(Router, _super);
                function Router(contentEl, options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, {});
                    this.contentEl = contentEl;
                    this.options = options;
                    this._routeHandlers = [];
                    this._defaultRouteHandlers = null;
                    this._currentViewController = null;
                    if (!options.base) {
                        var bases = document.getElementsByTagName('base');
                        if (bases.length > 0) {
                            options.base = bases[0].getAttribute('href');
                        }
                        else {
                            options.base = '';
                        }
                    }
                    this._domPatch = snabbdom.init([
                        class_1.default, props_1.default, style_1.default, eventlisteners_1.default, attributes_1.default
                    ]);
                    this._virtualNode = contentEl;
                    this.bindEvents();
                }
                Router.prototype.bindEvents = function () {
                    var _this = this;
                    window.addEventListener('popstate', function (event) {
                        var hist = event.state;
                        _this.navigateTo(hist.route, hist.params, false);
                    });
                    this.contentEl.parentNode.addEventListener("click", function (e) {
                        if (e.target && e.target.nodeName == "A") {
                            var el = e.target;
                            var href = el.getAttribute('href');
                            // only push state relative urls
                            if (!/^([a-z]+:\/\/|\/\/)/i.test(href)) {
                                e.preventDefault();
                                if (href[0] == '/') {
                                    _this.navigateRaw(href);
                                }
                                else {
                                    _this.navigateRaw(_this.options.base + href);
                                }
                            }
                        }
                    });
                };
                Router.prototype.map = function (route, handler) {
                    this._routeHandlers.push(new RouteHandler(route, handler));
                };
                Router.prototype.mapDefault = function (handler) {
                    this._defaultRouteHandlers = new RouteHandler(null, handler);
                };
                Router.prototype.start = function () {
                    this.navigateRaw(window.location.pathname + window.location.search, false);
                };
                Router.prototype.navigateRaw = function (rawPath, history) {
                    if (history === void 0) { history = true; }
                    var search = rawPath.split('?');
                    var q = QueryString.parse(search[1]);
                    var localPath = search[0].substr(Math.max(this.options.base.length - 1, 0));
                    this.navigateTo(localPath, q, history);
                };
                Router.prototype.navigateTo = function (localPathWithoutQueryString, params, history) {
                    if (history === void 0) { history = true; }
                    if (history) {
                        var search = QueryString.stringify(params);
                        var newUrl = this.options.base + localPathWithoutQueryString.substr(1) + (search.length > 0 ? "?" + search : "");
                        window.history.pushState({
                            route: localPathWithoutQueryString,
                            params: params
                        }, "", newUrl);
                    }
                    for (var _i = 0, _a = this._routeHandlers; _i < _a.length; _i++) {
                        var r = _a[_i];
                        var routeParams = r.match(localPathWithoutQueryString);
                        if (routeParams != null) {
                            _.merge(routeParams, params);
                            r.handler(routeParams);
                            return;
                        }
                    }
                    if (this._defaultRouteHandlers) {
                        this._defaultRouteHandlers.handler(params);
                    }
                };
                Router.prototype.replaceCurrentViewController = function (viewController) {
                    this._currentViewController = viewController;
                    this.render();
                };
                Object.defineProperty(Router.prototype, "currentViewController", {
                    get: function () {
                        return this._currentViewController;
                    },
                    enumerable: true,
                    configurable: true
                });
                Router.prototype.render = function () {
                    this._virtualNode = this._domPatch(this._virtualNode, this.currentViewController.view.getVirtualNode());
                };
                return Router;
            }(ViewController));
            exports_1("Router", Router);
            TestView = (function () {
                function TestView() {
                }
                TestView.prototype.test = function () {
                };
                TestView.prototype.rowLinkForValue = function (val) {
                    return "http://google.com/?q=" + val;
                };
                TestView.prototype.getVirtualNode = function () {
                    var _this = this;
                    return (SnabbdomShim.createElement("div", {prop: "text", "on-click": this.test}, SnabbdomShim.createElement("table", null, SnabbdomShim.createElement("tbody", null, [1, 2].map(function (v) { return SnabbdomShim.createElement("tr", null, SnabbdomShim.createElement("td", null, SnabbdomShim.createElement("a", {href: _this.rowLinkForValue(v)}, v))); })))));
                };
                return TestView;
            }());
        }
    }
});
//# sourceMappingURL=test.js.map