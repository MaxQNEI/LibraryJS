"use strict";

window.addEventListener('load', function() {
    const DOMGUID = document.querySelector('.guid');
    const DOMGenerate = document.querySelector('.generate');

    DOMGUID.placeholder = GUID();

    DOMGenerate.addEventListener('click', function() {
        DOMGUID.value = GUID();
    });

    function GUID() {
        function s4() {
            return Math.round((Math.random()+1)*1e4).toString(16);
        }

        return ([s4(),s4(),'-',s4(),'-',s4(),'-',s4(),'-',s4(),s4(),s4()]).join('');
    }
});
