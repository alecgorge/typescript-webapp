/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />
System.register(['snabbdom', 'route-matcher', 'lodash', 'snabbdom/modules/class', 'snabbdom/modules/props', 'snabbdom/modules/style', 'snabbdom/modules/eventlisteners', 'snabbdom/modules/attributes', './ViewController', './QueryString'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var snabbdom, route_matcher_1, _, class_1, props_1, style_1, eventlisteners_1, attributes_1, ViewController_1, QueryString_1;
    var RouterNavigationType, RouteHandler, Router;
    return {
        setters:[
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
            },
            function (ViewController_1_1) {
                ViewController_1 = ViewController_1_1;
            },
            function (QueryString_1_1) {
                QueryString_1 = QueryString_1_1;
            }],
        execute: function() {
            (function (RouterNavigationType) {
                RouterNavigationType[RouterNavigationType["HTML5PushState"] = 1] = "HTML5PushState";
                RouterNavigationType[RouterNavigationType["LocationHash"] = 2] = "LocationHash";
            })(RouterNavigationType || (RouterNavigationType = {}));
            exports_1("RouterNavigationType", RouterNavigationType);
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
            Router = (function (_super) {
                __extends(Router, _super);
                function Router(contentEl, options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, {});
                    this.contentEl = contentEl;
                    this.options = options;
                    this._routeHandlers = [];
                    this._routeMapper = {};
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
                    if (!options.navigationType) {
                        options.navigationType = RouterNavigationType.LocationHash;
                        options.base = "#/";
                    }
                    this._domPatch = snabbdom.init([
                        class_1.default, props_1.default, style_1.default, eventlisteners_1.default, attributes_1.default
                    ]);
                    this._virtualNode = contentEl;
                    this.bindEvents();
                }
                Router.prototype.html5events = function () {
                    var _this = this;
                    window.addEventListener('popstate', function (event) {
                        var hist = event.state;
                        _this.navigateTo(hist.route, hist.params, false);
                    });
                    document.addEventListener("click", function (e) {
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
                Router.prototype.hashEvents = function () {
                    var _this = this;
                    window.addEventListener('hashchange', function (e) { return _this.onHashChange(); }, false);
                };
                Router.prototype.onHashChange = function () {
                    var loc = "/" + window.location.hash.replace(/^#\/?|\/$/g, '');
                    this.navigateRaw(loc, false);
                };
                Router.prototype.bindEvents = function () {
                    if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
                        this.html5events();
                    }
                    else {
                        this.hashEvents();
                    }
                };
                Router.prototype.map = function (identifier, route, handler) {
                    var id = identifier + "";
                    if (this._routeMapper[id]) {
                        throw new Error("Duplicate route identifier '" + id + "'");
                    }
                    var hdlr = new RouteHandler(route, handler);
                    this._routeHandlers.push(hdlr);
                    this._routeMapper[id] = hdlr;
                };
                Router.prototype.mapDefault = function (handler) {
                    this._defaultRouteHandlers = new RouteHandler(null, handler);
                };
                Router.prototype.start = function () {
                    if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
                        this.navigateRaw(window.location.pathname + window.location.search, false);
                    }
                    else {
                        this.onHashChange();
                    }
                };
                Router.prototype.makeLink = function (routeIdentifier, params) {
                    var id = routeIdentifier + "";
                    if (!this._routeMapper[id]) {
                        throw new Error("No route with identifier '" + id + "'");
                    }
                    var base = '#/';
                    if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
                        base = this.options.base;
                    }
                    return base + this._routeMapper[id].matcher.stringify(params);
                };
                Router.prototype.navigateRaw = function (rawPath, history) {
                    if (history === void 0) { history = true; }
                    var search = rawPath.split('?');
                    var q = QueryString_1.QueryString.parse(search[1]);
                    var localPath = search[0].substr(Math.max(this.options.base.length - 1, 0));
                    if (localPath == "") {
                        localPath = "/";
                    }
                    this.navigateTo(localPath, q, history);
                };
                Router.prototype.navigateTo = function (localPathWithoutQueryString, params, history) {
                    if (history === void 0) { history = true; }
                    if (history) {
                        var search = QueryString_1.QueryString.stringify(params);
                        var newUrl = this.options.base + localPathWithoutQueryString.substr(1) + (search.length > 0 ? "?" + search : "");
                        if (this.options.navigationType == RouterNavigationType.HTML5PushState) {
                            window.history.pushState({
                                route: localPathWithoutQueryString,
                                params: params
                            }, "", newUrl);
                        }
                        else {
                            window.location.hash = newUrl;
                        }
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
                    viewController.willMoveToParentViewController(this);
                    var oldVc = this._currentViewController;
                    if (oldVc) {
                        oldVc.willMoveToParentViewController(null);
                    }
                    this._currentViewController = viewController;
                    this.render();
                    viewController.didMoveToParentViewController(this);
                    if (oldVc) {
                        oldVc.removeFromParentViewController();
                    }
                };
                Object.defineProperty(Router.prototype, "currentViewController", {
                    get: function () {
                        return this._currentViewController;
                    },
                    enumerable: true,
                    configurable: true
                });
                Router.prototype.render = function () {
                    this.title = this.currentViewController.title;
                    if (this.titleFormatter) {
                        document.title = this.titleFormatter(this, this.currentViewController);
                    }
                    this._virtualNode = this._domPatch(this._virtualNode, this.currentViewController.view.getVirtualNode());
                };
                return Router;
            }(ViewController_1.ViewController));
            exports_1("Router", Router);
        }
    }
});
//# sourceMappingURL=Router.js.map