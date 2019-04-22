'use strict';

Object.defineProperties(window, {
    Rand: { enumerable: true, value: function Rand(a,b) {
        return Math.round(Math.random()*(b-a)+a);
    } },
    RandHex2: { enumerable: true, value: function RandHex2(a,b) {
        return Rand(a,b).toString(16).padStart(2, 0);
    } },
    RandHex6: { enumerable: true, value: function RandHex6(a,b) {
        return ([RandHex2(a,b),RandHex2(a,b),RandHex2(a,b)]).join('');
    } },
    RandString: { enumerable: true, value: function RandString(length) {
        var z = [];
        for(var i = 0; z.length < length; i++) {
            z.push(`${String.fromCharCode(Math.floor(Math.random()*(126-33)+33))}`);
        }
        return z.join('');
    } },
});
