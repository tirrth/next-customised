"use strict";
var _ = require("./");
var _eventSourcePolyfill = _interopRequireDefault(require("./dev/event-source-polyfill"));
var _onDemandEntriesClient = _interopRequireDefault(require("./dev/on-demand-entries-client"));
var _webpackHotMiddlewareClient = _interopRequireDefault(require("./dev/webpack-hot-middleware-client"));
var _devBuildWatcher = _interopRequireDefault(require("./dev/dev-build-watcher"));
var _fouc = require("./dev/fouc");
var _eventsource = require("./dev/error-overlay/eventsource");
var _querystring = require("../shared/lib/router/utils/querystring");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// Temporary workaround for the issue described here:
// https://github.com/vercel/next.js/issues/3775#issuecomment-407438123
// The runtimeChunk doesn't have dynamic import handling code when there hasn't been a dynamic import
// The runtimeChunk can't hot reload itself currently to correct it when adding pages using on-demand-entries
// eslint-disable-next-line no-unused-expressions
import('./dev/noop');;
// Support EventSource on Internet Explorer 11
if (!window.EventSource) {
    window.EventSource = _eventSourcePolyfill.default;
}
const { __NEXT_DATA__: { assetPrefix  } ,  } = window;
const prefix = assetPrefix || '';
const webpackHMR = (0, _webpackHotMiddlewareClient).default();
window.next = {
    version: _.version,
    // router is initialized later so it has to be live-binded
    get router () {
        return _.router;
    },
    emitter: _.emitter,
    render: _.render,
    renderError: _.renderError
};
(0, _).initNext({
    webpackHMR
}).then(({ renderCtx  })=>{
    (0, _onDemandEntriesClient).default({
        assetPrefix: prefix
    });
    let buildIndicatorHandler = ()=>{
    };
    function devPagesManifestListener(event) {
        if (event.data.indexOf('devPagesManifest') !== -1) {
            fetch(`${prefix}/_next/static/development/_devPagesManifest.json`).then((res)=>res.json()
            ).then((manifest)=>{
                window.__DEV_PAGES_MANIFEST = manifest;
            }).catch((err)=>{
                console.log(`Failed to fetch devPagesManifest`, err);
            });
        } else if (event.data.indexOf('serverOnlyChanges') !== -1) {
            const { pages  } = JSON.parse(event.data);
            // Make sure to reload when the dev-overlay is showing for an
            // API route
            if (pages.includes(_.router.query.__NEXT_PAGE)) {
                return window.location.reload();
            }
            if (!_.router.clc && pages.includes(_.router.pathname)) {
                console.log('Refreshing page data due to server-side change');
                buildIndicatorHandler('building');
                const clearIndicator = ()=>buildIndicatorHandler('built')
                ;
                _.router.replace(_.router.pathname + '?' + String((0, _querystring).assign((0, _querystring).urlQueryToSearchParams(_.router.query), new URLSearchParams(location.search))), _.router.asPath).finally(clearIndicator);
            }
        }
    }
    devPagesManifestListener.unfiltered = true;
    (0, _eventsource).addMessageListener(devPagesManifestListener);
    if (process.env.__NEXT_BUILD_INDICATOR) {
        (0, _devBuildWatcher).default((handler)=>{
            buildIndicatorHandler = handler;
        });
    }
    // delay rendering until after styles have been applied in development
    (0, _fouc).displayContent(()=>{
        (0, _).render(renderCtx);
    });
}).catch((err)=>{
    console.error('Error was not caught', err);
});

//# sourceMappingURL=next-dev.js.map