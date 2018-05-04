'use strict';

Object.defineProperties(window, {
    GUID: { enumerable: true, value: function GUID() {
        function s4() {
            return Math.round((Math.random()+1)*1e5).toString(16).substr(1,4);
        }
        return ([s4(),s4(),'-',s4(),'-',s4(),'-',s4(),'-',s4(),s4(),s4()]).join('');
    } },
});