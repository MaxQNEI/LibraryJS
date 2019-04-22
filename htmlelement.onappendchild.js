'use strict';

(function() {
    HTMLElement.prototype._appendChild = HTMLElement.prototype.appendChild;

    HTMLElement.prototype.appendChild = function() {
        var result = false;

        try {
            result = this._appendChild.apply(this, arguments);

            const evt = Object.assign(new Event('appendchild'), {
                parentElement: this,
                childElement: arguments[0],
            });

            document.dispatchEvent(evt);
            this.dispatchEvent(evt);
            arguments[0].dispatchEvent(evt);

            OnElementsUpdate(evt);
        } catch(e) {
            console.error(e);
        }

        return result;
    };
})();
