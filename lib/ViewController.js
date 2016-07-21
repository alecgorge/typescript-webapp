/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ViewController;
    return {
        setters:[],
        execute: function() {
            ViewController = (function () {
                function ViewController(params) {
                    this.params = params;
                    this._view = null;
                    this._title = null;
                    this._childViewControllers = [];
                    this.parentViewController = null;
                    this.router = null;
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
        }
    }
});
//# sourceMappingURL=ViewController.js.map