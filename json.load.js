'use strict';

Object.defineProperties(JSON, {
    Load: { enumerable: true, value: function Load(url, callback) {
        const XHR = new XMLHttpRequest;

        XHR.overrideMimeType('application/json; charset=UTF-8');

        XHR.addEventListener('readystatechange', function() {
            !(XHR.readyState === XHR.DONE && XHR.status === 200) ||
                callback(JSON.parse(XHR.responseText));
        });

        XHR.open('GET', url);
        XHR.send(null);
    } },
});
