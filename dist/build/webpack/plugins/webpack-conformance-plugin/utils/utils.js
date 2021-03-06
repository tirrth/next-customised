"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepEqual = deepEqual;
const assert = require('assert').strict;
function deepEqual(a, b) {
    try {
        assert.deepStrictEqual(a, b);
        return true;
    } catch (_) {
        return false;
    }
}

//# sourceMappingURL=utils.js.map