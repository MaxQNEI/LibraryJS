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

    const CONSTLIST = {
        DRAW_TYPE_CIRCLE: 0,
        DRAW_TYPE_LINE: 1,
        DRAW_TYPE_PATH: 2,
        DRAW_TYPE_RECT: 3,
        DRAW_TYPE_TEXT: 4,
        DRAW_STYLE_HARD: 0,
        DRAW_STYLE_SMOOTH: 1,
    };

    // Properties ----------------------------------------------------------- //
    var SVG;

    // Constructor ---------------------------------------------------------- //
    function SVGStatisticsInstance() {
        return SVGStatisticsInstance;
    }

    for(var k in CONSTLIST) {
        Object.defineProperty(SVGStatisticsInstance, k, { enumerable: true, value: CONSTLIST[k] });
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
                fill: '#ffffff',
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
            GetOffset: { enumerable: true, value: function GetOffset() {
                const isYReverse = ([ 'text' ]).includes(this.localName);

                var Size = this.GetSize();
                var x = parseFloat(this.Get('x'));
                var y = parseFloat(this.Get('y'));

                return {
                    top: y + (isYReverse ? -Size.height : 0),
                    left: x,
                    right: x + Size.width,
                    bottom: y + (!isYReverse ? Size.height : 0),
                };
            } },
            GetWidth: { enumerable: true, value: function GetWidth() {
                return this.GetSize().width;
            } },
            GetHeight: { enumerable: true, value: function GetHeight() {
                return this.GetSize().height;
            } },
            GetOffsetTop: { enumerable: true, value: function GetOffsetTop() {
                return this.GetOffset().top;
            } },
            GetOffsetLeft: { enumerable: true, value: function GetOffsetLeft() {
                return this.GetOffset().left;
            } },
            GetOffsetRight: { enumerable: true, value: function GetOffsetRight() {
                return this.GetOffset().right;
            } },
            GetOffsetBottom: { enumerable: true, value: function GetOffsetBottom() {
                return this.GetOffset().bottom;
            } },
        });

        return Element;
    }

    function Generate(data) {
        if(!data.hasOwnProperty('values')) {
            throw new Error(`data.values is't defined!`);
        }

        if(!data.hasOwnProperty('draw')) {
            console.warn(`data.draw is'n defined! Use defaults: rect / #222222`);
            data.draw = { type: CONSTLIST.DRAW_TYPE_RECT, fill: '#222222' };
        }

        if(!data.draw.hasOwnProperty('type')) {
            console.warn(`data.draw is'n defined! Use defaults: rect`);
        }

        data.minY = (data.minY || 0);
        data.maxY = (data.maxY || 0);
        for(var i = 0; i < data.values.length; i++) {
            data.minY = (data.minY > data.values[i] ? data.values[i] : data.minY);
            data.maxY = (data.maxY < data.values[i] ? data.values[i] : data.maxY);
        }

        var SVGWidth = SVG.GetWidth();
        var SVGHeight = SVG.GetHeight();

        var ParentOffset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        };

        if(data.hasOwnProperty('titleY')) {
            var TitleY;
            if(data.titleY instanceof Object) {
                TitleY = DrawText({
                    text: data.titleY.text,
                    'font-size': (data.titleY.fontSize || data.titleY['font-size']),
                    'font-weight': (data.titleY.fontWeight || data.titleY['font-weight']),
                });
            } else {
                TitleY = DrawText({
                    text: data.titleY,
                    'font-size': '24px',
                    'font-weight': 'bold',
                });
            }

            var TitleOffsetY = TitleY.SetX(20).SetY(20).GetOffsetBottom();
            // ParentOffset.top += TitleOffsetY;

            SVG.Append(TitleY);
        }

        var Parent = SVG;
        var Parent = CreateSVGElement('svg').Set({
            // 'x': ParentOffset.left,
            // 'y': ParentOffset.bottom,
            'viewBox': `0 0 ${SVGWidth-ParentOffset.right} ${SVGHeight-ParentOffset.bottom}`,
        });
        SVG.Append(Parent);

        var ParentWidth = Parent.GetWidth();
        var ParentHeight = Parent.GetHeight();
        var ColumnWidth = (ParentWidth / data.values.length);
        var Path;
        var SW = 6, SW_2 = SW / 2; // Stroke width

        var x, y, cx, cy, r
        for(var i = 0, y, f; i < data.values.length; i++) {
            y = (data.values[i] / data.maxY);

            if(data.draw.type == CONSTLIST.DRAW_TYPE_RECT) {
                if(data.draw.fill == 'GRADIENT-WARNING') {
                    f = ([
                        '#',
                        parseInt(y * (0xFF - 0x44) + 0x44).toString(16).padStart(2, 0),
                        parseInt((1 - y) * (0xFF - 0x44) + 0x44).toString(16).padStart(2, 0),
                        parseInt(0x44).toString(16).padStart(2, 0)
                    ]).join('');
                } else {
                    f = (data.draw.fill || '#4499ff');
                }

                Parent.Append(DrawRect({
                    x: ColumnWidth * i,
                    y: ParentHeight - (y * ParentHeight),
                    width: ColumnWidth,
                    height: (y * 100) + '%',
                    fill: f,
                }));

                continue;
            }

            if(data.draw.type == CONSTLIST.DRAW_TYPE_CIRCLE) {
                f = (data.draw.fill || '#4499ff');

                r = radius || (ColumnWidth / 2);
                cx = (ColumnWidth * i) + r;
                cy = (ParentHeight - (y * (ParentHeight + (ColumnWidth / 2)))) + r;

                cy = cy + ((cy / ParentHeight) * (-(r * 2) - r) + r);

                Parent.Append(DrawCircle({
                    cx: cx,
                    cy: cy,
                    r: r,
                    fill: f,
                }));

                continue;
            }

            if(data.draw.type == CONSTLIST.DRAW_TYPE_PATH) {
                f = (data.draw.fill || '#4499ff');

                Path ||
                    Parent.Append(Path = DrawPath({
                        'draw-style': (data.draw.style || 'hard'),
                    }).Set({
                        'stroke': f,
                        'stroke-width': SW,
                        'stroke-linejoin': 'round',
                        'fill': 'transparent',
                    }))
                ;

                x = (ColumnWidth * i) + (ColumnWidth / 2);
                y = (ParentHeight - (y * ParentHeight));

                y = y + ((y / ParentHeight) * (-SW_2 - SW_2) + SW_2);

                Path.AddPoint(x, y);

                continue;
            }

            throw new Error(`Unknown data.type '${data.draw.type}'!`);
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

        const SetKeys = ['x1', 'y1', 'x2', 'y2', 'stroke', ];
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

        Object.defineProperties(Text, {
            SetX: { enumerable: true, value: function SetX(x) {
                return this.Set('x', x);
            } },
            SetY: { enumerable: true, value: function SetY(y) {
                return this.Set('y', (y + this.GetHeight()));
            } },
        });

        var x = params.x || 0;
        var y = params.y || 0;
        var text = params.text || '';

        const SetKeys = ['x', 'y', 'font-family', 'font-size', 'font-weight', 'fill'];
        for(var i = 0; i < SetKeys.length; i++) {
            if(params.hasOwnProperty(SetKeys[i])) {
                Text.Set(SetKeys[i], params[SetKeys[i]]);
            }
        }

        Text.textContent = text;

        Text.SetX(x).SetY(y);

        return Text;
    }
}
