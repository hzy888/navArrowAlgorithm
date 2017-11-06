var Coordinates = require("../geo/Coord.js");

function uniq(b) {
    var e = {};
    var d = [];
    for (var c = 0, a = b.length; c < a; c++) {
        if (!e[b[c]["lat"] + "," + b[c]["lng"]]) {
            d.push(b[c]);
            e[b[c]["lat"] + "," + b[c]["lng"]] = c + "_" + e[b[c]["lat"] + "," + b[c]["lng"]]
        }
    }
    return d
}

function getIntersection(o, n, l, j) {
    var d = o.x,
        m = o.y,
        c = n.x,
        k = n.y,
        b = l.x,
        h = l.y,
        a = j.x,
        f = j.y,
        p = {};
    if (d == c && h == f) {
        p = {
            x: d,
            y: h
        }
    } else {
        if (b == a && m == k) {
            p = {
                x: b,
                y: m
            }
        } else {
            if (m == k && k == h && h == f) {
                p = {
                    x: (c + b) / 2,
                    y: m
                }
            } else {
                if (d == c && c == b && b == a) {
                    p = {
                        x: d,
                        y: (k + h) / 2
                    }
                } else {
                    if (h == f && m != k && d != c) {
                        p.y = h;
                        var e = (c - d) * (p.y - k) / (k - m) + c;
                        p.x = e
                    } else {
                        if (m == k && h != f && b != a) {
                            p.y = m;
                            var e = (b - a) * (p.y - h) / (h - f) + b;
                            p.x = e
                        } else {
                            var g = ((m - k) * (f - h) * d + (f - h) * (c - d) * m + (k - m) * (f - h) * b + (b - a) * (k - m) * h) / ((c - d) * (f - h) + (m - k) * (a - b));
                            var i = b + (a - b) * (g - h) / (f - h);
                            p = {
                                x: i,
                                y: g
                            }
                        }
                    }
                }
            }
        }
    }
    return p
}

function getLine(w, J, n, I) {
    var s = w;
    var F = J;
    var q = s.concat([]).reverse();
    q.dir = "current";
    var b = s.concat([]);
    b.dir = "opposite";
    var c = [];
    for (var C = 0, E = q.length; C < E; C++) {
        if (C < E - 1) {
            c.push([q[C], q[C + 1]])
        }
    }
    c.dir = "current";
    var A = [];
    for (var C = 0, E = b.length; C < E; C++) {
        if (C < E - 1) {
            A.push([b[C], b[C + 1]])
        }
    }
    A.dir = "opposite";
    var B = [];
    var l = {};
    var i = 0,
        f, e;
    for (var z = 0, E = c.length; z < E; z++) {
        var d = calculatePoint(c[z][0], c[z][1], F);
        B.push(d)
    }
    var v = [];
    for (var z = 0, E = B.length; z < E - 1; z++) {
        var t = B[z]["start"];
        var r = B[z]["end"];
        var p = B[z + 1]["start"];
        var o = B[z + 1]["end"];
        var y = getIntersection(t, r, p, o);
        v.push(y)
    }
    v.unshift(B[0]["start"]);
    v.push(B[B.length - 1]["end"]);
    var u = [];
    var H;
    for (var z = 0, E = A.length; z < E; z++) {
        var a = calculatePoint(A[z][0], A[z][1], F);
        u.push(a)
    }
    var x = [];
    for (var z = 0, E = u.length; z < E - 1; z++) {
        var t = u[z]["start"];
        var r = u[z]["end"];
        var p = u[z + 1]["start"];
        var o = u[z + 1]["end"];
        var D = getIntersection(t, r, p, o);
        x.push(D)
    }
    x.unshift(u[0]["start"]);
    x.push(u[u.length - 1]["end"]);
    var g = v.concat(x);
    var h = [];
    for (var z = 0, E = g.length; z < E; z++) {
        var G = new Coordinates.fromMercator({
            "y": g[z].y,
            "x": g[z].x
        });
        var k = new qq.maps.LatLng(G.latitude, G.longitude);
        h.push(k)
    }
    return h
}

function whetherInAtriangle(m, l) {
    var f = l["x"] - m[0]["x"];
    var e = l["y"] - m[0]["y"];
    var k = Math.sqrt(f * f + e * e);
    var d = l["x"] - m[1]["x"];
    var b = l["y"] - m[1]["y"];
    var i = Math.sqrt(d * d + b * b);
    var c = m[1]["x"] - m[0]["x"];
    var a = m[1]["y"] - m[0]["y"];
    var h = Math.sqrt(c * c + a * a);
    var g = Math.acos((i * i + h * h - k * k) / (2 * i * h));
    var j = Math.acos((k * k + h * h - i * i) / (2 * k * h));
    return [g, j]
}

