"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createTrace = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let maybeInspector;
try {
    maybeInspector = require('inspector');
} catch (e) {
    console.log('Unable to CPU profile in < node 8.0');
}
class Profiler {
    constructor(inspector){
        this.session = undefined;
        this.inspector = inspector;
    }
    hasSession() {
        return this.session !== undefined;
    }
    startProfiling() {
        if (this.inspector === undefined) {
            return Promise.resolve();
        }
        try {
            this.session = new maybeInspector.Session();
            this.session.connect();
        } catch (_) {
            this.session = undefined;
            return Promise.resolve();
        }
        return Promise.all([
            this.sendCommand('Profiler.setSamplingInterval', {
                interval: 100
            }),
            this.sendCommand('Profiler.enable'),
            this.sendCommand('Profiler.start'), 
        ]);
    }
    sendCommand(method, params) {
        if (this.hasSession()) {
            return new Promise((resolve, reject)=>{
                return this.session.post(method, params, (err, sessionParams)=>{
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(sessionParams);
                    }
                });
            });
        } else {
            return Promise.resolve();
        }
    }
    destroy() {
        if (this.hasSession()) {
            this.session.disconnect();
        }
        return Promise.resolve();
    }
    stopProfiling() {
        return this.sendCommand('Profiler.stop');
    }
}
// eslint-disable-next-line import/no-extraneous-dependencies
const { Tracer  } = require('chrome-trace-event');
const createTrace = (outputPath)=>{
    const trace = new Tracer({
        noStream: true
    });
    const profiler = new Profiler(maybeInspector);
    if (/\/|\\/.test(outputPath)) {
        const dirPath = _path.default.dirname(outputPath);
        _fs.default.mkdirSync(dirPath, {
            recursive: true
        });
    }
    const fsStream = _fs.default.createWriteStream(outputPath);
    let counter = 0;
    trace.pipe(fsStream);
    // These are critical events that need to be inserted so that tools like
    // chrome dev tools can load the profile.
    trace.instantEvent({
        name: 'TracingStartedInPage',
        id: ++counter,
        cat: [
            'disabled-by-default-devtools.timeline'
        ],
        args: {
            data: {
                sessionId: '-1',
                page: '0xfff',
                frames: [
                    {
                        frame: '0xfff',
                        url: 'webpack',
                        name: ''
                    }, 
                ]
            }
        }
    });
    trace.instantEvent({
        name: 'TracingStartedInBrowser',
        id: ++counter,
        cat: [
            'disabled-by-default-devtools.timeline'
        ],
        args: {
            data: {
                sessionId: '-1'
            }
        }
    });
    return {
        trace,
        counter,
        profiler,
        end: (callback)=>{
            // Wait until the write stream finishes.
            fsStream.on('finish', ()=>{
                callback();
            });
            // Tear down the readable trace stream.
            trace.push(null);
        }
    };
};
exports.createTrace = createTrace;

//# sourceMappingURL=profiler.js.map