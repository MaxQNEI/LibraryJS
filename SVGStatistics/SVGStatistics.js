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

    });

    return Init();

    // Methods -------------------------------------------------------------- //
    function Init() {
        var TMPID = `SVGStatistics-${GUID()}`;
        document.write(`<svg id="${TMPID}"></svg>`);
        SVG = document.querySelector(`#${TMPID}`);

        if(Identifier) { SVG.setAttribute('id', Identifier); }
        else { delete SVG.removeAttribute('id'); }

        Object.assign(SVG.style, {
            width: `${Width}px`,
            height: `${Height}px`,
        });

        SVG.setAttribute('viewBox', `0 0 ${Width} ${Height}`);

        return SVGStatisticsInstance;
    }

    function GUID() {
        function s4() {
            return Math.round((Math.random()+1)*1e5).toString(16).substr(1,4);
        }
        return ([s4(),s4(),'-',s4(),'-',s4(),'-',s4(),'-',s4(),s4(),s4()]).join('');
    }
}
