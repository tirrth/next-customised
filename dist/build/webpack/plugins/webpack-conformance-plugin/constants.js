"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CONFORMANCE_ERROR_PREFIX = exports.CONFORMANCE_WARNING_PREFIX = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { red , yellow  } = _chalk.default;
const CONFORMANCE_ERROR_PREFIX = red('[BUILD CONFORMANCE ERROR]');
exports.CONFORMANCE_ERROR_PREFIX = CONFORMANCE_ERROR_PREFIX;
const CONFORMANCE_WARNING_PREFIX = yellow('[BUILD CONFORMANCE WARNING]');
exports.CONFORMANCE_WARNING_PREFIX = CONFORMANCE_WARNING_PREFIX;

//# sourceMappingURL=constants.js.map