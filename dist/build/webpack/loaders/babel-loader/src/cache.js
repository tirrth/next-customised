"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleCache;
var _crypto = require("crypto");
var _trace = require("../../../../../telemetry/trace");
var _transform = _interopRequireDefault(require("./transform"));
var _cacache = _interopRequireDefault(require("next/dist/compiled/cacache"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function read(cacheDirectory, etag) {
    const cachedResult = await (0, _trace).trace('read-cache-file').traceAsyncFn(()=>_cacache.default.get(cacheDirectory, etag)
    );
    return JSON.parse(cachedResult.data);
}
function write(cacheDirectory, etag, data) {
    return (0, _trace).trace('write-cache-file').traceAsyncFn(()=>_cacache.default.put(cacheDirectory, etag, JSON.stringify(data))
    );
}
const etag = function(source, identifier, options) {
    return (0, _trace).trace('etag').traceFn(()=>{
        const hash = (0, _crypto).createHash('md4');
        const contents = JSON.stringify({
            source,
            options,
            identifier
        });
        hash.update(contents);
        return hash.digest('hex');
    });
};
async function handleCache(params) {
    const span = (0, _trace).trace('handle-cache');
    return span.traceAsyncFn(async ()=>{
        const { source , options ={
        } , cacheIdentifier , cacheDirectory  } = params;
        const file = etag(source, cacheIdentifier);
        try {
            // No errors mean that the file was previously cached
            // we just need to return it
            const res = await read(cacheDirectory, file);
            span.setAttribute('cache', res ? 'HIT' : 'MISS');
            return res;
        } catch (err) {
        }
        // Otherwise just transform the file
        // return it to the user asap and write it in cache
        const result = await (0, _trace).trace('transform').traceAsyncFn(async ()=>{
            return (0, _transform).default(source, options);
        });
        await write(cacheDirectory, file, result);
        return result;
    });
}

//# sourceMappingURL=cache.js.map