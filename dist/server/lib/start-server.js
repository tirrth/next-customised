"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = start;
var _http = _interopRequireDefault(require("http"));
var _next = _interopRequireDefault(require("../next"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function start(serverOptions, port, hostname) {
    const app = (0, _next).default({
        ...serverOptions,
        customServer: false
    });
    const srv = _http.default.createServer(app.getRequestHandler());
    await new Promise((resolve, reject)=>{
        // This code catches EADDRINUSE error if the port is already in use
        srv.on('error', reject);
        srv.on('listening', ()=>resolve()
        );
        srv.listen(port, hostname);
    });
    // It's up to caller to run `app.prepare()`, so it can notify that the server
    // is listening before starting any intensive operations.
    return app;
}

//# sourceMappingURL=start-server.js.map