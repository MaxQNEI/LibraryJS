'use strict';

Object.defineProperties(JSON, {
    Request: { enumerable: true, value: function Request(url, data, callback) {
        var Debug = (Debug && Debug()) || function() { return false; };

        !Debug() || console.log(`JSON.Request()`);

        const XHR = new XMLHttpRequest;

        url = url || '';
        if(data instanceof Function || typeof data == 'function') {
            callback = data;
            data = null;
        }
        callback = callback || function(response) {};

        XHR.addEventListener('readystatechange', function() {
            if(XHR.readyState === XHR.DONE) {
                if(XHR.status === 200) {
                    var ContentType = (XHR.getResponseHeader('Content-Type') || '');

                    if(ContentType.match(/^application\/json$/)) {
                        callback(JSON.parse(XHR.responseText));
                    } else {
                        console.error(`JSON.Request(): Response Content-Type '${ContentType}', requires 'application/json'!`);
                    }
                } else {
                    console.error(`JSON.Request(): ${XHR.status} ${XHR.statusText}`);
                }
            }
        });

        XHR.open('POST', url);
        XHR.setRequestHeader('Accept', 'application/json');
        XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        XHR.setRequestHeader('X-Request-With', 'XMLHttpRequest');
        XHR.send(JSON.stringify(data));
    } },
});
