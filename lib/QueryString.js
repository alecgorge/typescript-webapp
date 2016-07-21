System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var QueryString;
    return {
        setters:[],
        execute: function() {
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
            exports_1("QueryString", QueryString);
        }
    }
});
//# sourceMappingURL=QueryString.js.map