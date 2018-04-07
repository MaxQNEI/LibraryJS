'use strict';

Object.defineProperties(window, {
	Require: { enumerable: true, value: function Require(name, callback) {
		console.log(`window.Require()`);

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = name;
		script.addEventListener('load', callback || function callback() {
			console.log(`window.Require(): ${this.src} loaded.`);
		});

		document.head.appendChild(script);
	} }
});
