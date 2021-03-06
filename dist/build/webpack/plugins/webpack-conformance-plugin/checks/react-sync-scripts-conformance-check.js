"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ErrorMessage = exports.ErrorDescription = exports.WarningMessage = void 0;
var _testInterface = require("../TestInterface");
var _constants = require("../constants");
var _fileUtils = require("../utils/file-utils");
var _astUtils = require("../utils/ast-utils");
const ErrorMessage = `${_constants.CONFORMANCE_ERROR_PREFIX}: A sync script was found in a react module.`;
exports.ErrorMessage = ErrorMessage;
const WarningMessage = `${_constants.CONFORMANCE_WARNING_PREFIX}: A sync script was found in a react module.`;
exports.WarningMessage = WarningMessage;
const ErrorDescription = ``;
exports.ErrorDescription = ErrorDescription;
const EARLY_EXIT_SUCCESS_RESULT = {
    result: _testInterface.IConformanceTestStatus.SUCCESS
};
class ReactSyncScriptsConformanceCheck {
    constructor({ AllowedSources  } = {
    }){
        this.allowedSources = [];
        if (AllowedSources) {
            this.allowedSources = AllowedSources;
        }
    }
    getAstNode() {
        return [
            {
                visitor: 'visitCallExpression',
                inspectNode: (path, { request  })=>{
                    const { node  } = path;
                    if (!node.arguments || node.arguments.length < 2) {
                        return EARLY_EXIT_SUCCESS_RESULT;
                    }
                    if ((0, _astUtils).isNodeCreatingScriptElement(node)) {
                        const propsNode = node.arguments[1];
                        if (!propsNode.properties) {
                            return EARLY_EXIT_SUCCESS_RESULT;
                        }
                        const props = propsNode.properties.reduce((originalProps, prop)=>{
                            // @ts-ignore
                            originalProps[prop.key.name] = prop.value.value;
                            return originalProps;
                        }, {
                        });
                        if ('defer' in props || 'async' in props || !('src' in props) || this.allowedSources.includes(props.src)) {
                            return EARLY_EXIT_SUCCESS_RESULT;
                        }
                        // Todo: Add an absolute error case for modern js when class is a subclass of next/head.
                        return {
                            result: _testInterface.IConformanceTestStatus.FAILED,
                            warnings: [
                                {
                                    message: `${WarningMessage} ${(0, _fileUtils).getLocalFileName(request)}. This can potentially delay FCP/FP metrics.`
                                }, 
                            ]
                        };
                    }
                    return EARLY_EXIT_SUCCESS_RESULT;
                }
            }, 
        ];
    }
}
exports.ReactSyncScriptsConformanceCheck = ReactSyncScriptsConformanceCheck;

//# sourceMappingURL=react-sync-scripts-conformance-check.js.map