"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SERVER_DIRECTORY = exports.PAGES_MANIFEST = exports.SERVER_PROPS_ID = exports.CLIENT_STATIC_FILES_RUNTIME_WEBPACK = exports.PERMANENT_REDIRECT_STATUS = exports.SERVER_FILES_MANIFEST = exports.STATIC_PROPS_ID = exports.BUILD_MANIFEST = exports.BLOCKED_PAGES = exports.STATIC_STATUS_PAGES = exports.PRERENDER_MANIFEST = exports.DEV_CLIENT_PAGES_MANIFEST = exports.OPTIMIZED_FONT_PROVIDERS = exports.TEMPORARY_REDIRECT_STATUS = exports.SERVERLESS_DIRECTORY = exports.EXPORT_MARKER = exports.GOOGLE_FONT_PROVIDER = exports.PHASE_PRODUCTION_BUILD = exports.CLIENT_STATIC_FILES_RUNTIME_MAIN = exports.BUILD_ID_FILE = exports.CONFIG_FILE = exports.CLIENT_STATIC_FILES_RUNTIME = exports.PHASE_PRODUCTION_SERVER = exports.EXPORT_DETAIL = exports.IMAGES_MANIFEST = exports.CLIENT_STATIC_FILES_RUNTIME_AMP = exports.CLIENT_PUBLIC_FILES_PATH = exports.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = exports.STRING_LITERAL_DROP_BUNDLE = exports.TRACE_OUTPUT_VERSION = exports.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = exports.FONT_MANIFEST = exports.REACT_LOADABLE_MANIFEST = exports.ROUTES_MANIFEST = exports.CLIENT_STATIC_FILES_PATH = exports.BODY_RENDER_TARGET = exports.PHASE_EXPORT = exports.PHASE_DEVELOPMENT_SERVER = void 0;
const PHASE_EXPORT = 'phase-export';
exports.PHASE_EXPORT = PHASE_EXPORT;
const PHASE_PRODUCTION_BUILD = 'phase-production-build';
exports.PHASE_PRODUCTION_BUILD = PHASE_PRODUCTION_BUILD;
const PHASE_PRODUCTION_SERVER = 'phase-production-server';
exports.PHASE_PRODUCTION_SERVER = PHASE_PRODUCTION_SERVER;
const PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
exports.PHASE_DEVELOPMENT_SERVER = PHASE_DEVELOPMENT_SERVER;
const PAGES_MANIFEST = 'pages-manifest.json';
exports.PAGES_MANIFEST = PAGES_MANIFEST;
const BUILD_MANIFEST = 'build-manifest.json';
exports.BUILD_MANIFEST = BUILD_MANIFEST;
const EXPORT_MARKER = 'export-marker.json';
exports.EXPORT_MARKER = EXPORT_MARKER;
const EXPORT_DETAIL = 'export-detail.json';
exports.EXPORT_DETAIL = EXPORT_DETAIL;
const PRERENDER_MANIFEST = 'prerender-manifest.json';
exports.PRERENDER_MANIFEST = PRERENDER_MANIFEST;
const ROUTES_MANIFEST = 'routes-manifest.json';
exports.ROUTES_MANIFEST = ROUTES_MANIFEST;
const IMAGES_MANIFEST = 'images-manifest.json';
exports.IMAGES_MANIFEST = IMAGES_MANIFEST;
const SERVER_FILES_MANIFEST = 'required-server-files.json';
exports.SERVER_FILES_MANIFEST = SERVER_FILES_MANIFEST;
const DEV_CLIENT_PAGES_MANIFEST = '_devPagesManifest.json';
exports.DEV_CLIENT_PAGES_MANIFEST = DEV_CLIENT_PAGES_MANIFEST;
const REACT_LOADABLE_MANIFEST = 'react-loadable-manifest.json';
exports.REACT_LOADABLE_MANIFEST = REACT_LOADABLE_MANIFEST;
const FONT_MANIFEST = 'font-manifest.json';
exports.FONT_MANIFEST = FONT_MANIFEST;
const SERVER_DIRECTORY = 'server';
exports.SERVER_DIRECTORY = SERVER_DIRECTORY;
const SERVERLESS_DIRECTORY = 'serverless';
exports.SERVERLESS_DIRECTORY = SERVERLESS_DIRECTORY;
const CONFIG_FILE = 'next.config.js';
exports.CONFIG_FILE = CONFIG_FILE;
const BUILD_ID_FILE = 'BUILD_ID';
exports.BUILD_ID_FILE = BUILD_ID_FILE;
const BLOCKED_PAGES = [
    '/_document',
    '/_app',
    '/_error'
];
exports.BLOCKED_PAGES = BLOCKED_PAGES;
const CLIENT_PUBLIC_FILES_PATH = 'public';
exports.CLIENT_PUBLIC_FILES_PATH = CLIENT_PUBLIC_FILES_PATH;
const CLIENT_STATIC_FILES_PATH = 'static';
exports.CLIENT_STATIC_FILES_PATH = CLIENT_STATIC_FILES_PATH;
const CLIENT_STATIC_FILES_RUNTIME = 'runtime';
exports.CLIENT_STATIC_FILES_RUNTIME = CLIENT_STATIC_FILES_RUNTIME;
const BODY_RENDER_TARGET = '__NEXT_BODY_RENDER_TARGET__';
exports.BODY_RENDER_TARGET = BODY_RENDER_TARGET;
const STRING_LITERAL_DROP_BUNDLE = '__NEXT_DROP_CLIENT_FILE__';
exports.STRING_LITERAL_DROP_BUNDLE = STRING_LITERAL_DROP_BUNDLE;
const CLIENT_STATIC_FILES_RUNTIME_MAIN = `main`;
exports.CLIENT_STATIC_FILES_RUNTIME_MAIN = CLIENT_STATIC_FILES_RUNTIME_MAIN;
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = `react-refresh`;
exports.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH;
const CLIENT_STATIC_FILES_RUNTIME_AMP = `amp`;
exports.CLIENT_STATIC_FILES_RUNTIME_AMP = CLIENT_STATIC_FILES_RUNTIME_AMP;
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = `webpack`;
exports.CLIENT_STATIC_FILES_RUNTIME_WEBPACK = CLIENT_STATIC_FILES_RUNTIME_WEBPACK;
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(`polyfills`);
exports.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL;
const TEMPORARY_REDIRECT_STATUS = 307;
exports.TEMPORARY_REDIRECT_STATUS = TEMPORARY_REDIRECT_STATUS;
const PERMANENT_REDIRECT_STATUS = 308;
exports.PERMANENT_REDIRECT_STATUS = PERMANENT_REDIRECT_STATUS;
const STATIC_PROPS_ID = '__N_SSG';
exports.STATIC_PROPS_ID = STATIC_PROPS_ID;
const SERVER_PROPS_ID = '__N_SSP';
exports.SERVER_PROPS_ID = SERVER_PROPS_ID;
const GOOGLE_FONT_PROVIDER = 'https://fonts.googleapis.com/css';
exports.GOOGLE_FONT_PROVIDER = GOOGLE_FONT_PROVIDER;
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: 'https://fonts.gstatic.com'
    },
    {
        url: 'https://use.typekit.net',
        preconnect: 'https://use.typekit.net'
    }, 
];
exports.OPTIMIZED_FONT_PROVIDERS = OPTIMIZED_FONT_PROVIDERS;
const STATIC_STATUS_PAGES = [
    '/500'
];
exports.STATIC_STATUS_PAGES = STATIC_STATUS_PAGES;
const TRACE_OUTPUT_VERSION = 1;
exports.TRACE_OUTPUT_VERSION = TRACE_OUTPUT_VERSION;

//# sourceMappingURL=constants.js.map