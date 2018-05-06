'use strict';

window.addEventListener('load', InitExample);

function InitExample() {
    if(!(this instanceof InitExample)) {
        return new InitExample;
    }

    // ---------------------------------------------------------------------- //
    const SVG = SVGStatistics({ id: 'SVGStatistics', viewbox: '1920x640' });
    const SVGWrap = document.querySelector('#SVGWrap');

    SVGWrap.appendChild(SVG.GetSVG());

    // ---------------------------------------------------------------------- //
    JSON.Load('./data.json', function(data) {
        SVG.Generate(data);

        SVG.Generate(
            Object.assign({}, data, {
                type: 'path',
                drawStyle: 'hard',
                color: '#4466FF',
            })
        );

        SVG.Generate(
            Object.assign({}, data, {
                type: 'path',
                drawStyle: 'smooth',
                color: '#DD66FF',
            })
        );

        var values = [], max = 1000, min = 500;
        for(var i = 0; i < 100; i++) {
            values.push((Math.sin(i / 10) * (max - min) + min));
        }
        SVG.Generate({ type: 'circle', radius: 5, color: '#4499FF', values: values });

        var values = [], max = 10, min = 7;
        for(var i = 0; i < 1000; i++) {
            values.push((Math.cos(i / 10) * (max - min) + min) * (1 - (i / 1000)));
        }
        SVG.Generate({ color: 'GRADIENT-WARNING', values: values });
    });

    function Rand(a, b) {
        return (Math.random() * (b - a) + a);
    }
};
