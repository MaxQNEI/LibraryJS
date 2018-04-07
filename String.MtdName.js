'use strict';

Object.defineProperties(String, {
	MtdName: { enumerable: true, value: function MtdName(string) {
		string = string.split(/[^A-Za-z0-9]+/i);
		string.map(function(v,i) {
			string[i] = `${v.substr(0, 1).toUpperCase()}${v.substr(1).toLowerCase()}`;
		});
		return string.join('');
	} },
});

Object.defineProperties(String.prototype, {
	MtdName: { enumerable: true, value: function() {
		return String.MtdName(this);
	} }
});
