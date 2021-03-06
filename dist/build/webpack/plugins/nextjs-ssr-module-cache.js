"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _webpack = require("next/dist/compiled/webpack/webpack");
var _path = require("path");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../../../server/get-route-from-entrypoint"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const SSR_MODULE_CACHE_FILENAME = 'ssr-module-cache.js';
class NextJsSsrImportPlugin {
    constructor(options){
        this.options = options;
    }
    apply(compiler) {
        const { outputPath  } = this.options;
        compiler.hooks.emit.tapAsync('NextJsSSRModuleCache', (compilation, callback)=>{
            compilation.assets[SSR_MODULE_CACHE_FILENAME] = new _webpack.sources.RawSource(`
      /* This cache is used by webpack for instantiated modules */
      module.exports = {}
      `);
            callback();
        });
        compiler.hooks.compilation.tap('NextJsSSRModuleCache', (compilation)=>{
            compilation.mainTemplate.hooks.localVars.intercept({
                register (tapInfo) {
                    if (tapInfo.name === 'MainTemplate') {
                        const originalFn = tapInfo.fn;
                        tapInfo.fn = (source, chunk)=>{
                            // If the chunk is not part of the pages directory we have to keep the original behavior,
                            // otherwise webpack will error out when the file is used before the compilation finishes
                            // this is the case with mini-css-extract-plugin
                            if (!(0, _getRouteFromEntrypoint).default(chunk.name)) {
                                return originalFn(source, chunk);
                            }
                            const pagePath = (0, _path).join(outputPath, (0, _path).dirname(chunk.name));
                            let relativePathToBaseDir = (0, _path).relative(pagePath, (0, _path).join(outputPath, SSR_MODULE_CACHE_FILENAME));
                            // Make sure even in windows, the path looks like in unix
                            // Node.js require system will convert it accordingly
                            const relativePathToBaseDirNormalized = relativePathToBaseDir.replace(/\\/g, '/');
                            return _webpack.webpack.Template.asString([
                                source,
                                '// The module cache',
                                `var installedModules = require('${relativePathToBaseDirNormalized}');`, 
                            ]);
                        };
                    }
                    return tapInfo;
                }
            });
        });
    }
}
exports.default = NextJsSsrImportPlugin;

//# sourceMappingURL=nextjs-ssr-module-cache.js.map