'use strict';

Object.defineProperties(JSON, {
	Request: { enumerable: true, value: function Request(url, data, callback) {
		!Debug || console.log(`JSON.Request()`);

		const XHR = new XMLHttpRequest;

		url = url || '';
		if(data instanceof Function || typeof data == 'function') {
			callback = data;
			data = null;
		}
		callback = callback || function(response) {};

		XHR.addEventListener('readystatechange', function() {
			if(XHR.readyState === XHR.DONE) {
				callback(JSON.parse(XHR.responseText));
			}
		});

		XHR.open('POST', url);
		XHR.setRequestHeader('Accept', 'application/json');
		XHR.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		XHR.setRequestHeader('X-Request-With', 'XMLHttpRequest');
		XHR.send(JSON.stringify(data));
	} },
});
