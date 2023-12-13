Object.defineProperties(Object.prototype, {
    propByPath: {
        enumerable: true,
        value: function propByPath(path = "") {
            const pieces = path.split(".");
            let value;

            for (const piece of pieces) {
                if (this[piece] === undefined) {
                    return undefined;
                }

                value = this[piece];
            }

            return value;
        },
    },
});