function getRadian(a, d) {
    var f = whetherInAtriangle([a[0], a[1]], d);
    var b = whetherInAtriangle([a[1], a[2]], d);
    var c = whetherInAtriangle([a[2], a[0]], d);
    var e = f[0] + f[1] + b[0] + b[1] + c[0] + c[1];
    return e
}

var test_label = [];
exports.navArrowAlgorithm = function(T, a, F, A) {
    var r = uniq(T),
        B = [],
        o = [],
        P = (a && a / 2) || 10,
        F = F || false;
    var S = Math.PI;
    if (r && r.length > 0) {
        if (F == false) {
            r = r.concat([]).reverse()
        }
        var b = [];
        for (var R = 0, u = r.length; R < u; R++) {
            var M = r[R]["lat"];
            var E = r[R]["lng"];
            var n = new Coordinates(M, E).toMercator();
            b.push([n.y, n.x])
        }
        var B = b.concat([]).reverse();
        B.dir = "current";
        var o = b.concat([]);
        o.dir = "opposite";
        var e = [];
        for (var R = 0, u = B.length; R < u; R++) {
            if (R < u - 1) {
                e.push([B[R], B[R + 1]])
            }
        }
        e.dir = "current";
        var p = [];
        for (var R = 0, u = o.length; R < u; R++) {
            if (R < u - 1) {
                p.push([o[R], o[R + 1]])
            }
        }
        p.dir = "opposite";
        var t = [];
        var w = {};
        var G = 0,
            L, K;
        for (var Q = 0, u = e.length; Q < u; Q++) {
            if (Q == 0) {
                var C = q(e[Q][0], e[Q][1], P * 2);
                w = C["start"]
            }
            var C = q(e[Q][0], e[Q][1], P);
            t.push(C)
        }
        var H = [];
        for (var Q = 0, u = t.length; Q < u - 1; Q++) {
            var i = t[Q]["start"];
            var h = t[Q]["end"];
            var g = t[Q + 1]["start"];
            var f = t[Q + 1]["end"];
            var l = getIntersection(i, h, g, f);
            H.push(l)
        }
        H.unshift(t[0]["start"]);
        H.push(t[t.length - 1]["end"]);
        H.unshift(w);
        var O = [];
        var D;
        for (var Q = 0, u = p.length; Q < u; Q++) {
            var V = q(p[Q][0], p[Q][1], P);
            O.push(V);
            if (Q == u - 1) {
                var V = q(p[Q][0], p[Q][1], P * 2);
                D = V["end"]
            }
        }
        var N = [];
        for (var Q = 0, u = O.length; Q < u - 1; Q++) {
            var i = O[Q]["start"];
            var h = O[Q]["end"];
            var g = O[Q + 1]["start"];
            var f = O[Q + 1]["end"];
            var U = getIntersection(i, h, g, f);
            N.push(U)
        }
        N.unshift(O[0]["start"]);
        N.push(O[O.length - 1]["end"]);
        N.push(D);
        var s = N[N.length - 1];
        var J = H[0];
        var v = q([s.y, s.x], [J.y, J.x], P * 4);
        var d = (v.start.x + v.end.x) / 2;
        var c = (v.start.y + v.end.y) / 2;
        N.push({
            "x": d,
            "y": c
        });
        var k = H.concat(N);
        var z = [];
        for (var Q = 0, u = k.length; Q < u; Q++) {
            var I = new Coordinates.fromMercator({
                "y": k[Q].y,
                "x": k[Q].x
            });
            var y = new qq.maps.LatLng(I.latitude, I.longitude);
            z.push(y)
        }

        function q(j, Z, aa) {
            var m = {},
                ab = {},
                Y = 0,
                ac = 0,
                X = Math.PI,
                ae = j[1] - Z[1],
                ad = j[0] - Z[0];
            var W = Math.sqrt(ae * ae + ad * ad);
            if (ad > 0) {
                ac = Math.acos(ae / W) - Math.PI / 2;
                if (ac < 0) {
                    ac = Math.PI * 2 + ac
                }
            } else {
                ac = Math.PI * 2 - Math.acos(ae / W) - Math.PI / 2
            }
            m.x = j[1] + aa * Math.cos(ac);
            m.y = j[0] + aa * Math.sin(ac);
            ab.x = Z[1] + aa * Math.cos(ac);
            ab.y = Z[0] + aa * Math.sin(ac);
            return {
                start: m,
                end: ab,
                angle: ac
            }
        }
        return z
    }

    function x(j) {
        return function(Y, X) {
            var W = Y[j] * 1;
            var m = X[j] * 1;
            return m - W
        }
    }
};