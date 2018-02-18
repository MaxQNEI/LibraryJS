"use strict";

window.addEventListener('load', function() {
    const DOMPassword = document.querySelector('.password');
    const DOMLength = document.querySelector('.length');
    const DOMGenerate = document.querySelector('.generate');

    const DefaultLength = 16;

    DOMPassword.placeholder = GenerateHardcorePassword(GetLength());

    DOMGenerate.addEventListener('click', function() {
        DOMPassword.value = GenerateHardcorePassword(GetLength());
    });

    function GetLength() {
        var value = parseInt(DOMLength.value);
        return (value > 0 ? value : DefaultLength);
    }

    function GenerateHardcorePassword(length) {
        var z = [];
        for(var i = 0; z.length < length; i++) {
            z.push(`${String.fromCharCode(Math.floor(Math.random() * (126 - 33) + 33))}`);
        }
        return z.join('');
    }
});
