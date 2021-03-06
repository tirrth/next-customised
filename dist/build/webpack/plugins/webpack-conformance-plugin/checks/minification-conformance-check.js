"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _testInterface = require("../TestInterface");
var _constants = require("../constants");
const EARLY_EXIT_RESULT = {
    result: _testInterface.IConformanceTestStatus.SUCCESS
};
class MinificationConformanceCheck {
    buildStared(options) {
        if (options.output.path.endsWith('/server')) {
            return EARLY_EXIT_RESULT;
        }
        // TODO(prateekbh@): Implement warning for using Terser maybe?
        const { optimization  } = options;
        if (optimization && (optimization.minimize !== true || optimization.minimizer && optimization.minimizer.length === 0)) {
            return {
                result: _testInterface.IConformanceTestStatus.FAILED,
                errors: [
                    {
                        message: `${_constants.CONFORMANCE_ERROR_PREFIX}: Minification is disabled for this build.\nDisabling minification can result in serious performance degradation.`
                    }, 
                ]
            };
        } else {
            return EARLY_EXIT_RESULT;
        }
    }
}
exports.MinificationConformanceCheck = MinificationConformanceCheck;

//# sourceMappingURL=minification-conformance-check.js.map