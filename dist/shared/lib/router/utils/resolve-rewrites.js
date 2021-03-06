"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resolveRewrites;
var _pathMatch = _interopRequireDefault(require("./path-match"));
var _prepareDestination = _interopRequireWildcard(require("./prepare-destination"));
var _normalizeTrailingSlash = require("../../../../client/normalize-trailing-slash");
var _normalizeLocalePath = require("../../i18n/normalize-locale-path");
var _parseRelativeUrl = require("./parse-relative-url");
var _router = require("../router");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const customRouteMatcher = (0, _pathMatch).default(true);
function resolveRewrites(asPath, pages, rewrites, query, resolveHref, locales) {
    let matchedPage = false;
    let parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(asPath);
    let fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(parsedAs.pathname), locales).pathname);
    let resolvedHref;
    const handleRewrite = (rewrite)=>{
        const matcher = customRouteMatcher(rewrite.source);
        let params = matcher(parsedAs.pathname);
        if (rewrite.has && params) {
            const hasParams = (0, _prepareDestination).matchHas({
                headers: {
                    host: document.location.hostname
                },
                cookies: document.cookie.split('; ').reduce((acc, item)=>{
                    const [key, ...value] = item.split('=');
                    acc[key] = value.join('=');
                    return acc;
                }, {
                })
            }, rewrite.has, parsedAs.query);
            if (hasParams) {
                Object.assign(params, hasParams);
            } else {
                params = false;
            }
        }
        if (params) {
            if (!rewrite.destination) {
                // this is a proxied rewrite which isn't handled on the client
                return true;
            }
            const destRes = (0, _prepareDestination).default(rewrite.destination, params, query, true);
            parsedAs = destRes.parsedDestination;
            asPath = destRes.newUrl;
            Object.assign(query, destRes.parsedDestination.query);
            fsPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _normalizeLocalePath).normalizeLocalePath((0, _router).delBasePath(asPath), locales).pathname);
            if (pages.includes(fsPathname)) {
                // check if we now match a page as this means we are done
                // resolving the rewrites
                matchedPage = true;
                resolvedHref = fsPathname;
                return true;
            }
            // check if we match a dynamic-route, if so we break the rewrites chain
            resolvedHref = resolveHref(fsPathname);
            if (resolvedHref !== asPath && pages.includes(resolvedHref)) {
                matchedPage = true;
                return true;
            }
        }
    };
    let finished = false;
    for(let i = 0; i < rewrites.beforeFiles.length; i++){
        // we don't end after match in beforeFiles to allow
        // continuing through all beforeFiles rewrites
        handleRewrite(rewrites.beforeFiles[i]);
    }
    matchedPage = pages.includes(fsPathname);
    if (!matchedPage) {
        if (!finished) {
            for(let i1 = 0; i1 < rewrites.afterFiles.length; i1++){
                if (handleRewrite(rewrites.afterFiles[i1])) {
                    finished = true;
                    break;
                }
            }
        }
        // check dynamic route before processing fallback rewrites
        if (!finished) {
            resolvedHref = resolveHref(fsPathname);
            matchedPage = pages.includes(resolvedHref);
            finished = matchedPage;
        }
        if (!finished) {
            for(let i1 = 0; i1 < rewrites.fallback.length; i1++){
                if (handleRewrite(rewrites.fallback[i1])) {
                    finished = true;
                    break;
                }
            }
        }
    }
    return {
        asPath,
        parsedAs,
        matchedPage,
        resolvedHref
    };
}

//# sourceMappingURL=resolve-rewrites.js.map