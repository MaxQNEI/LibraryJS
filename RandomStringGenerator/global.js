"use strict";

window.addEventListener('load', function() {
    const DOMString = document.querySelector('.string');
    const DOMLength = document.querySelector('.length');
    const DOMGenerate = document.querySelector('.generate');

    const DefaultLength = 16;

    DOMString.placeholder = RandomString(GetLength());

    DOMGenerate.addEventListener('click', function() {
        DOMString.value = RandomString(GetLength());
    });

    function GetLength() {
        var value = parseInt(DOMLength.value);
        return (value > 0 ? value : DefaultLength);
    }

    function RandomString(length) {
        var z = [];
        for(var i = 0; z.length < length; i++) {
            z.push(`${String.fromCharCode(Math.floor(Math.random() * (126 - 33) + 33))}`);
        }
        return z.join('');
    }
});
