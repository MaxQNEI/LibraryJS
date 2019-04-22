'use strict';

(function() {
    HTMLElement.prototype._insertBefore = HTMLElement.prototype.insertBefore;

    HTMLElement.prototype.insertBefore = function() {
        var result = false;

        try {
            result = this._insertBefore.apply(this, arguments);

            const evt = Object.assign(new Event('insertbefore'), {
                parentElement: this,
                newElement: arguments[0],
                refElement: arguments[1],
            });

            document.dispatchEvent(evt);
            this.dispatchEvent(evt);
            arguments[0].dispatchEvent(evt);
            arguments[1] && arguments[1].dispatchEvent(evt);

            OnElementsUpdate(evt);
        } catch(e) {
            console.error(e);
        }

        return result;
    };
})();
