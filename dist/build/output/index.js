"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startedDevelopmentServer = startedDevelopmentServer;
exports.formatAmpMessages = formatAmpMessages;
exports.ampValidation = ampValidation;
exports.watchCompilers = watchCompilers;
var _chalk = _interopRequireDefault(require("chalk"));
var _stripAnsi = _interopRequireDefault(require("next/dist/compiled/strip-ansi"));
var _textTable = _interopRequireDefault(require("next/dist/compiled/text-table"));
var _unistore = _interopRequireDefault(require("next/dist/compiled/unistore"));
var _formatWebpackMessages = _interopRequireDefault(require("../../client/dev/error-overlay/format-webpack-messages"));
var _store = require("./store");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function startedDevelopmentServer(appUrl, bindAddr) {
    _store.store.setState({
        appUrl,
        bindAddr
    });
}
let previousClient = null;
let previousServer = null;
var // eslint typescript has a bug with TS enums
/* eslint-disable no-shadow */ WebpackStatusPhase;
(function(WebpackStatusPhase1) {
    WebpackStatusPhase1[WebpackStatusPhase1["COMPILING"] = 1] = "COMPILING";
    WebpackStatusPhase1[WebpackStatusPhase1["COMPILED_WITH_ERRORS"] = 2] = "COMPILED_WITH_ERRORS";
    WebpackStatusPhase1[WebpackStatusPhase1["COMPILED_WITH_WARNINGS"] = 4] = "COMPILED_WITH_WARNINGS";
    WebpackStatusPhase1[WebpackStatusPhase1["COMPILED"] = 5] = "COMPILED";
})(WebpackStatusPhase || (WebpackStatusPhase = {
}));
function getWebpackStatusPhase(status) {
    if (status.loading) {
        return WebpackStatusPhase.COMPILING;
    }
    if (status.errors) {
        return WebpackStatusPhase.COMPILED_WITH_ERRORS;
    }
    if (status.warnings) {
        return WebpackStatusPhase.COMPILED_WITH_WARNINGS;
    }
    return WebpackStatusPhase.COMPILED;
}
function formatAmpMessages(amp) {
    let output = _chalk.default.bold('Amp Validation') + '\n\n';
    let messages = [];
    const chalkError = _chalk.default.red('error');
    function ampError(page, error) {
        messages.push([
            page,
            chalkError,
            error.message,
            error.specUrl || ''
        ]);
    }
    const chalkWarn = _chalk.default.yellow('warn');
    function ampWarn(page, warn) {
        messages.push([
            page,
            chalkWarn,
            warn.message,
            warn.specUrl || ''
        ]);
    }
    for(const page in amp){
        let { errors , warnings  } = amp[page];
        const devOnlyFilter = (err)=>err.code !== 'DEV_MODE_ONLY'
        ;
        errors = errors.filter(devOnlyFilter);
        warnings = warnings.filter(devOnlyFilter);
        if (!(errors.length || warnings.length)) {
            continue;
        }
        if (errors.length) {
            ampError(page, errors[0]);
            for(let index = 1; index < errors.length; ++index){
                ampError('', errors[index]);
            }
        }
        if (warnings.length) {
            ampWarn(errors.length ? '' : page, warnings[0]);
            for(let index = 1; index < warnings.length; ++index){
                ampWarn('', warnings[index]);
            }
        }
        messages.push([
            '',
            '',
            '',
            ''
        ]);
    }
    if (!messages.length) {
        return '';
    }
    output += (0, _textTable).default(messages, {
        align: [
            'l',
            'l',
            'l',
            'l'
        ],
        stringLength (str) {
            return (0, _stripAnsi).default(str).length;
        }
    });
    return output;
}
const buildStore = (0, _unistore).default();
buildStore.subscribe((state)=>{
    const { amp , client , server  } = state;
    const [{ status  }] = [
        {
            status: client,
            phase: getWebpackStatusPhase(client)
        },
        {
            status: server,
            phase: getWebpackStatusPhase(server)
        }, 
    ].sort((a, b)=>a.phase.valueOf() - b.phase.valueOf()
    );
    const { bootstrap: bootstrapping , appUrl  } = _store.store.getState();
    if (bootstrapping && status.loading) {
        return;
    }
    let partialState = {
        bootstrap: false,
        appUrl: appUrl
    };
    if (status.loading) {
        _store.store.setState({
            ...partialState,
            loading: true
        }, true);
    } else {
        let { errors , warnings  } = status;
        if (errors == null) {
            if (Object.keys(amp).length > 0) {
                warnings = (warnings || []).concat(formatAmpMessages(amp) || []);
                if (!warnings.length) warnings = null;
            }
        }
        _store.store.setState({
            ...partialState,
            loading: false,
            typeChecking: false,
            errors,
            warnings
        }, true);
    }
});
function ampValidation(page, errors, warnings) {
    const { amp  } = buildStore.getState();
    if (!(errors.length || warnings.length)) {
        buildStore.setState({
            amp: Object.keys(amp).filter((k)=>k !== page
            ).sort()// eslint-disable-next-line no-sequences
            .reduce((a, c)=>(a[c] = amp[c], a)
            , {
            })
        });
        return;
    }
    const newAmp = {
        ...amp,
        [page]: {
            errors,
            warnings
        }
    };
    buildStore.setState({
        amp: Object.keys(newAmp).sort()// eslint-disable-next-line no-sequences
        .reduce((a, c)=>(a[c] = newAmp[c], a)
        , {
        })
    });
}
function watchCompilers(client, server) {
    if (previousClient === client && previousServer === server) {
        return;
    }
    buildStore.setState({
        client: {
            loading: true
        },
        server: {
            loading: true
        }
    });
    function tapCompiler(key, compiler, onEvent) {
        compiler.hooks.invalid.tap(`NextJsInvalid-${key}`, ()=>{
            onEvent({
                loading: true
            });
        });
        compiler.hooks.done.tap(`NextJsDone-${key}`, (stats)=>{
            buildStore.setState({
                amp: {
                }
            });
            const { errors , warnings  } = (0, _formatWebpackMessages).default(stats.toJson({
                all: false,
                warnings: true,
                errors: true
            }));
            const hasErrors = !!(errors === null || errors === void 0 ? void 0 : errors.length);
            const hasWarnings = !!(warnings === null || warnings === void 0 ? void 0 : warnings.length);
            onEvent({
                loading: false,
                errors: hasErrors ? errors : null,
                warnings: hasWarnings ? warnings : null
            });
        });
    }
    tapCompiler('client', client, (status)=>buildStore.setState({
            client: status
        })
    );
    tapCompiler('server', server, (status)=>buildStore.setState({
            server: status
        })
    );
    previousClient = client;
    previousServer = server;
}

//# sourceMappingURL=index.js.map