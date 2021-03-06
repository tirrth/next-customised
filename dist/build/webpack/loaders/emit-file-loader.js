"use strict";
var _loaderUtils = _interopRequireDefault(require("next/dist/compiled/loader-utils"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
module.exports = function(content, sourceMap) {
    this.cacheable();
    const callback = this.async();
    const resourcePath = this.resourcePath;
    const query = _loaderUtils.default.getOptions(this);
    // Allows you to do checks on the file name. For example it's used to check if there's both a .js and .jsx file.
    if (query.validateFileName) {
        try {
            query.validateFileName(resourcePath);
        } catch (err) {
            callback(err);
            return;
        }
    }
    const name = query.name || '[hash].[ext]';
    const context = query.context || this.rootContext || this.options.context;
    const regExp = query.regExp;
    const opts = {
        context,
        content,
        regExp
    };
    const interpolateName = query.interpolateName || ((inputName)=>inputName
    );
    const interpolatedName = interpolateName(_loaderUtils.default.interpolateName(this, name, opts), {
        name,
        opts
    });
    const emit = (code, map)=>{
        this.emitFile(interpolatedName, code, map);
        callback(null, code, map);
    };
    if (query.transform) {
        const transformed = query.transform({
            content,
            sourceMap,
            interpolatedName
        });
        return emit(transformed.content, transformed.sourceMap);
    }
    return emit(content, sourceMap);
};

//# sourceMappingURL=emit-file-loader.js.map