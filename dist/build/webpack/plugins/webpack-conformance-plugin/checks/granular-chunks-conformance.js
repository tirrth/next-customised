"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _chalk = _interopRequireDefault(require("chalk"));
var _constants = require("../constants");
var _testInterface = require("../TestInterface");
var _utils = require("../utils/utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getWarningMessage(modifiedProp) {
    return `${_constants.CONFORMANCE_WARNING_PREFIX}: The splitChunks config has been carefully ` + `crafted to optimize build size and build times. Modifying - ${_chalk.default.bold(modifiedProp)} could result in slower builds and increased code duplication`;
}
function getErrorMessage(message) {
    return `${_constants.CONFORMANCE_ERROR_PREFIX}: The splitChunks config has been carefully ` + `crafted to optimize build size and build times. Please avoid changes to ${_chalk.default.bold(message)}`;
}
class GranularChunksConformanceCheck {
    constructor(granularChunksConfig){
        this.granularChunksConfig = granularChunksConfig;
    }
    buildStared(options) {
        const userSplitChunks = options.optimization.splitChunks;
        const warnings = [];
        const errors = [];
        if (userSplitChunks.maxInitialRequests !== this.granularChunksConfig.maxInitialRequests) {
            warnings.push('splitChunks.maxInitialRequests');
        }
        if (userSplitChunks.minSize !== this.granularChunksConfig.minSize) {
            warnings.push('splitChunks.minSize');
        }
        const userCacheGroup = userSplitChunks.cacheGroups;
        const originalCacheGroup = this.granularChunksConfig.cacheGroups;
        if (userCacheGroup.vendors !== false) {
            errors.push('splitChunks.cacheGroups.vendors');
        }
        if (!(0, _utils).deepEqual(userCacheGroup.framework, originalCacheGroup.framework)) {
            errors.push('splitChunks.cacheGroups.framework');
        }
        if (!(0, _utils).deepEqual(userCacheGroup.lib, originalCacheGroup.lib)) {
            errors.push('splitChunks.cacheGroups.lib');
        }
        if (!(0, _utils).deepEqual(userCacheGroup.commons, originalCacheGroup.commons)) {
            errors.push('splitChunks.cacheGroups.commons');
        }
        if (!(0, _utils).deepEqual(userCacheGroup.shared, originalCacheGroup.shared)) {
            errors.push('splitChunks.cacheGroups.shared');
        }
        if (!warnings.length && !errors.length) {
            return {
                result: _testInterface.IConformanceTestStatus.SUCCESS
            };
        }
        const failedResult = {
            result: _testInterface.IConformanceTestStatus.FAILED
        };
        if (warnings.length) {
            failedResult.warnings = warnings.map((warning)=>({
                    message: getWarningMessage(warning)
                })
            );
        }
        if (errors.length) {
            failedResult.warnings = errors.map((error)=>({
                    message: getErrorMessage(error)
                })
            );
        }
        return failedResult;
    }
}
exports.GranularChunksConformanceCheck = GranularChunksConformanceCheck;

//# sourceMappingURL=granular-chunks-conformance.js.map