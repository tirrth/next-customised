"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPagesMapping = createPagesMapping;
exports.createEntrypoints = createEntrypoints;
var _chalk = _interopRequireDefault(require("chalk"));
var _path = require("path");
var _querystring = require("querystring");
var _constants = require("../lib/constants");
var _config = require("../server/config");
var _normalizePagePath = require("../server/normalize-page-path");
var _log = require("./output/log");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createPagesMapping(pagePaths, extensions, isWebpack5, isDev) {
    const previousPages = {
    };
    const pages = pagePaths.reduce((result, pagePath)=>{
        let page = `${pagePath.replace(new RegExp(`\\.+(${extensions.join('|')})$`), '').replace(/\\/g, '/')}`.replace(/\/index$/, '');
        const pageKey = page === '' ? '/' : page;
        if (pageKey in result) {
            (0, _log).warn(`Duplicate page detected. ${_chalk.default.cyan((0, _path).join('pages', previousPages[pageKey]))} and ${_chalk.default.cyan((0, _path).join('pages', pagePath))} both resolve to ${_chalk.default.cyan(pageKey)}.`);
        } else {
            previousPages[pageKey] = pagePath;
        }
        result[pageKey] = (0, _path).join(_constants.PAGES_DIR_ALIAS, pagePath).replace(/\\/g, '/');
        return result;
    }, {
    });
    // we alias these in development and allow webpack to
    // allow falling back to the correct source file so
    // that HMR can work properly when a file is added/removed
    if (isWebpack5 && isDev) {
        pages['/_app'] = `${_constants.PAGES_DIR_ALIAS}/_app`;
        pages['/_error'] = `${_constants.PAGES_DIR_ALIAS}/_error`;
        pages['/_document'] = `${_constants.PAGES_DIR_ALIAS}/_document`;
    } else {
        pages['/_app'] = pages['/_app'] || 'next/dist/pages/_app';
        pages['/_error'] = pages['/_error'] || 'next/dist/pages/_error';
        pages['/_document'] = pages['/_document'] || 'next/dist/pages/_document';
    }
    return pages;
}
function createEntrypoints(pages, target, buildId, previewMode, config, loadedEnvFiles) {
    const client = {
    };
    const server = {
    };
    const hasRuntimeConfig = Object.keys(config.publicRuntimeConfig).length > 0 || Object.keys(config.serverRuntimeConfig).length > 0;
    const defaultServerlessOptions = {
        absoluteAppPath: pages['/_app'],
        absoluteDocumentPath: pages['/_document'],
        absoluteErrorPath: pages['/_error'],
        absolute404Path: pages['/404'] || '',
        distDir: _constants.DOT_NEXT_ALIAS,
        buildId,
        assetPrefix: config.assetPrefix,
        generateEtags: config.generateEtags ? 'true' : '',
        poweredByHeader: config.poweredByHeader ? 'true' : '',
        canonicalBase: config.amp.canonicalBase || '',
        basePath: config.basePath,
        runtimeConfig: hasRuntimeConfig ? JSON.stringify({
            publicRuntimeConfig: config.publicRuntimeConfig,
            serverRuntimeConfig: config.serverRuntimeConfig
        }) : '',
        previewProps: JSON.stringify(previewMode),
        // base64 encode to make sure contents don't break webpack URL loading
        loadedEnvFiles: Buffer.from(JSON.stringify(loadedEnvFiles)).toString('base64'),
        i18n: config.i18n ? JSON.stringify(config.i18n) : ''
    };
    Object.keys(pages).forEach((page)=>{
        const absolutePagePath = pages[page];
        const bundleFile = (0, _normalizePagePath).normalizePagePath(page);
        const isApiRoute = page.match(_constants.API_ROUTE);
        const clientBundlePath = _path.posix.join('pages', bundleFile);
        const serverBundlePath = _path.posix.join('pages', bundleFile);
        const isLikeServerless = (0, _config).isTargetLikeServerless(target);
        if (isApiRoute && isLikeServerless) {
            const serverlessLoaderOptions = {
                page,
                absolutePagePath,
                ...defaultServerlessOptions
            };
            server[serverBundlePath] = `next-serverless-loader?${(0, _querystring).stringify(serverlessLoaderOptions)}!`;
        } else if (isApiRoute || target === 'server') {
            server[serverBundlePath] = [
                absolutePagePath
            ];
        } else if (isLikeServerless && page !== '/_app' && page !== '/_document') {
            const serverlessLoaderOptions = {
                page,
                absolutePagePath,
                ...defaultServerlessOptions
            };
            server[serverBundlePath] = `next-serverless-loader?${(0, _querystring).stringify(serverlessLoaderOptions)}!`;
        }
        if (page === '/_document') {
            return;
        }
        if (!isApiRoute) {
            const pageLoaderOpts = {
                page,
                absolutePagePath
            };
            const pageLoader = `next-client-pages-loader?${(0, _querystring).stringify(pageLoaderOpts)}!`;
            // Make sure next/router is a dependency of _app or else chunk splitting
            // might cause the router to not be able to load causing hydration
            // to fail
            client[clientBundlePath] = page === '/_app' ? [
                pageLoader,
                require.resolve('../client/router')
            ] : pageLoader;
        }
    });
    return {
        client,
        server
    };
}

//# sourceMappingURL=entries.js.map