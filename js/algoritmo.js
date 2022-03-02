/**
 * @param {Object} p1 Ponto e distância: { x, y, r }
 * @param {Object} p2 Ponto e distância: { x, y, r }
 * @param {Object} p3 Ponto e distância: { x, y, r }
 * @param {Object} p4 Ponto e distância: { x, y, r }
 * @param {Object} p5 Ponto e distância: { x, y, r }
 * @return {Object} { x, y } ou [ { x, y }, { x, y } ] ou null
 */

function multilaterar(p1, p2, p3, p4, p5) {
    function quadrado(n) {
        return n * n;
    }
    a = -2 * p1.x + 2 * p2.x;
    b = -2 * p1.y + 2 * p2.y;
    c = quadrado(p1.r) - quadrado(p2.r) - quadrado(p1.x) + quadrado(p2.x) - quadrado(p1.y) + quadrado(p2.y);
    d = -2 * p2.x + 2 * p3.x;
    e = -2 * p2.y + 2 * p3.y;
    f = quadrado(p2.r) - quadrado(p3.r) - quadrado(p2.x) + quadrado(p3.x) - quadrado(p2.y) + quadrado(p3.y);
    g = -2 * p3.x + 2 * p4.x;
    h = -2 * p3.y + 2 * p4.y;
    i = quadrado(p3.r) - quadrado(p4.r) - quadrado(p3.x) + quadrado(p4.x) - quadrado(p3.y) + quadrado(p4.y);
    j = -2 * p4.x + 2 * p5.x;
    k = -2 * p4.y + 2 * p5.y;
    l = quadrado(p4.r) - quadrado(p5.r) - quadrado(p4.x) + quadrado(p5.x) - quadrado(p4.y) + quadrado(p5.y);

    px = (c * e - f * b) / (e * a - b * d);
    py = (i * j - g * l) / (h * j - g * k); 

    p = {
        x: px,
        y: py,
        r: 0
    };

    return p;
}