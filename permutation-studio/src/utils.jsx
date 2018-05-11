/* @flow */


export function HSVtoRGB(h: number, s: number, v: number): {r: string|number, g: string|number, b: string|number} {
    var r = 0, g = 0, b = 0, i = 0, f = 0, p = 0, q = 0, t = 0;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function pad2(s) {
    if(s.length == 1) return '0' + s;
    else return s;
}

export function getRandomColor() {
    const h = Math.random()*2*Math.PI; // Keep random
    const s = 0.5 + Math.round(Math.random()*2)*.25; // Ternary (50%, 75%, 100%)
    const v = 0.5 + Math.round(Math.random()*2)*.25; // Ternary (50%, 75%, 100%)

    var rgb = HSVtoRGB(h, s, v);

    // $FlowFixMe
    rgb.r = pad2(rgb.r.toString(16));
    // $FlowFixMe
    rgb.g = pad2(rgb.g.toString(16));
    // $FlowFixMe
    rgb.b = pad2(rgb.b.toString(16));
    
    // console.log(rgb)

    return '#' + rgb.r + rgb.g + rgb.b;
}