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

    const Defaults = {
        svg: {
            fill: '#ffffff',
        },
        text: {
            family: 'sans-serif',
            size: 12,
            weight: 'normal',
            color: '#000000'
        },
    };

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

        Generate: { enumerable: true, value: Generate },

        Append: { enumerable: true, value: function Append() {
            return SVG.Append.apply(SVG, arguments);
        } },

        DrawCircle: { enumerable: true, value: DrawCircle },
        DrawLine: { enumerable: true, value: DrawLine },
        DrawRect: { enumerable: true, value: DrawRect },
        DrawText: { enumerable: true, value: DrawText },
    });

    return Init();

    // Methods -------------------------------------------------------------- //
    function Init() {
        SVG = CreateSVGElement('svg');

        if(Identifier) { SVG.setAttribute('id', Identifier); }
        else { delete SVG.removeAttribute('id'); }

        SVG.Set({
            'viewBox': `0 0 ${Width} ${Height}`,
        });

        SVG.Append(
            DrawRect({
                x: 0, y: 0,
                width: SVG.viewBox.baseVal.width,
                height: SVG.viewBox.baseVal.height,
                fill: (StatisticsObject.fill || Defaults.svg.fill),
            })
        );

        return SVGStatisticsInstance;
    }

    function CreateSVGElement(name) {
        const Element = document.createElementNS(`http://www.w3.org/2000/svg`, name);

        !SVG || (Element.Parent = SVG);

        Object.defineProperties(Element, {
            Set: { enumerable: true, value: function Set(n, v) {
                if(n instanceof Object && v === undefined) {
                    for(var _n in n) {
                        this.Set(_n, n[_n]);
                    }

                    return this;
                }

                this.setAttribute(n, v);
                return this;
            } },
            Get: { enumerable: true, value: function Get(n) {
                return this.getAttribute(n);
            } },
            Append: { enumerable: true, value: function Append(element) {
                if(element instanceof Array) {
                    for(var i = 0; i < element.length; i++) {
                        this.Append(element[i]);
                    }
                    return this;
                }
                element.Parent = this;
                this.appendChild(element);
                return this;
            } },
            GetSize: { enumerable: true, value: function GetSize() {
                if(this.localName == 'svg') {
                    return {
                        width: this.viewBox.baseVal.width,
                        height: this.viewBox.baseVal.height,
                    };
                }

                const SVGHasElement = SVG.contains(this)
                if(!SVGHasElement) { SVG.appendChild(this); }

                const BCR = this.getBoundingClientRect();

                if(!SVGHasElement) { SVG.removeChild(this); }
                return { width: BCR.width, height: BCR.height };
            } },
            GetWidth: { enumerable: true, value: function GetWidth() {
                return this.GetSize().width;
            } },
            GetHeight: { enumerable: true, value: function GetHeight() {
                return this.GetSize().height;
            } },
        });

        return Element;
    }

    function Generate(data) {
        if(!data.hasOwnProperty('values')) {
            throw new Error(`data.values is't defined!`);
        }

        var type = data.type || 'rect';
        var color = data.color || '#222222';
        var radius = data.radius;
        var drawStyle = data.drawStyle;

        var values = data.values;
        var totalX = values.length;
        var minY = 0, maxY = 0;
        for(var i = 0; i < values.length; i++) {
            minY = (minY > values[i] ? values[i] : minY);
            maxY = (maxY < values[i] ? values[i] : maxY);
        }

        var SVGWidth = SVG.GetWidth();
        var SVGHeight = SVG.GetHeight();
        var ColumnWidth = (SVGWidth / totalX);
        var Path;
        var SW = 6, SW_2 = SW / 2; // Stroke width

        var x, y, cx, cy, r
        for(var i = 0, y, c; i < values.length; i++) {
            y = (values[i] / maxY);

            if(type == 'rect') {
                if(color == 'GRADIENT-WARNING') {
                    c = ([
                        '#',
                        parseInt(y * (0xFF - 0x44) + 0x44).toString(16).padStart(2, 0),
                        parseInt((1 - y) * (0xFF - 0x44) + 0x44).toString(16).padStart(2, 0),
                        parseInt(0x44).toString(16).padStart(2, 0)
                    ]).join('');
                } else {
                    c = (color || '#4499ff');
                }

                SVG.Append(DrawRect({
                    x: ColumnWidth * i,
                    y: SVGHeight - (y * SVGHeight),
                    width: ColumnWidth,
                    height: (y * 100) + '%',
                    fill: c,
                }));

                continue;
            }

            if(type == 'circle') {
                c = (color || '#4499ff');

                r = radius || (ColumnWidth / 2);
                cx = (ColumnWidth * i) + r;
                cy = (SVGHeight - (y * (SVGHeight + (ColumnWidth / 2)))) + r;

                cy = cy + ((cy / SVGHeight) * (-(r * 2) - r) + r);

                SVG.Append(DrawCircle({
                    cx: cx,
                    cy: cy,
                    r: r,
                    fill: c,
                }));

                continue;
            }

            if(type == 'path') {
                c = (color || '#4499ff');

                Path ||
                    SVG.Append(Path = DrawPath({
                        'draw-style': (drawStyle || 'hard'),
                    }).Set({
                        'stroke': c,
                        'stroke-width': SW,
                        'stroke-linejoin': 'round',
                        'fill': 'transparent',
                    }))
                ;

                x = (ColumnWidth * i) + (ColumnWidth / 2);
                y = (SVGHeight - (y * SVGHeight));

                y = y + ((y / SVGHeight) * (-SW_2 - SW_2) + SW_2);

                Path.AddPoint(x, y);

                continue;
            }

            throw new Error(`Unknown data.type '${type}'!`);
        }

        // !Path || console.log(Path.Get('d'));
        // !Path || console.log(Path.points);
    }

    function DrawCircle(params) {
        const Circle = CreateSVGElement('circle');

        const SetKeys = ['cx', 'cy', 'r', 'fill'];
        for(var i = 0; i < SetKeys.length; i++) {
            if(params.hasOwnProperty(SetKeys[i])) {
                Circle.Set(SetKeys[i], params[SetKeys[i]]);
            }
        }

        return Circle;
    }

    function DrawLine(params) {
        const Line = CreateSVGElement('line');

        const SetKeys = ['x1', 'y1', 'x2', 'y2', 'stroke'];
        for(var i = 0; i < SetKeys.length; i++) {
            if(params.hasOwnProperty(SetKeys[i])) {
                Line.Set(SetKeys[i], params[SetKeys[i]]);
            }
        }

        return Line;
    }

    function DrawPath(params) {
        const Path = CreateSVGElement('path');

        const drawstylelist = [ 'hard', 'smooth' ];
        var drawstyle = (params.drawStyle || params['draw-style']) || 'hard';

        Object.defineProperties(Path, {
            points: { enumerable: true, value: [] },
            SetDrawStyle: { enumerable: true, value: function SetDrawStyle(name) {
                if(!name || !drawstylelist.includes(name)) {
                    console.warn(`Unknown draw style '${name}'!`);
                    return false;
                }

                drawstyle = name;
                return this.Update();
            } },
            AddPoint: { enumerable: true, value: function AddPoint(x, y) {
                this.points.push([x, y]);
                return this.Update();
            } },
            Update: { enumerable: true, value: function Update() {
                if(!this.points.length) {
                    return this;
                }

                var parentWidth = this.Parent.GetWidth();
                var parentHeight = this.Parent.GetHeight();
                var pd = []; // Path description
                var pp; // Previous point
                var mp; // Middle point
                for(var i = 0, p, x, y; i < this.points.length; i++) {
                    p = this.points[i];
                    x = p[0];
                    y = p[1];

                    if(!i) {
                        pd.push(`M ${x} ${y}`);
                        (drawstyle != 'hard') || pd.push(`C ${x} ${y}`);

                        (drawstyle != 'smooth') || pd.push(`C ${x} ${y}`);
                    } else {
                        (drawstyle != 'hard') || pd.push(`${x} ${y} ${x} ${y} ${x} ${y}`);

                        (drawstyle != 'smooth') || (mp = `${(pp[0]+x)/2} ${(pp[1]+y)/2}`);
                        (drawstyle != 'smooth') || pd.push(`${mp} ${x} ${y}`);
                    }

                    pp = p;
                }
                (drawstyle != 'hard') || pd.push(`Z`);

                (drawstyle != 'smooth') || (mp = `${(pp[0]+x)/2} ${(pp[1]+y)/2}`);
                (drawstyle != 'smooth') || pd.push(`${pp[0]} ${pp[1]} ${pp[0]} ${pp[1]} ${pp[0]} ${pp[1]} Z`);
                this.Set('d', pd.join(' '));

                return this;
            } },
        });

        Path.SetDrawStyle(drawstyle);

        return Path;
    }

    function DrawRect(params) {
        const Rect = CreateSVGElement('rect');

        const SetKeys = ['x', 'y', 'width', 'height', 'fill'];
        for(var i = 0; i < SetKeys.length; i++) {
            if(params.hasOwnProperty(SetKeys[i])) {
                Rect.Set(SetKeys[i], params[SetKeys[i]]);
            }
        }

        return Rect;
    }

    function DrawText(params) {
        var Text = CreateSVGElement('text');

        (family === undefined) || Text.Set('font-family', family);
        (size === undefined) || Text.Set('font-size', size);
        (weight === undefined) || Text.Set('font-weight', weight);
        (color === undefined) || Text.Set('fill', color);

        Text.textContent = text;

        Text.Set({
            x: x,
            y: (y + Text.GetHeight()),
        });

        return Text;
    }
}
