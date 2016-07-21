/// <reference path="../typings/index.d.ts" />
/// <reference path="./sab.d.ts" />
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var View;
    return {
        setters:[],
        execute: function() {
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
        }
    }
});
//# sourceMappingURL=View.js.map