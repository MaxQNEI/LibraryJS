'use strict';

function SVGStatistics(StatisticsObject) {
    if(!(this instanceof SVGStatistics)) {
        return new SVGStatistics(StatisticsObject);
    }

    // Constants ------------------------------------------------------------ //
    const Identifier = StatisticsObject.id || null;
    const Viewbox = (StatisticsObject.viewbox || '300x150').split('x');
    const Width = parseInt(Viewbox[0]);
    const Height = parseInt(Viewbox[1]);

    // Properties ----------------------------------------------------------- //
    var SVG;

    // Constructor ---------------------------------------------------------- //
    function SVGStatisticsInstance() {
        return SVGStatisticsInstance;
    }

    Object.defineProperties(SVGStatisticsInstance, {
        GetSVG: { enumerable: true, value: function GetSVG() {
            return SVG;
        } },

        Append: { enumerable: true, value: function() {
            return SVG.Append.apply(SVG, arguments);
        } },

        CreateGroup: { enumerable: true, value: CreateGroup },
        DrawLine: { enumerable: true, value: DrawLine },
        DrawText: { enumerable: true, value: DrawText },
    });

    return Init();

    // Methods -------------------------------------------------------------- //
    function Init() {
        SVG = CreateElementSVG('svg');

        Object.defineProperties(SVG, {
            Append: { enumerable: true, value: Append },
        });

        if(Identifier) { SVG.setAttribute('id', Identifier); }
        else { delete SVG.removeAttribute('id'); }

        SVG.Set('viewBox', `0 0 ${Width} ${Height}`);

        return SVGStatisticsInstance;
    }

    function CreateElementSVG(name) {
        const Element = document.createElementNS(`http://www.w3.org/2000/svg`, name);

        Object.defineProperties(Element, {
            Set: { enumerable: true, value: function Set(n, v) {
                if(n instanceof Object && v === undefined) {
                    for(var _n in n) {
                        Element.Set(_n, n[_n]);
                    }

                    return Element;
                }

                Element.setAttribute(n, v);
                return Element;
            } },
        });

        return Element;
    }

    function CreateGroup() {
        const Group = CreateElementSVG('g');

        Object.defineProperties(Group, {
            Append: { enumerable: true, value: Append },
        });

        return Group;
    }

    function Append(element) {
        this.appendChild(element);
        return this;
    }

    function DrawLine(params) {
        var x1 = ((params.x1)) + '%';
        var y1 = (100 - (params.y1)) + '%';
        var x2 = ((params.x2)) + '%';
        var y2 = (100 - (params.y2)) + '%';
        var color = params.color;
        var width = params.width;

        if(x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
            throw new Error(`x1: ${x1}; y1: ${y1}; x2: ${x2}; y2: ${y2}`);
        }

        var Line = CreateElementSVG('line');
        Line.Set({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: color,
            'stroke-width': width,
        });

        return Line;
    }

    function DrawText(params) {
        var x = (parseInt(params.x)) + '%';
        var y = (100 - parseInt(params.y)) + '%';
        var text = (params.text || '').toString().trim() || null;
        var family = params.family;
        var size = params.size;
        var weight = params.weight;
        var color = params.color;

        if(x === undefined || y === undefined || !text) {
            throw new Error(`x: ${x}; y: ${y}; text: ${text}`);
        }

        var Text = CreateElementSVG('text');
        Text.Set({
            x: x,
            y: y,
        });

        (family === undefined) || Text.Set('font-family', family);
        (size === undefined) || Text.Set('font-size', size);
        (weight === undefined) || Text.Set('font-weight', weight);
        (color === undefined) || Text.Set('fill', color);

        Text.textContent = text;

        return Text;
    }
}
